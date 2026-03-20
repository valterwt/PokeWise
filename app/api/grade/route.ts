import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Lazy init — avoids module-level crash when env var is missing
function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured')
  return new Anthropic({ apiKey })
}

async function checkAndConsumeCredit(): Promise<
  { allowed: true } | { allowed: false; reason: string; requiresAuth?: boolean }
> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { allowed: false, reason: 'Sign in to grade your cards.', requiresAuth: true }
  }

  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  )

  const { data, error } = await adminClient.rpc('consume_grade_credit', {
    p_user_id: user.id,
  })

  if (error) {
    console.error('[grade] consume_grade_credit error:', error)
    // Let it through if DB check fails — don't block grading on DB errors
    return { allowed: true }
  }

  if (data === false) {
    return { allowed: false, reason: 'No grades remaining. Upgrade to continue.' }
  }

  return { allowed: true }
}

export async function POST(req: NextRequest) {
  try {
    const creditCheck = await checkAndConsumeCredit()

    if (!creditCheck.allowed) {
      const status = 'requiresAuth' in creditCheck && creditCheck.requiresAuth ? 401 : 402
      return NextResponse.json({ error: creditCheck.reason }, { status })
    }

    const client = getClient()

    const formData = await req.formData()
    const frontFile = formData.get('front') as File | null
    const backFile  = formData.get('back')  as File | null
    const cardName  = formData.get('cardName') as string | null

    if (!frontFile) {
      return NextResponse.json({ error: 'Front image is required' }, { status: 400 })
    }

    const toBase64 = async (file: File) =>
      Buffer.from(await file.arrayBuffer()).toString('base64')

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
    type ValidMime = (typeof validTypes)[number]
    const assertMime = (t: string): ValidMime =>
      validTypes.includes(t as ValidMime) ? (t as ValidMime) : 'image/jpeg'

    const imageContents: Anthropic.ImageBlockParam[] = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: assertMime(frontFile.type),
          data: await toBase64(frontFile),
        },
      },
    ]

    if (backFile) {
      imageContents.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: assertMime(backFile.type),
          data: await toBase64(backFile),
        },
      })
    }

    const cardNote = cardName ? `The card is identified as: ${cardName}.` : ''

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            {
              type: 'text',
              text: `You are a strict, professional Pokémon card grader following PSA standards exactly. ${cardNote}

━━━ CRITICAL RULE — READ FIRST ━━━
If the card has ANY of the following, the OVERALL grade MUST be 1.0 and corners MUST be 1.0. No exceptions. Do not let centering, surface, or other sub-scores raise the overall above 1:
  • One or more ripped, torn, or physically split corners
  • Any torn or missing section of the card border/edge
  • A hole, punch, or tear through the card surface
  • The card is split or broken into pieces

A PSA grade of 1 (Poor/Authentic) is a legitimate grade — it means the card is identifiable but structurally damaged. Do NOT round up to 2 or above when structural damage is present.

━━━ GRADE SCALE ━━━
10 — Gem Mint: Flawless. No visible imperfections under 5× magnification.
 9 — Mint: Near perfect. Only the tiniest allowable flaw (e.g. one microscopic corner nick).
 8 — Near Mint–Mint: Very light wear. Slight corner wear, excellent centering.
 7 — Near Mint: Minor handling wear visible. Centering may be slightly off.
 6 — Excellent–Near Mint: Light surface wear, slight border scratches, minor corner rounding.
 5 — Excellent: Multiple light scratches, moderate corner rounding, minor chipping.
 4 — Very Good–Excellent: Noticeable wear on all edges, heavier corner rounding, surface marks.
 3 — Very Good: Heavy wear, edge fraying, significant surface scratches, rounded corners.
 2 — Good: Major creases visible, staining, very heavy corner rounding (not ripped or torn).
 1 — Poor/Authentic: Structural damage — ripped corners, torn edges, missing pieces. Card is identifiable but damaged beyond normal wear.

Return ONLY a valid JSON object with no additional text:
{
  "grade": <number 1-10, can be .5 increments>,
  "centering": <number 1-10>,
  "corners": <number 1-10>,
  "edges": <number 1-10>,
  "surface": <number 1-10>,
  "summary": "<2-3 sentence condition report>",
  "recommendation": "<worth grading professionally? yes/no and why>"
}`,
            },
          ],
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in AI response')

    const result = JSON.parse(jsonMatch[0])

    if (typeof result.grade !== 'number' || result.grade < 1 || result.grade > 10) {
      throw new Error('Invalid grade value from AI')
    }

    // Server-side safety clamp: if AI scored corners as 1 (structural damage),
    // the overall grade cannot be above 1 — enforce the hard rule even if the
    // model slipped and returned a higher overall.
    if (typeof result.corners === 'number' && result.corners <= 1) {
      result.grade = 1
      result.corners = 1
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[grade] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Grading failed' },
      { status: 500 },
    )
  }
}

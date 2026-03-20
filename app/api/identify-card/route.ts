import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured')
  return new Anthropic({ apiKey })
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { cardId, imageUrl } = await req.json()
    if (!cardId || !imageUrl) {
      return NextResponse.json({ error: 'cardId and imageUrl required' }, { status: 400 })
    }

    // Fetch the image from storage
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) throw new Error('Failed to fetch card image')
    const imgBuffer = await imgRes.arrayBuffer()
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
    type ValidMime = (typeof validTypes)[number]
    const mimeType: ValidMime = validTypes.includes(contentType as ValidMime)
      ? (contentType as ValidMime)
      : 'image/jpeg'
    const base64 = Buffer.from(imgBuffer).toString('base64')

    // Ask Claude to identify the card
    const client = getClient()
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: base64 },
            },
            {
              type: 'text',
              text: `Identify this Pokémon card. Read the card name, set number, and set name printed on the card.
Return ONLY a valid JSON object with no extra text:
{
  "card_name": "<Pokémon name> (<set number>) - <set name>"
}
Example: "Charizard (4/102) - Base Set" or "Gold Star Metagross (113/113) - EX Delta Species".
If you cannot read the card clearly, use your best guess based on what is visible.`,
            },
          ],
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in AI response')
    const { card_name } = JSON.parse(jsonMatch[0])
    if (!card_name || typeof card_name !== 'string') throw new Error('No card_name in response')

    // Update the card in DB (only if user owns it)
    const adminClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } },
    )
    const { error: updateErr } = await adminClient
      .from('cards')
      .update({ card_name })
      .eq('id', cardId)
      .eq('user_id', user.id)
    if (updateErr) throw new Error(`DB update failed: ${updateErr.message}`)

    return NextResponse.json({ card_name })
  } catch (error) {
    console.error('[identify-card] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Identification failed' },
      { status: 500 },
    )
  }
}

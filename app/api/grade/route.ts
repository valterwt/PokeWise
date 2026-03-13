import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function fileToBase64(buffer: Buffer, mimeType: string): string {
  return buffer.toString('base64')
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const frontFile = formData.get('front') as File | null
    const backFile = formData.get('back') as File | null
    const cardName = formData.get('cardName') as string | null

    if (!frontFile) {
      return NextResponse.json({ error: 'Front image is required' }, { status: 400 })
    }

    const frontBuffer = Buffer.from(await frontFile.arrayBuffer())
    const frontBase64 = fileToBase64(frontBuffer, frontFile.type)

    const imageContents: Anthropic.ImageBlockParam[] = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: frontFile.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: frontBase64,
        },
      },
    ]

    if (backFile) {
      const backBuffer = Buffer.from(await backFile.arrayBuffer())
      const backBase64 = fileToBase64(backBuffer, backFile.type)
      imageContents.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: backFile.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: backBase64,
        },
      })
    }

    const cardNameNote = cardName ? `The card is identified as: ${cardName}.` : ''

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            {
              type: 'text',
              text: `You are a professional Pokémon card grader. ${cardNameNote}
Analyze the provided card image(s) and grade it on a 1-10 scale using PSA-style criteria.

Grade criteria:
- 10 (Gem Mint): Perfect in every way
- 9 (Mint): Only the slightest imperfection allowed
- 8 (Near Mint–Mint): Very light wear, excellent centering
- 7 (Near Mint): Minor handling wear, centering off slightly
- 6 (Excellent–Near Mint): Light surface wear, slight border scratches
- 5 (Excellent): Multiple light scratches, minor chipping
- 4 (Very Good–Excellent): Noticeable wear, some whitening
- 3 (Very Good): Heavy wear on edges, surface scratches
- 2 (Good): Major creases, stains, rounded corners
- 1 (Poor): Heavily damaged, torn, missing pieces

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

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response from AI')
    }

    const result = JSON.parse(jsonMatch[0])

    // Validate required fields
    if (typeof result.grade !== 'number' || result.grade < 1 || result.grade > 10) {
      throw new Error('Invalid grade value from AI')
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Grading error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Grading failed' },
      { status: 500 }
    )
  }
}

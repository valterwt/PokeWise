import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // If Supabase is configured, store subscriber
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
      )

      const { error } = await supabase
        .from('subscribers')
        .insert({ email })

      if (error && !error.message.includes('duplicate')) {
        throw error
      }
    }

    // If Resend is configured, send welcome email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'PokeWise <newsletter@pokewise.app>',
        to: email,
        subject: 'Welcome to the PokeWise Restoration Newsletter ⚡',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 40px; border-radius: 12px;">
            <h1 style="color: #ffd700;">Welcome to PokeWise ⚡</h1>
            <p>You're now subscribed to the <strong>Restoration Newsletter</strong> — our weekly journal documenting real Pokémon card restoration experiments.</p>
            <p>Every week you'll get honest reports on what works, what doesn't, and the techniques we're discovering to bring damaged cards back to life.</p>
            <p style="color: #999;">The PokeWise Team</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    )
  }
}

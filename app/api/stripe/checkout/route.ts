import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
  return new Stripe(key, { apiVersion: '2026-02-25.clover' })
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// plan: 'pack' = 25 grades one-time $4.99 | 'pro' = unlimited $9.99/mo
export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json() as { plan: 'pack' | 'pro'; userId?: string }

    if (!['pack', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const stripe = getStripe()

    const priceId = plan === 'pro'
      ? process.env.STRIPE_PRICE_PRO_MONTHLY
      : process.env.STRIPE_PRICE_CREDIT_PACK

    if (!priceId) {
      return NextResponse.json(
        { error: `STRIPE_PRICE_${plan === 'pro' ? 'PRO_MONTHLY' : 'CREDIT_PACK'} is not configured` },
        { status: 500 },
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'pro' ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/pricing?success=1&plan=${plan}`,
      cancel_url:  `${APP_URL}/pricing?canceled=1`,
      // Pass user ID so the webhook can credit the right account
      client_reference_id: userId ?? undefined,
      metadata: { plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[stripe/checkout] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 },
    )
  }
}

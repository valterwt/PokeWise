import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'


function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
  return new Stripe(key, { apiVersion: '2026-02-25.clover' })
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars not configured')
  return createClient(url, key)
}

const PACK_CREDITS = 25

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      const plan = session.metadata?.plan as 'pack' | 'pro' | undefined

      if (!userId) {
        // No user ID — nothing to credit (anonymous checkout)
        return NextResponse.json({ received: true })
      }

      if (plan === 'pack') {
        // Add 25 credits to the user
        const { error } = await supabase.rpc('add_grade_credits', {
          p_user_id: userId,
          p_credits: PACK_CREDITS,
        })
        if (error) console.error('[webhook] add_grade_credits failed:', error)
      } else if (plan === 'pro') {
        // Mark user as pro subscriber
        const { error } = await supabase
          .from('user_credits')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
          }, { onConflict: 'user_id' })
        if (error) console.error('[webhook] upsert subscription failed:', error)
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      // Downgrade user when subscription is cancelled
      const { error } = await supabase
        .from('user_credits')
        .update({ subscription_status: 'cancelled', stripe_subscription_id: null })
        .eq('stripe_subscription_id', sub.id)
      if (error) console.error('[webhook] subscription cancel update failed:', error)
    }
  } catch (err) {
    console.error('[webhook] handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

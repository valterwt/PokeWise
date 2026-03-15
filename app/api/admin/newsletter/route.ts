import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key)
}

function verifyPassword(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  const auth = req.headers.get('Authorization')?.replace('Bearer ', '')
  return auth === adminPassword
}

export async function GET(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('newsletter')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { title, body: postBody, before_image_url, after_image_url } = body

  if (!title?.trim() || !postBody?.trim()) {
    return NextResponse.json({ error: 'Title and body are required' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('newsletter')
    .insert({
      title: title.trim(),
      body: postBody.trim(),
      before_image_url: before_image_url?.trim() || null,
      after_image_url: after_image_url?.trim() || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = getAdminClient()
  const { error } = await supabase.from('newsletter').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deleted: true })
}

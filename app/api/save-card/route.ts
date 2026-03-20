import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()

    // Authenticate user
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in to save cards to your binder.' }, { status: 401 })
    }

    const adminClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } },
    )

    const formData = await req.formData()
    const frontFile = formData.get('front') as File | null
    const backFile  = formData.get('back')  as File | null
    const cardName  = (formData.get('cardName') as string) || 'Unknown Card'
    const grade         = parseFloat(formData.get('grade') as string)
    const centering     = parseFloat(formData.get('centering') as string)
    const corners       = parseFloat(formData.get('corners') as string)
    const edges         = parseFloat(formData.get('edges') as string)
    const surface       = parseFloat(formData.get('surface') as string)
    const summary       = formData.get('summary') as string
    const recommendation = formData.get('recommendation') as string

    if (!frontFile) {
      return NextResponse.json({ error: 'Front image is required' }, { status: 400 })
    }

    // 1. Ensure public.users profile exists (required by cards FK)
    const username = (user.email?.split('@')[0] ?? `user_${user.id.slice(0, 8)}`)
      .replace(/[^a-zA-Z0-9_]/g, '_')
    await adminClient.from('users').upsert(
      { id: user.id, username, email: user.email! },
      { onConflict: 'id', ignoreDuplicates: true },
    )

    // 2. Ensure the 'cards' storage bucket exists (creates it if missing)
    const { error: bucketErr } = await adminClient.storage.createBucket('cards', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    })
    // Ignore "already exists" error (code 23505 or message contains 'already exists')
    if (bucketErr && !bucketErr.message.toLowerCase().includes('already exist')) {
      console.warn('[save-card] bucket create warning:', bucketErr.message)
    }

    // 3. Generate card ID up-front so we can use it as the storage path
    const cardId = crypto.randomUUID()

    // 4. Upload images to storage
    const ext = (f: File) => f.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'

    const uploadFile = async (file: File, path: string): Promise<string> => {
      const bytes = await file.arrayBuffer()
      const { error } = await adminClient.storage
        .from('cards')
        .upload(path, Buffer.from(bytes), { contentType: file.type, upsert: true })
      if (error) throw new Error(`Storage upload failed: ${error.message}`)
      const { data: { publicUrl } } = adminClient.storage.from('cards').getPublicUrl(path)
      return publicUrl
    }

    const frontUrl = await uploadFile(frontFile, `${user.id}/${cardId}/front.${ext(frontFile)}`)
    const backUrl  = backFile
      ? await uploadFile(backFile, `${user.id}/${cardId}/back.${ext(backFile)}`)
      : null

    // 5. Insert card record
    const { error: cardError } = await adminClient.from('cards').insert({
      id: cardId,
      user_id: user.id,
      card_name: cardName,
      front_image_url: frontUrl,
      back_image_url: backUrl,
    })
    if (cardError) throw new Error(`Card insert failed: ${cardError.message}`)

    // 6. Insert grade record
    const { error: gradeError } = await adminClient.from('grades').insert({
      card_id: cardId,
      overall: grade,
      centering,
      corners,
      edges,
      surface,
      summary,
      recommendation,
    })
    if (gradeError) throw new Error(`Grade insert failed: ${gradeError.message}`)

    return NextResponse.json({ cardId })
  } catch (error) {
    console.error('[save-card] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save card' },
      { status: 500 },
    )
  }
}

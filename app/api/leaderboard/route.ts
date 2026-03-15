import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const supabase = createClient(url, key)

  // Fetch grades joined with card info and username
  const { data, error } = await supabase
    .from('grades')
    .select('overall, created_at, cards(card_name, users(username))')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  type Row = {
    overall: number
    created_at: string
    cards: { card_name: string; users: { username: string } | null } | null
  }

  const rows = (data ?? []) as unknown as Row[]

  // Stats
  const totalGrades = rows.length
  const communityAvg = totalGrades > 0
    ? (rows.reduce((s, r) => s + r.overall, 0) / totalGrades).toFixed(1)
    : '0.0'
  const uniqueCards = new Set(rows.map((r) => r.cards?.card_name).filter(Boolean)).size

  // Most graded — group by card name
  const grouped: Record<string, { count: number; sum: number }> = {}
  for (const row of rows) {
    const name = row.cards?.card_name
    if (!name) continue
    if (!grouped[name]) grouped[name] = { count: 0, sum: 0 }
    grouped[name].count++
    grouped[name].sum += row.overall
  }
  const mostGraded = Object.entries(grouped)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([card, { count, sum }], i) => ({
      rank: i + 1,
      card,
      count,
      avgGrade: parseFloat((sum / count).toFixed(1)),
    }))

  // Recent grades — top 20 most recent
  const recentGrades = rows.slice(0, 20).map((row, i) => ({
    id: String(i),
    card: row.cards?.card_name ?? 'Unknown Card',
    grade: row.overall,
    username: row.cards?.users?.username ?? 'anonymous',
    time: row.created_at,
  }))

  return NextResponse.json({ totalGrades, communityAvg, uniqueCards, mostGraded, recentGrades })
}

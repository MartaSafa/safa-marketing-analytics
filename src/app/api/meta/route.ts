import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const desde = req.nextUrl.searchParams.get('desde') || '2025-01-01'
  const hasta = req.nextUrl.searchParams.get('hasta') || new Date().toISOString().split('T')[0]
  const marca = req.nextUrl.searchParams.get('marca') || 'todas'

  const supabase = createServiceClient()
  let query = supabase
    .from('meta_campaigns')
    .select('*')
    .gte('date', desde)
    .lte('date', hasta)

  if (marca !== 'todas') query = query.eq('brand', marca)

  const { data } = await query.order('spend', { ascending: false })

  const map = new Map()
  data?.forEach(c => {
    if (!map.has(c.campaign_id)) {
      map.set(c.campaign_id, { ...c })
    } else {
      const ex = map.get(c.campaign_id)
      ex.spend += c.spend
      ex.impressions += c.impressions
      ex.clicks += c.clicks
      ex.leads += c.leads
    }
  })

  return NextResponse.json({ campanas: Array.from(map.values()) })
}

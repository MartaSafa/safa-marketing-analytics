import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

async function syncMetaDay(supabase: any, date: string, accountId: string, brand: string) {
  const token = process.env.META_ACCESS_TOKEN
  const url = `https://graph.facebook.com/v19.0/${accountId}/insights?` + new URLSearchParams({
    fields: 'campaign_id,campaign_name,spend,impressions,clicks,actions',
    time_range: JSON.stringify({ since: date, until: date }),
    level: 'campaign',
    access_token: token!,
  })
  const res = await fetch(url)
  const data = await res.json()
  if (!data.data) return 0

  const rows = data.data.map((c: any) => ({
    date,
    campaign_id: c.campaign_id,
    campaign_name: c.campaign_name,
    status: 'ACTIVE',
    brand,
    spend: parseFloat(c.spend || '0'),
    impressions: parseInt(c.impressions || '0'),
    clicks: parseInt(c.clicks || '0'),
    leads: (c.actions || []).find((a: any) => a.action_type === 'lead')
      ? parseInt((c.actions || []).find((a: any) => a.action_type === 'lead').value)
      : 0,
  }))

  await supabase.from('meta_campaigns').upsert(rows, { onConflict: 'date,campaign_id' })
  return rows.length
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const desde = req.nextUrl.searchParams.get('desde') || '2025-01-01'
  const hasta = req.nextUrl.searchParams.get('hasta') || new Date().toISOString().split('T')[0]

  const accounts = [
    { id: process.env.META_AD_ACCOUNT_ID_AUDI!, brand: 'audi' },
    { id: process.env.META_AD_ACCOUNT_ID_VW!, brand: 'vw' },
    { id: process.env.META_AD_ACCOUNT_ID_SKODA!, brand: 'skoda' },
  ]

  const supabase = createServiceClient()
  let totalRecords = 0

  // Genera todos los días entre desde y hasta
  const fechas: string[] = []
  const current = new Date(desde)
  const end = new Date(hasta)
  while (current <= end) {
    fechas.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  for (const fecha of fechas) {
    for (const account of accounts) {
      try {
        const records = await syncMetaDay(supabase, fecha, account.id, account.brand)
        totalRecords += records
      } catch (e) {
        console.error(`Error ${account.brand} ${fecha}:`, e)
      }
      // Pequeña pausa para no saturar la API de Meta
      await new Promise(r => setTimeout(r, 200))
    }
  }

  return NextResponse.json({ desde, hasta, totalRecords })
}

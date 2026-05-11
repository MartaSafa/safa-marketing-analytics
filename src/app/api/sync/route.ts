import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

async function syncMetaAccount(supabase: any, date: string, accountId: string, brand: string) {
  const token = process.env.META_ACCESS_TOKEN

  const url = `https://graph.facebook.com/v19.0/${accountId}/insights?` + new URLSearchParams({
    fields: 'campaign_id,campaign_name,spend,impressions,clicks,actions',
    time_range: JSON.stringify({ since: date, until: date }),
    level: 'campaign',
    access_token: token!,
  })

  const res = await fetch(url)
  const data = await res.json()

  if (!data.data) throw new Error(`Meta error para ${brand}: ${JSON.stringify(data)}`)

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

  const { error } = await supabase.from('meta_campaigns').upsert(rows, {
    onConflict: 'date,campaign_id',
  })

  if (error) throw error
  return rows.length
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') ||
    req.headers.get('authorization')?.replace('Bearer ', '')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const date = yesterday.toISOString().split('T')[0]

  const supabase = createServiceClient()
  const results: Record<string, any> = {}

  const accounts = [
    { id: process.env.META_AD_ACCOUNT_ID_AUDI!, brand: 'audi' },
    { id: process.env.META_AD_ACCOUNT_ID_VW!, brand: 'vw' },
    { id: process.env.META_AD_ACCOUNT_ID_SKODA!, brand: 'skoda' },
  ]

  for (const account of accounts) {
    try {
      const records = await syncMetaAccount(supabase, date, account.id, account.brand)
      results[account.brand] = { status: 'ok', records }
      await supabase.from('sync_log').insert({ source: `meta_${account.brand}`, status: 'ok', records })
    } catch (err: any) {
      results[account.brand] = { status: 'error', message: err.message }
      await supabase.from('sync_log').insert({ source: `meta_${account.brand}`, status: 'error', error_msg: err.message })
    }
  }

  return NextResponse.json({ date, ...results })
}

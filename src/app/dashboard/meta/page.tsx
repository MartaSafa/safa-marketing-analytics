import { createClient } from '@/lib/supabase/server'

export default async function MetaPage() {
  const supabase = createClient()

  const { data: campanas } = await supabase
    .from('meta_campaigns')
    .select('*')
    .order('date', { ascending: false })

  // Agrupa por campaña cogiendo el dato más reciente
  const map = new Map()
  campanas?.forEach(c => {
    if (!map.has(c.campaign_id)) map.set(c.campaign_id, c)
    else {
      const existing = map.get(c.campaign_id)
      existing.spend += c.spend
      existing.impressions += c.impressions
      existing.clicks += c.clicks
      existing.leads += c.leads
    }
  })
  const lista = Array.from(map.values())

  const totalSpend = lista.reduce((s, c) => s + c.spend, 0)
  const totalImpressions = lista.reduce((s, c) => s + c.impressions, 0)
  const totalLeads = lista.reduce((s, c) => s + c.leads, 0)
  const cpl = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(1) : '—'
  const ctr = totalImpressions > 0 ? ((lista.reduce((s,c)=>s+c.clicks,0) / totalImpressions) * 100).toFixed(2) : '—'

  const kpis = [
    { label: 'Inversión Meta', value: totalSpend.toLocaleString('es', {maximumFractionDigits:0})+'€', sub: 'Total acumulado', color: '#1877F2' },
    { label: 'Impresiones', value: totalImpressions >= 1000000 ? (totalImpressions/1000000).toFixed(1)+'M' : totalImpressions.toLocaleString('es'), sub: 'Total', color: '#6B7280' },
    { label: 'Leads Meta', value: totalLeads.toLocaleString('es'), sub: 'Total acumulado', color: '#2B6BE8' },
    { label: 'CPL Meta', value: cpl+'€', sub: 'Coste por lead', color: '#EF4444' },
    { label: 'CTR medio', value: ctr+'%', sub: 'Clics / impresiones', color: '#6B7280' },
  ]

  const card = { background: '#fff', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 10, padding: '12px 14px' }
  const th = { textAlign: 'left' as const, fontSize: 9, fontWeight: 500, color: '#5C6A82', padding: '6px 10px', borderBottom: '0.5px solid rgba(15,24,39,.08)', textTransform: 'uppercase' as const, letterSpacing: '.06em', background: '#EEF2FB', whiteSpace: 'nowrap' as const }
  const td = { padding: '8px 10px', borderBottom: '0.5px solid rgba(15,24,39,.08)', fontSize: 11, color: '#0F1827' }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7, marginBottom: 12 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, borderTop: `2px solid ${k.color}` }}>
            <div style={{ fontSize: 9, color: '#5C6A82', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{k.label}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#0F1827' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '0.5px solid rgba(15,24,39,.08)' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#0F1827' }}>Campañas Meta</span>
          <span style={{ fontSize: 10, background: '#EBF0FD', color: '#2B6BE8', padding: '3px 9px', borderRadius: 99 }}>{lista.length} campañas</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Marca</th>
                <th style={th}>Campaña</th>
                <th style={th}>Inversión</th>
                <th style={th}>Impresiones</th>
                <th style={th}>Clics</th>
                <th style={th}>Leads</th>
                <th style={th}>CPL</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c, i) => (
                <tr key={c.campaign_id} style={{ background: i % 2 === 0 ? '#fff' : 'rgba(238,242,251,.4)' }}>
                  <td style={td}>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 99,
                      background: c.brand === 'audi' ? '#FEF2F2' : c.brand === 'vw' ? '#EFF6FF' : '#F0FDF4',
                      color: c.brand === 'audi' ? '#B91C1C' : c.brand === 'vw' ? '#1D4ED8' : '#15803D' }}>
                      {c.brand?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.campaign_name}</td>
                  <td style={td}>{c.spend.toLocaleString('es', {maximumFractionDigits:0})}€</td>
                  <td style={td}>{c.impressions.toLocaleString('es')}</td>
                  <td style={td}>{c.clicks.toLocaleString('es')}</td>
                  <td style={{ ...td, fontWeight: 500, color: '#2B6BE8' }}>{c.leads}</td>
                  <td style={td}>{c.leads > 0 ? (c.spend/c.leads).toFixed(1)+'€' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

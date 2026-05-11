'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MetaPage() {
  const supabase = createClient()
  const [lista, setLista] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [desde, setDesde] = useState('2025-01-01')
  const [hasta, setHasta] = useState(new Date().toISOString().split('T')[0])
  const [marca, setMarca] = useState('todas')

  useEffect(() => { fetchData() }, [desde, hasta, marca])

  async function fetchData() {
    setLoading(true)
    let query = supabase
      .from('meta_campaigns')
      .select('*')
      .gte('date', desde)
      .lte('date', hasta)

    if (marca !== 'todas') query = query.eq('brand', marca)

    const { data } = await query.order('date', { ascending: false })

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
    setLista(Array.from(map.values()))
    setLoading(false)
  }

  const totalSpend = lista.reduce((s, c) => s + c.spend, 0)
  const totalImpressions = lista.reduce((s, c) => s + c.impressions, 0)
  const totalClicks = lista.reduce((s, c) => s + c.clicks, 0)
  const totalLeads = lista.reduce((s, c) => s + c.leads, 0)
  const cpl = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(1) : '—'
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '—'

  const kpis = [
    { label: 'Inversión Meta', value: totalSpend.toLocaleString('es', { maximumFractionDigits: 0 }) + '€', color: '#1877F2' },
    { label: 'Impresiones', value: totalImpressions >= 1000000 ? (totalImpressions / 1000000).toFixed(1) + 'M' : totalImpressions.toLocaleString('es'), color: '#6B7280' },
    { label: 'Leads Meta', value: totalLeads.toLocaleString('es'), color: '#2B6BE8' },
    { label: 'CPL Meta', value: cpl + '€', color: '#EF4444' },
    { label: 'CTR medio', value: ctr + '%', color: '#6B7280' },
  ]

  const card = { background: '#fff', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 10, padding: '12px 14px' }
  const th = { textAlign: 'left' as const, fontSize: 9, fontWeight: 500, color: '#5C6A82', padding: '6px 10px', borderBottom: '0.5px solid rgba(15,24,39,.08)', textTransform: 'uppercase' as const, letterSpacing: '.06em', background: '#EEF2FB', whiteSpace: 'nowrap' as const }
  const td = { padding: '8px 10px', borderBottom: '0.5px solid rgba(15,24,39,.08)', fontSize: 11, color: '#0F1827' }
  const inp = { border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 20, padding: '4px 9px', fontSize: 11, outline: 'none', color: '#0F1827', background: '#fff', cursor: 'pointer' }

  return (
    <div>
      {/* FILTROS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, background: '#fff', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 10, padding: '8px 14px' }}>
        <span style={{ fontSize: 11, color: '#5C6A82' }}>Desde</span>
        <input type="date" value={desde} onChange={e => setDesde(e.target.value)} style={inp} />
        <span style={{ fontSize: 11, color: '#5C6A82' }}>Hasta</span>
        <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={inp} />
        <div style={{ width: 1, height: 16, background: 'rgba(15,24,39,.08)' }} />
        <span style={{ fontSize: 11, color: '#5C6A82' }}>Marca</span>
        <select value={marca} onChange={e => setMarca(e.target.value)} style={inp}>
          <option value="todas">Todas</option>
          <option value="audi">Audi</option>
          <option value="vw">Volkswagen</option>
          <option value="skoda">Škoda</option>
        </select>
        {loading && <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 4 }}>Cargando...</span>}
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7, marginBottom: 12 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, borderTop: `2px solid ${k.color}` }}>
            <div style={{ fontSize: 9, color: '#5C6A82', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{k.label}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#0F1827' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* TABLA */}
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
              {lista.length === 0 && !loading && (
                <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#9CA3AF', padding: 24 }}>No hay datos para el periodo seleccionado</td></tr>
              )}
              {lista.map((c, i) => (
                <tr key={c.campaign_id} style={{ background: i % 2 === 0 ? '#fff' : 'rgba(238,242,251,.4)' }}>
                  <td style={td}>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 99, background: c.brand === 'audi' ? '#FEF2F2' : c.brand === 'vw' ? '#EFF6FF' : '#F0FDF4', color: c.brand === 'audi' ? '#B91C1C' : c.brand === 'vw' ? '#1D4ED8' : '#15803D' }}>
                      {c.brand?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.campaign_name}</td>
                  <td style={td}>{c.spend.toLocaleString('es', { maximumFractionDigits: 0 })}€</td>
                  <td style={td}>{c.impressions.toLocaleString('es')}</td>
                  <td style={td}>{c.clicks.toLocaleString('es')}</td>
                  <td style={{ ...td, fontWeight: 500, color: '#2B6BE8' }}>{c.leads}</td>
                  <td style={td}>{c.leads > 0 ? (c.spend / c.leads).toFixed(1) + '€' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

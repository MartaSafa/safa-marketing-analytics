export default function GeneralPage() {
  const kpis = [
    { label: 'Leads', value: '1.847', sub: '+8% vs ant.', color: '#2B6BE8' },
    { label: 'Oportunidades', value: '412', sub: '+11%', color: '#0EA874' },
    { label: 'Ofertas', value: '182', sub: '44% s/oport.', color: '#6B7280' },
    { label: 'Pedidos', value: '59', sub: '32% cierre', color: '#0EA874' },
    { label: 'Inversión total', value: '84.200€', sub: '+12%', color: '#F59E0B' },
    { label: 'Coste / lead', value: '45,6€', sub: 'Obj. 50€', color: '#EF4444' },
    { label: 'Coste / oport.', value: '204€', sub: '-3%', color: '#6B7280' },
  ]

  const canales = ['SEM/Google', 'Meta Ads', 'Display', 'SEO', 'Email']
  const inversion = [38400, 22100, 14700, 6000, 3000]
  const leads = [890, 720, 134, 73, 30]
  const maxInv = Math.max(...inversion)
  const maxLeads = Math.max(...leads)
  const colores = ['#2B6BE8', '#1877F2', '#F59E0B', '#0EA874', '#94A3B8']

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const leadsMes = [312, 287, 341, 398, 0, 0, 0, 0, 0, 0, 0, 0]
  const maxMes = Math.max(...leadsMes)

  const funnel = [
    { label: 'Sesiones web', value: 57700 },
    { label: 'Solicitudes', value: 3840 },
    { label: 'Leads', value: 1847 },
    { label: 'Test drive', value: 412 },
    { label: 'Pedidos', value: 59 },
  ]
  const maxFunnel = funnel[0].value

  const card = { background: '#fff', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 10, padding: '12px 14px' }

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 7, marginBottom: 12 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, borderTop: `2px solid ${k.color}` }}>
            <div style={{ fontSize: 9, color: '#5C6A82', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{k.label}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#0F1827' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* GRÁFICAS fila 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        {/* Inversión por canal */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#0F1827', marginBottom: 12 }}>Inversión por canal</div>
          {canales.map((c, i) => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 80, fontSize: 10, color: '#5C6A82', textAlign: 'right', flexShrink: 0 }}>{c}</div>
              <div style={{ flex: 1, height: 14, background: '#F1F4FB', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(inversion[i] / maxInv) * 100}%`, height: '100%', background: colores[i], borderRadius: 4 }}/>
              </div>
              <div style={{ width: 50, fontSize: 10, color: '#5C6A82' }}>{(inversion[i] / 1000).toFixed(0)}K€</div>
            </div>
          ))}
        </div>

        {/* Leads por canal */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#0F1827', marginBottom: 12 }}>Leads por canal</div>
          {canales.map((c, i) => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 80, fontSize: 10, color: '#5C6A82', textAlign: 'right', flexShrink: 0 }}>{c}</div>
              <div style={{ flex: 1, height: 14, background: '#F1F4FB', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(leads[i] / maxLeads) * 100}%`, height: '100%', background: colores[i], borderRadius: 4 }}/>
              </div>
              <div style={{ width: 50, fontSize: 10, color: '#5C6A82' }}>{leads[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GRÁFICAS fila 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Leads por mes */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#0F1827', marginBottom: 12 }}>Leads por mes</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100 }}>
            {meses.map((m, i) => (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: '100%', height: maxMes > 0 ? `${(leadsMes[i] / maxMes) * 90}px` : 2, background: leadsMes[i] > 0 ? '#2B6BE8' : '#E5E7EB', borderRadius: '3px 3px 0 0', minHeight: 2 }}/>
                <div style={{ fontSize: 8, color: '#9CA3AF' }}>{m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#0F1827', marginBottom: 12 }}>Funnel de conversión</div>
          {funnel.map((f, i) => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 80, fontSize: 10, color: '#5C6A82', textAlign: 'right', flexShrink: 0 }}>{f.label}</div>
              <div style={{ flex: 1, height: 18, background: '#F1F4FB', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(f.value / maxFunnel) * 100}%`, height: '100%', background: `rgba(43,107,232,${1 - i * 0.15})`, borderRadius: 4 }}/>
              </div>
              <div style={{ width: 50, fontSize: 10, color: '#5C6A82' }}>{f.value.toLocaleString('es')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

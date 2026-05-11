export default function GooglePage() {
  const kpis = [
    { label: 'Inversión Google', value: '38.400€', sub: '46% del total', color: '#EA4335' },
    { label: 'Impresiones', value: '1,4M', sub: '+9%', color: '#6B7280' },
    { label: 'Leads Google', value: '890', sub: '+6%', color: '#2B6BE8' },
    { label: 'CPL Google', value: '43,1€', sub: '-4% vs ant.', color: '#0EA874' },
    { label: 'Quality Score', value: '7,8', sub: '+0,3', color: '#6B7280' },
  ]

  const campanas = [
    { on: true, name: '[Audi] A3 | Search Brand', tipo: 'Search', inv: '5.120€', imp: '48.200', clics: '3.840', ctr: '7,97%', conv: '82', cpc: '1,33€' },
    { on: true, name: '[VW] Golf Precio | Search', tipo: 'Search', inv: '6.400€', imp: '62.100', clics: '4.920', ctr: '7,92%', conv: '101', cpc: '1,30€' },
    { on: true, name: '[Skoda] Octavia | Search', tipo: 'Search', inv: '3.800€', imp: '38.400', clics: '2.760', ctr: '7,19%', conv: '54', cpc: '1,38€' },
    { on: true, name: '[Audi] Display Remarketing', tipo: 'Display', inv: '4.200€', imp: '410K', clics: '1.640', ctr: '0,40%', conv: '28', cpc: '2,56€' },
    { on: false, name: '[VW] Performance Max', tipo: 'PMax', inv: '—', imp: '—', clics: '—', ctr: '—', conv: '—', cpc: '—' },
    { on: true, name: '[Skoda] Lead Form Ads', tipo: 'Search', inv: '4.600€', imp: '52.000', clics: '3.640', ctr: '7,00%', conv: '68', cpc: '1,26€' },
    { on: true, name: '[Multi] YouTube In-stream', tipo: 'Vídeo', inv: '4.280€', imp: '380K', clics: '1.820', ctr: '0,48%', conv: '14', cpc: '2,35€' },
  ]

  const card = { background: '#fff', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 10, padding: '12px 14px' }
  const th = { textAlign: 'left' as const, fontSize: 9, fontWeight: 500, color: '#5C6A82', padding: '6px 10px', borderBottom: '0.5px solid rgba(15,24,39,.08)', textTransform: 'uppercase' as const, letterSpacing: '.06em', background: '#EEF2FB', whiteSpace: 'nowrap' as const }
  const td = { padding: '8px 10px', borderBottom: '0.5px solid rgba(15,24,39,.08)', fontSize: 11, color: '#0F1827' }

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7, marginBottom: 12 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, borderTop: `2px solid ${k.color}` }}>
            <div style={{ fontSize: 9, color: '#5C6A82', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{k.label}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#0F1827' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* TABLA */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '0.5px solid rgba(15,24,39,.08)' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#0F1827' }}>Campañas Google</span>
          <span style={{ fontSize: 10, background: '#EBF0FD', color: '#2B6BE8', padding: '3px 9px', borderRadius: 99 }}>6 activas</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Estado</th>
                <th style={th}>Campaña</th>
                <th style={th}>Tipo</th>
                <th style={th}>Inversión</th>
                <th style={th}>Impresiones</th>
                <th style={th}>Clics</th>
                <th style={th}>CTR</th>
                <th style={th}>Conv.</th>
                <th style={th}>CPC</th>
              </tr>
            </thead>
            <tbody>
              {campanas.map((c, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : 'rgba(238,242,251,.4)' }}>
                  <td style={td}>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 99, background: c.on ? '#ECFDF5' : '#F1F5F9', color: c.on ? '#059669' : '#9CA3AF' }}>
                      {c.on ? '● Activa' : '○ Pausada'}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</td>
                  <td style={td}><span style={{ fontSize: 9, background: '#FEF2F2', color: '#B91C1C', padding: '2px 7px', borderRadius: 99 }}>{c.tipo}</span></td>
                  <td style={td}>{c.inv}</td>
                  <td style={td}>{c.imp}</td>
                  <td style={td}>{c.clics}</td>
                  <td style={td}>{c.ctr}</td>
                  <td style={{ ...td, fontWeight: 500, color: '#2B6BE8' }}>{c.conv}</td>
                  <td style={td}>{c.cpc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

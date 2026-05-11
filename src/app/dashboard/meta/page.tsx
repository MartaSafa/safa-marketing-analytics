export default function MetaPage() {
  const kpis = [
    { label: 'Inversión Meta', value: '34.100€', sub: '40% del total', color: '#1877F2' },
    { label: 'Impresiones', value: '2,8M', sub: '+14%', color: '#6B7280' },
    { label: 'Leads Meta', value: '720', sub: '39% del total', color: '#2B6BE8' },
    { label: 'CPL Meta', value: '47,4€', sub: '+2% vs ant.', color: '#EF4444' },
    { label: 'CTR medio', value: '1,82%', sub: '+0,2pp', color: '#6B7280' },
  ]

  const campanas = [
    { on: true, name: 'Audi A4 | Lead Gen Form', obj: 'Clientes potenciales', inv: '8.240€', imp: '428K', clics: '7.820', ctr: '1,83%', leads: '186', cpl: '44,3€' },
    { on: true, name: 'VW Golf 2025 | Retargeting', obj: 'Conversiones', inv: '6.100€', imp: '310K', clics: '5.620', ctr: '1,81%', leads: '142', cpl: '42,9€' },
    { on: true, name: 'Škoda Octavia | Awareness', obj: 'Alcance', inv: '4.800€', imp: '680K', clics: '4.100', ctr: '0,60%', leads: '68', cpl: '70,6€' },
    { on: true, name: 'Audi Q5 | Lead Gen', obj: 'Clientes potenciales', inv: '5.960€', imp: '248K', clics: '6.100', ctr: '2,46%', leads: '201', cpl: '29,7€' },
    { on: false, name: 'VW Touareg | Vídeo reach', obj: 'Alcance de vídeo', inv: '—', imp: '—', clics: '—', ctr: '—', leads: '—', cpl: '—' },
    { on: true, name: 'Škoda Kodiaq | Ofertas', obj: 'Tráfico', inv: '3.200€', imp: '140K', clics: '2.980', ctr: '2,13%', leads: '58', cpl: '55,2€' },
    { on: true, name: 'Multimarca | Verano 2025', obj: 'Clientes potenciales', inv: '5.800€', imp: '390K', clics: '5.010', ctr: '1,28%', leads: '65', cpl: '89,2€' },
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
          <span style={{ fontSize: 12, fontWeight: 500, color: '#0F1827' }}>Campañas Meta</span>
          <span style={{ fontSize: 10, background: '#EBF0FD', color: '#2B6BE8', padding: '3px 9px', borderRadius: 99 }}>7 campañas</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Estado</th>
                <th style={th}>Campaña</th>
                <th style={th}>Objetivo</th>
                <th style={th}>Inversión</th>
                <th style={th}>Impresiones</th>
                <th style={th}>Clics</th>
                <th style={th}>CTR</th>
                <th style={th}>Leads</th>
                <th style={th}>CPL</th>
              </tr>
            </the

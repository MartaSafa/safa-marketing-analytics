'use client'
import { useState } from 'react'

export default function CostesPage() {
  const [totalBudget, setTotalBudget] = useState(200000)
  const [mBudgets, setMBudgets] = useState([16700,17800,18600,18400,16700,17700,18000,15000,17000,17000,12400,10700])

  const spent = [18200,21400,22100,22500,0,0,0,0,0,0,0,0]
  const totalSpent = 84200
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

  const kpis = [
    { label: 'Presupuesto anual', value: totalBudget.toLocaleString('es')+'€', sub: 'Configurado', color: '#2B6BE8' },
    { label: 'Invertido YTD', value: '84.200€', sub: '42% ejecutado', color: '#F59E0B' },
    { label: 'Restante anual', value: Math.max(0,totalBudget-totalSpent).toLocaleString('es')+'€', sub: 'Disponible', color: '#0EA874' },
    { label: 'Desviación vs plan', value: '-3.200€', sub: 'Por debajo', color: '#6B7280' },
  ]

  const canales = ['SEM/Google','Meta Ads','Display','SEO','Email']
  const cpls = [43.1, 47.4, 109.7, 82.2, 100]
  const colores = ['#2B6BE8','#1877F2','#F59E0B','#0EA874','#94A3B8']
  const maxCpl = Math.max(...cpls)

  const card = { background: '#fff', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 10, padding: '12px 14px' }

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7, marginBottom: 12 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, borderTop: `2px solid ${k.color}` }}>
            <div style={{ fontSize: 9, color: '#5C6A82', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{k.label}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#0F1827' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* CONFIGURADOR */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#0F1827', marginBottom: 10 }}>Presupuesto total anual</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <input type="number" value={totalBudget}
              onChange={e => setTotalBudget(parseInt(e.target.value)||0)}
              style={{ border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 8, padding: '7px 10px', fontSize: 14, width: 130, outline: 'none', color: '#0F1827' }}/>
            <span style={{ fontSize: 11, color: '#5C6A82' }}>€ / año</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#0F1827', marginBottom: 4 }}>Desglose mensual</div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 10 }}>Edita el presupuesto de cada mes.</div>
          {meses.map((m, i) => {
            const sp = spent[i] || 0
            const b = mBudgets[i]
            const pct = b > 0 ? Math.min(100, Math.round(sp/b*100)) : 0
            const over = sp > b && b > 0
            const rest = b - sp
            return (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 7, paddingBottom: 6, marginBottom: 6, borderBottom: i < 11 ? '0.5px solid rgba(15,24,39,.06)' : 'none' }}>
                <span style={{ fontSize: 11, color: '#0F1827', width: 28, flexShrink: 0 }}>{m}</span>
                <input type="number" value={b}
                  onChange={e => { const n=[...mBudgets]; n[i]=parseInt(e.target.value)||0; setMBudgets(n) }}
                  style={{ border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 6, padding: '3px 6px', fontSize: 10, width: 72, textAlign: 'right', outline: 'none', color: '#0F1827' }}/>
                <div style={{ flex: 1, height: 5, background: '#EEF2FB', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: over ? '#EF4444' : '#2B6BE8', borderRadius: 3 }}/>
                </div>
                <span style={{ fontSize: 10, width: 58, textAlign: 'right', fontWeight: 500, color: over ? '#EF4444' : sp > 0 ? '#0EA874' : '#9CA3AF', flexShrink: 0 }}>
                  {sp > 0 ? rest.toLocaleString('es')+'€' : b.toLocaleString('es')+'€'}
                </span>
              </div>
            )
          })}
        </div>

        {/* GRÁFICAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#0F1827', marginBottom: 12 }}>CPL por canal (€)</div>
            {canales.map((c, i) => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 80, fontSize: 10, color: '#5C6A82', textAlign: 'right', flexShrink: 0 }}>{c}</div>
                <div style={{ flex: 1, height: 14, background: '#F1F4FB', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(cpls[i]/maxCpl)*100}%`, height: '100%', background: colores[i], borderRadius: 4 }}/>
                </div>
                <div style={{ width: 40, fontSize: 10, color: '#5C6A82' }}>{cpls[i]}€</div>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#0F1827', marginBottom: 12 }}>Ejecución presupuestaria mensual</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100 }}>
              {meses.slice(0,4).map((m, i) => {
                const sp = spent[i]
                const b = mBudgets[i]
                const maxVal = Math.max(...spent.slice(0,4).map((s,j)=>s+mBudgets[j]))
                return (
                  <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 88 }}>
                      <div style={{ width: '100%', height: `${(sp/maxVal)*80}px`, background: '#2B6BE8', borderRadius: '3px 3px 0 0' }}/>
                      <div style={{ width: '100%', height: `${(Math.max(0,b-sp)/maxVal)*80}px`, background: 'rgba(43,107,232,.15)', borderRadius: 0 }}/>
                    </div>
                    <div style={{ fontSize: 8, color: '#9CA3AF' }}>{m}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, background: '#2B6BE8', borderRadius: 2 }}/><span style={{ fontSize: 10, color: '#5C6A82' }}>Invertido</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, background: 'rgba(43,107,232,.15)', borderRadius: 2 }}/><span style={{ fontSize: 10, color: '#5C6A82' }}>Restante</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

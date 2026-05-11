'use client'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const nav = [
    { href: '/dashboard', label: 'General', icon: '▦' },
    { href: '/dashboard/meta', label: 'Desglose Meta', icon: 'f' },
    { href: '/dashboard/google', label: 'Desglose Google', icon: '⌕' },
    { href: '/dashboard/costes', label: 'Costes', icon: '€' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: '#EEF2FB' }}>
      {/* SIDEBAR */}
      <div style={{ width: 192, background: '#0D1526', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 14px 12px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>MKT Analytics</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>Grupo Safamotor</div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '0 14px' }}/>
        <nav style={{ padding: '8px 6px', flex: 1 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '.09em', padding: '0 8px', marginBottom: 4 }}>Análisis</div>
          {nav.map(item => {
            const active = pathname === item.href
            return (
              <div key={item.href} onClick={() => router.push(item.href)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                  background: active ? '#2B6BE8' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,.45)', fontSize: 12 }}>
                <span style={{ width: 16, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </div>
            )
          })}
        </nav>
        <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '0 14px' }}/>
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2B6BE8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#fff', flexShrink: 0 }}>S</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>Safamotor</div>
            <div onClick={handleLogout} style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', cursor: 'pointer', textDecoration: 'underline' }}>Cerrar sesión</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TOPBAR */}
        <div style={{ background: '#fff', borderBottom: '0.5px solid rgba(15,24,39,.08)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#0F1827' }}>
            {nav.find(n => n.href === pathname)?.label || 'Dashboard'}
          </span>
          <div style={{ width: 1, height: 14, background: 'rgba(15,24,39,.08)' }}/>
          <select style={{ fontSize: 11, padding: '4px 9px', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 20, background: '#fff', color: '#0F1827', cursor: 'pointer', outline: 'none' }}>
            <option>Ene–Abr 2025</option><option>Ene–Mar 2025</option><option>Abr 2025</option>
          </select>
          <select style={{ fontSize: 11, padding: '4px 9px', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 20, background: '#fff', color: '#0F1827', cursor: 'pointer', outline: 'none' }}>
            <option>Todas las marcas</option><option>Audi</option><option>Volkswagen</option><option>Škoda</option>
          </select>
          <select style={{ fontSize: 11, padding: '4px 9px', border: '0.5px solid rgba(15,24,39,.08)', borderRadius: 20, background: '#fff', color: '#0F1827', cursor: 'pointer', outline: 'none' }}>
            <option>Todos los modelos</option><option>A3 · A4 · Q5</option><option>Golf · Polo · Tiguan</option><option>Octavia · Kodiaq</option>
          </select>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

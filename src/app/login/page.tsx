'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Credenciales incorrectas.'); setLoading(false) }
    else router.push('/dashboard')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback`, queryParams: { hd: 'safamotor.com' } },
    })
  }

  return (
    <div style={{minHeight:'100vh',background:'#EEF2FB',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:14,padding:28,width:310,border:'0.5px solid rgba(15,24,39,.08)'}}>
        <div style={{width:40,height:40,background:'#2B6BE8',borderRadius:11,margin:'0 auto 10px',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <h1 style={{fontSize:15,fontWeight:500,textAlign:'center',color:'#0F1827'}}>Marketing Analytics</h1>
        <p style={{fontSize:11,color:'#5C6A82',textAlign:'center',margin:'3px 0 18px'}}>Grupo Safamotor · Concesionarios VAG</p>
        <form onSubmit={handleLogin}>
          <label style={{display:'block',fontSize:11,fontWeight:500,marginBottom:4}}>Correo electrónico</label>
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="jgarcia@safamotor.com"
            style={{display:'block',width:'100%',border:'0.5px solid rgba(15,24,39,.08)',borderRadius:8,padding:'8px 11px',fontSize:12,marginBottom:10,outline:'none'}}/>
          <label style={{display:'block',fontSize:11,fontWeight:500,marginBottom:4}}>Contraseña</label>
          <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
            style={{display:'block',width:'100%',border:'0.5px solid rgba(15,24,39,.08)',borderRadius:8,padding:'8px 11px',fontSize:12,marginBottom:10,outline:'none'}}/>
          {error && <p style={{fontSize:11,color:'#EF4444',textAlign:'center',marginBottom:8}}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{width:'100%',background:'#2B6BE8',color:'#fff',border:'none',borderRadius:8,padding:10,fontSize:12,fontWeight:500,cursor:'pointer'}}>
            {loading ? 'Entrando...' : 'Iniciar sesión →'}
          </button>
        </form>
        <div style={{textAlign:'center',fontSize:10,color:'#9CA3AF',margin:'8px 0'}}>o</div>
        <button onClick={handleGoogle}
          style={{width:'100%',background:'#fff',border:'0.5px solid rgba(15,24,39,.08)',borderRadius:8,padding:8,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.3 12a6.8 6.8 0 0 1 .2-1.7L2.8 8.5A11.5 11.5 0 0 0 2 12c0 1.3.2 2.5.7 3.5l2.7-2.1A6.8 6.8 0 0 1 5.3 12z"/><path fill="#FBBC05" d="M12 5.4a6.6 6.6 0 0 1 4.2 1.5l2.2-2.2A11 11 0 0 0 12 2C8.3 2 5 4.1 3.2 7.1l2.7 2.2A6.6 6.6 0 0 1 12 5.4z"/><path fill="#34A853" d="M12 18.6a6.6 6.6 0 0 1-6.1-4.1L3.2 16.9C5 19.9 8.3 22 12 22a10.9 10.9 0 0 0 7.4-2.8l-2.6-2A6.6 6.6 0 0 1 12 18.6z"/><path fill="#4285F4" d="M21.8 12c0-.7-.1-1.4-.2-2H12v4h5.5a4.8 4.8 0 0 1-2 3.1l2.6 2A10.9 10.9 0 0 0 21.8 12z"/></svg>
          Entrar con Google Workspace
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div style={{minHeight:'100vh',background:'#EEF2FB',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:14,padding:32,textAlign:'center',border:'0.5px solid rgba(15,24,39,.08)'}}>
        <h1 style={{fontSize:18,fontWeight:500,color:'#0F1827',marginBottom:8}}>✅ App funcionando</h1>
        <p style={{fontSize:13,color:'#5C6A82'}}>Sesión iniciada correctamente. Aquí irá el dashboard.</p>
      </div>
    </div>
  )
}

# Marketing Analytics — Grupo Safamotor

App de analítica de campañas de marketing (Meta + Google Ads) para los concesionarios Audi, Volkswagen y Škoda del Grupo Safamotor.

**Stack:** Next.js 14 · Supabase · Vercel · TypeScript · Tailwind · Recharts

---

## PASO 1 — Crear el repositorio en GitHub

1. Ve a github.com y crea un repositorio nuevo: `safa-marketing-analytics`
2. Clona este proyecto y súbelo:
```bash
git init
git add .
git commit -m "feat: initial project structure"
git remote add origin https://github.com/TU_ORG/safa-marketing-analytics.git
git push -u origin main
```

---

## PASO 2 — Configurar Supabase

1. Ve a **supabase.com** y crea un nuevo proyecto (región: `eu-west-1` — Irlanda, más cercana)
2. En **SQL Editor**, pega y ejecuta el contenido de `supabase-schema.sql`
3. En **Authentication > Providers**, activa **Google**:
   - Necesitas crear credenciales OAuth en [Google Cloud Console](https://console.cloud.google.com)
   - Crea un proyecto > APIs > Credenciales > OAuth 2.0
   - URI de redirección autorizada: `https://TU_PROYECTO.supabase.co/auth/v1/callback`
   - Pega el Client ID y Client Secret en Supabase
4. En **Authentication > URL Configuration**:
   - Site URL: `https://tu-app.vercel.app`
   - Redirect URLs: `https://tu-app.vercel.app/auth/callback`

---

## PASO 3 — Desplegar en Vercel

1. Ve a **vercel.com**, importa el repositorio de GitHub
2. Framework: **Next.js** (lo detecta automáticamente)
3. Añade las variables de entorno (copia desde `.env.example`):

| Variable | Dónde conseguirla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API |
| `META_ACCESS_TOKEN` | Ver Paso 4 |
| `META_AD_ACCOUNT_ID` | Meta Business Suite > Configuración |
| `GOOGLE_ADS_*` | Ver Paso 5 |
| `CRON_SECRET` | Genera con: `openssl rand -hex 32` |

4. Haz clic en **Deploy**. Vercel leerá `vercel.json` y configurará el cron automáticamente.

---

## PASO 4 — Conectar Meta Ads API

1. Ve a [developers.facebook.com](https://developers.facebook.com) y crea una app de tipo **Business**
2. Añade el producto **Marketing API**
3. En **Herramientas > Explorador de la API Graph**, genera un token con permisos:
   - `ads_read`
   - `ads_management`
   - `business_management`
4. Conviértelo en token permanente siguiendo: Settings > Advanced > Token de larga duración
5. Tu `META_AD_ACCOUNT_ID` lo encuentras en Meta Business Suite > Configuración del negocio > Cuentas publicitarias (formato: `act_XXXXXXXXXX`)

---

## PASO 5 — Conectar Google Ads API

1. Ve a [Google Cloud Console](https://console.cloud.google.com) y crea un proyecto
2. Activa la **Google Ads API**
3. Crea credenciales OAuth 2.0 (tipo: aplicación de escritorio)
4. Descarga el JSON y genera el refresh token con [OAuth Playground](https://developers.google.com/oauthplayground)
5. Solicita un **Developer Token** en Google Ads > Herramientas > Centro de API
   - Con acceso de prueba es suficiente para empezar (datos reales con aprobación)

---

## PASO 6 — Verificar que el cron funciona

Una vez desplegado, puedes llamarlo manualmente para probar:
```
GET https://tu-app.vercel.app/api/sync?secret=TU_CRON_SECRET
```

Deberías ver una respuesta JSON con los registros importados. A partir de ahí, Vercel lo ejecuta solo cada noche a las 3:00 UTC.

---

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Rellena las variables en .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Estructura del proyecto

```
safa-marketing-analytics/
├── src/
│   ├── app/
│   │   ├── login/              # Página de login
│   │   ├── auth/callback/      # Callback OAuth Google
│   │   ├── dashboard/          # Las 4 páginas de la app
│   │   │   ├── page.tsx        # General
│   │   │   ├── meta/           # Desglose Meta
│   │   │   ├── google/         # Desglose Google
│   │   │   └── costes/         # Costes y presupuesto
│   │   └── api/
│   │       └── sync/           # Cron job de sincronización
│   ├── components/
│   │   ├── layout/             # Sidebar, Topbar
│   │   ├── charts/             # Componentes de gráficas
│   │   └── ui/                 # KPI cards, badges, etc.
│   ├── lib/
│   │   └── supabase/           # Clientes browser + server
│   └── types/                  # TypeScript types
├── middleware.ts                # Protección de rutas + dominio
├── supabase-schema.sql          # Ejecutar en Supabase SQL Editor
├── vercel.json                  # Configuración cron
├── tailwind.config.js           # Paleta de colores
└── .env.example                 # Variables de entorno
```

---

## Páginas

| Ruta | Descripción |
|---|---|
| `/login` | Login con email/contraseña o Google Workspace |
| `/dashboard` | General — KPIs, gráficas y funnel |
| `/dashboard/meta` | Desglose campañas Meta |
| `/dashboard/google` | Desglose campañas Google |
| `/dashboard/costes` | Presupuesto editable + CPL por canal |

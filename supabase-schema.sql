-- ═══════════════════════════════════════════════════════════════
--  SAFA MARKETING ANALYTICS — Esquema Supabase
--  Ejecuta este script en Supabase > SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── TABLA: Métricas diarias por campaña Meta ────────────────
CREATE TABLE IF NOT EXISTS meta_campaigns (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date            DATE NOT NULL,
  campaign_id     TEXT NOT NULL,
  campaign_name   TEXT NOT NULL,
  status          TEXT NOT NULL,               -- ACTIVE | PAUSED | DELETED
  objective       TEXT,
  brand           TEXT,                        -- audi | vw | skoda | multi
  spend           NUMERIC(10, 2) DEFAULT 0,
  impressions     INTEGER DEFAULT 0,
  clicks          INTEGER DEFAULT 0,
  leads           INTEGER DEFAULT 0,
  reach           INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (date, campaign_id)
);

-- ─── TABLA: Métricas diarias por campaña Google ──────────────
CREATE TABLE IF NOT EXISTS google_campaigns (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date            DATE NOT NULL,
  campaign_id     TEXT NOT NULL,
  campaign_name   TEXT NOT NULL,
  status          TEXT NOT NULL,               -- ENABLED | PAUSED | REMOVED
  campaign_type   TEXT,                        -- SEARCH | DISPLAY | VIDEO | PERFORMANCE_MAX
  brand           TEXT,                        -- audi | vw | skoda | multi
  spend           NUMERIC(10, 2) DEFAULT 0,
  impressions     INTEGER DEFAULT 0,
  clicks          INTEGER DEFAULT 0,
  conversions     NUMERIC(8, 2) DEFAULT 0,
  quality_score   NUMERIC(4, 1),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (date, campaign_id)
);

-- ─── TABLA: Presupuesto (editable desde la app) ──────────────
CREATE TABLE IF NOT EXISTS budgets (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year            INTEGER NOT NULL,
  month           INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  amount          NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes           TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_by      UUID REFERENCES auth.users(id),
  UNIQUE (year, month)
);

-- Inserta presupuesto inicial 2025 (16.666€/mes ≈ 200K año)
INSERT INTO budgets (year, month, amount) VALUES
  (2025, 1,  16700), (2025, 2,  17800), (2025, 3,  18600),
  (2025, 4,  18400), (2025, 5,  16700), (2025, 6,  17700),
  (2025, 7,  18000), (2025, 8,  15000), (2025, 9,  17000),
  (2025, 10, 17000), (2025, 11, 12400), (2025, 12, 10700)
ON CONFLICT (year, month) DO NOTHING;

-- ─── TABLA: Log de sincronizaciones ──────────────────────────
CREATE TABLE IF NOT EXISTS sync_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source      TEXT NOT NULL,                  -- meta | google
  status      TEXT NOT NULL,                  -- ok | error
  records     INTEGER DEFAULT 0,
  error_msg   TEXT,
  synced_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VISTAS AGREGADAS ────────────────────────────────────────

-- Resumen mensual Meta
CREATE OR REPLACE VIEW v_meta_monthly AS
SELECT
  DATE_TRUNC('month', date)::DATE AS month,
  brand,
  SUM(spend)        AS spend,
  SUM(impressions)  AS impressions,
  SUM(clicks)       AS clicks,
  SUM(leads)        AS leads,
  ROUND(SUM(spend) / NULLIF(SUM(leads), 0), 2) AS cpl,
  ROUND(SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0) * 100, 2) AS ctr
FROM meta_campaigns
GROUP BY 1, 2;

-- Resumen mensual Google
CREATE OR REPLACE VIEW v_google_monthly AS
SELECT
  DATE_TRUNC('month', date)::DATE AS month,
  brand,
  campaign_type,
  SUM(spend)        AS spend,
  SUM(impressions)  AS impressions,
  SUM(clicks)       AS clicks,
  SUM(conversions)  AS conversions,
  ROUND(SUM(spend) / NULLIF(SUM(conversions), 0), 2) AS cpl,
  ROUND(SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0) * 100, 2) AS ctr,
  ROUND(AVG(quality_score), 1) AS avg_quality_score
FROM google_campaigns
GROUP BY 1, 2, 3;

-- KPIs combinados por mes y marca
CREATE OR REPLACE VIEW v_kpis_combined AS
SELECT
  m.month,
  m.brand,
  m.spend      AS meta_spend,
  g.spend      AS google_spend,
  COALESCE(m.spend, 0) + COALESCE(g.spend, 0) AS total_spend,
  m.leads      AS meta_leads,
  g.conversions AS google_leads,
  COALESCE(m.leads, 0) + COALESCE(g.conversions, 0) AS total_leads,
  ROUND(
    (COALESCE(m.spend, 0) + COALESCE(g.spend, 0)) /
    NULLIF(COALESCE(m.leads, 0) + COALESCE(g.conversions, 0), 0), 2
  ) AS cpl_total
FROM v_meta_monthly m
FULL OUTER JOIN v_google_monthly g USING (month, brand);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
-- Solo usuarios autenticados pueden leer datos
ALTER TABLE meta_campaigns   ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read_meta"   ON meta_campaigns   FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_google" ON google_campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_budgets"ON budgets           FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_write_budgets" ON budgets         FOR ALL    TO authenticated USING (true);
CREATE POLICY "auth_read_log"    ON sync_log         FOR SELECT TO authenticated USING (true);

-- Service role (el cron) puede escribir en todo
CREATE POLICY "service_write_meta"   ON meta_campaigns   FOR ALL TO service_role USING (true);
CREATE POLICY "service_write_google" ON google_campaigns FOR ALL TO service_role USING (true);
CREATE POLICY "service_write_log"    ON sync_log         FOR ALL TO service_role USING (true);

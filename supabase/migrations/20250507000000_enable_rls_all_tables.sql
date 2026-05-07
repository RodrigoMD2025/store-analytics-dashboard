-- ============================================================
-- Migration: Enable Row Level Security on all tables
-- Date: 2025-05-07
-- Project: store-analytics-dashboard (cbpemxjuwkjcbgcznzvb)
--
-- ARCHITECTURE NOTE:
--   Backend (GitHub Actions Python)  → uses SUPABASE_KEY (service_role)
--     → service_role bypasses RLS entirely — no policy changes needed
--   Frontend (browser / anon key)    → VITE_SUPABASE_PUBLISHABLE_KEY
--     → subject to RLS — policies below control what anon can read
--
-- WHAT THIS MIGRATION DOES:
--   1. Enables RLS on all public tables (deny-all by default)
--   2. Grants SELECT-only to the `anon` role on dashboard tables
--   3. Applies column-level security on `clientes` to protect
--      `senha` and `chat_id` — never exposed to the browser
-- ============================================================


-- ============================================================
-- STEP 1 — Enable RLS (activates deny-all for anon by default)
-- ============================================================

ALTER TABLE clientes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE execucoes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE lojas_dados           ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_periodicas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_execucao         ENABLE ROW LEVEL SECURITY;

-- Player monitoring tables (used by frontend hooks)
ALTER TABLE monitoring_status     ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_files           ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 2 — clientes: column-level security
--   anon can only read: id, nome, email, ativo
--   PROTECTED (never exposed): senha, chat_id, created_at, updated_at
-- ============================================================

-- Remove table-level SELECT from anon (grants column-level below)
REVOKE SELECT ON clientes FROM anon;

-- Grant only safe columns to anon
GRANT SELECT (id, nome, email, ativo) ON clientes TO anon;

-- Row-level policy: all active rows are readable (column filter above applies)
CREATE POLICY "anon_select_clientes"
  ON clientes
  FOR SELECT
  TO anon
  USING (ativo = true);


-- ============================================================
-- STEP 3 — execucoes: read-only for anon
-- ============================================================

CREATE POLICY "anon_select_execucoes"
  ON execucoes
  FOR SELECT
  TO anon
  USING (true);


-- ============================================================
-- STEP 4 — lojas_dados: read-only for anon
-- ============================================================

CREATE POLICY "anon_select_lojas_dados"
  ON lojas_dados
  FOR SELECT
  TO anon
  USING (true);


-- ============================================================
-- STEP 5 — metricas_periodicas: read-only for anon
-- ============================================================

CREATE POLICY "anon_select_metricas_periodicas"
  ON metricas_periodicas
  FOR SELECT
  TO anon
  USING (true);


-- ============================================================
-- STEP 6 — logs_execucao: read-only for anon
-- ============================================================

CREATE POLICY "anon_select_logs_execucao"
  ON logs_execucao
  FOR SELECT
  TO anon
  USING (true);


-- ============================================================
-- STEP 7 — monitoring_status: read-only for anon
-- ============================================================

CREATE POLICY "anon_select_monitoring_status"
  ON monitoring_status
  FOR SELECT
  TO anon
  USING (true);


-- ============================================================
-- STEP 8 — music_files: read-only for anon
-- ============================================================

CREATE POLICY "anon_select_music_files"
  ON music_files
  FOR SELECT
  TO anon
  USING (true);


-- ============================================================
-- VERIFICATION QUERIES (run after applying migration)
-- ============================================================
--
-- Check RLS status on all tables:
--   SELECT tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public'
--   ORDER BY tablename;
--
-- Check all active policies:
--   SELECT tablename, policyname, roles, cmd, qual
--   FROM pg_policies
--   WHERE schemaname = 'public'
--   ORDER BY tablename, policyname;
--
-- Check column-level grants on clientes:
--   SELECT grantee, table_name, column_name, privilege_type
--   FROM information_schema.column_privileges
--   WHERE table_name = 'clientes'
--   ORDER BY grantee, column_name;
-- ============================================================

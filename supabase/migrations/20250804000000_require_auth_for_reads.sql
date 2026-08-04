-- ============================================================
-- Migration: Require authentication for dashboard reads
-- Date: 2025-08-04
-- Project: store-analytics-dashboard
--
-- CHANGES:
--   Frontend now uses Supabase Auth (email/password login).
--   Previously anon (public) could SELECT dashboard tables.
--   Now only the `authenticated` role can read via the browser.
--
-- ARCHITECTURE NOTE:
--   Backend (GitHub Actions Python) uses SUPABASE_KEY (service_role)
--   -> service_role bypasses RLS entirely — no impact.
--
--   Frontend (browser) uses VITE_SUPABASE_PUBLISHABLE_KEY + a
--   logged-in user's JWT -> role `authenticated` -> policies below.
--
-- ACTIONS:
--   1. Drop the old `anon_select_*` read policies
--   2. Create equivalent `authenticated_select_*` policies
--   3. Restrict clientes column grants to `authenticated`
-- ============================================================

-- ============================================================
-- STEP 1 — Drop old anon policies
-- ============================================================

DROP POLICY IF EXISTS "anon_select_clientes"            ON clientes;
DROP POLICY IF EXISTS "anon_select_execucoes"           ON execucoes;
DROP POLICY IF EXISTS "anon_select_lojas_dados"         ON lojas_dados;
DROP POLICY IF EXISTS "anon_select_metricas_periodicas" ON metricas_periodicas;
DROP POLICY IF EXISTS "anon_select_logs_execucao"       ON logs_execucao;
DROP POLICY IF EXISTS "anon_select_monitoring_status"   ON monitoring_status;
DROP POLICY IF EXISTS "anon_select_music_files"         ON music_files;

-- ============================================================
-- STEP 2 — clientes: column-level security for authenticated
-- ============================================================

-- Remove table-level SELECT from anon (never read clientes anonymously)
REVOKE SELECT ON clientes FROM anon;

-- Ensure anon has no column-level grants on clientes
REVOKE SELECT (id, nome, email, ativo) ON clientes FROM anon;

-- Grant only safe columns to authenticated
GRANT SELECT (id, nome, email, ativo) ON clientes TO authenticated;

-- Row-level policy: all active rows are readable (column filter above applies)
CREATE POLICY "authenticated_select_clientes"
  ON clientes
  FOR SELECT
  TO authenticated
  USING (ativo = true);

-- ============================================================
-- STEP 3 — execucoes: read-only for authenticated
-- ============================================================

CREATE POLICY "authenticated_select_execucoes"
  ON execucoes
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- STEP 4 — lojas_dados: read-only for authenticated
-- ============================================================

CREATE POLICY "authenticated_select_lojas_dados"
  ON lojas_dados
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- STEP 5 — metricas_periodicas: read-only for authenticated
-- ============================================================

CREATE POLICY "authenticated_select_metricas_periodicas"
  ON metricas_periodicas
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- STEP 6 — logs_execucao: read-only for authenticated
-- ============================================================

CREATE POLICY "authenticated_select_logs_execucao"
  ON logs_execucao
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- STEP 7 — monitoring_status: read-only for authenticated
-- ============================================================

CREATE POLICY "authenticated_select_monitoring_status"
  ON monitoring_status
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- STEP 8 — music_files: read-only for authenticated
-- ============================================================

CREATE POLICY "authenticated_select_music_files"
  ON music_files
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- VERIFICATION QUERIES (run after applying migration)
-- ============================================================
--
-- Check active policies:
--   SELECT tablename, policyname, roles, cmd, qual
--   FROM pg_policies
--   WHERE schemaname = 'public'
--   ORDER BY tablename, policyname;
--
-- Confirm no anon policies remain:
--   SELECT tablename, policyname, roles
--   FROM pg_policies
--   WHERE schemaname = 'public' AND 'anon' = ANY(roles);
--
-- Check column-level grants on clientes:
--   SELECT grantee, table_name, column_name, privilege_type
--   FROM information_schema.column_privileges
--   WHERE table_name = 'clientes'
--   ORDER BY grantee, column_name;
-- ============================================================

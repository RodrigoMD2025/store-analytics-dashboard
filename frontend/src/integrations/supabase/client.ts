// Supabase client configuration
// Uses Publishable API Key (new model) - replaces legacy 'anon' key
// See: https://supabase.com/docs/guides/api/api-keys
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment variables - Required (no hardcoded fallbacks for security)
// For local Docker: set in .env file
// For GitHub Actions/Pages: set in GitHub Secrets
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY; // Legacy fallback

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    '[Supabase] Missing environment variables.\n' +
    'Required: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY\n' +
    'See docs/PublicandoNoDockerHub.md for setup instructions.'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export default supabase;
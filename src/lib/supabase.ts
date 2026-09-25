import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Warn instead of throwing at module-evaluation time. Throwing here crashes
  // `next build` (static generation, sitemap/robots) whenever the Supabase env
  // vars aren't configured for the build (e.g. a deployment without them set).
  // Every caller already handles failed queries gracefully at runtime, so we
  // fall back to a placeholder client and let requests fail softly instead.
  console.warn(
    '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. ' +
      'Supabase requests will fail until these are configured (see .env.local locally, ' +
      'or the deployment environment variables in production).'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'http://127.0.0.1:54321',
  supabaseAnonKey ?? 'missing-supabase-key'
);

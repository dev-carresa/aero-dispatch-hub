
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Create supabase clients with the Project URL and the public API key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for operations requiring elevated privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Create a client with the user's access token
export const getSupabaseClient = (accessToken: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// Admin client with service key - for server-side operations
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Create client with user's JWT token - for user-context operations
export const createUserClient = (accessToken: string): SupabaseClient => {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
};

// Helper to get user from JWT token
export const getUserFromToken = async (accessToken: string) => {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !user) {
    return null;
  }

  return user;
};

export default supabaseAdmin;

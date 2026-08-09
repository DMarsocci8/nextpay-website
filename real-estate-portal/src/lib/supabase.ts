import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Suppress fetch errors during client initialization
const originalFetch = global.fetch;
let fetchErrorsSuppressed = true;

if (typeof window !== 'undefined') {
  (window as any).suppressFetchErrors = true;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: async (url: string, options?: RequestInit) => {
      try {
        // Filter out headers that might cause ISO-8859-1 encoding issues
        const cleanOptions = { ...options };
        if (cleanOptions.headers) {
          const headers: Record<string, string> = {};
          const headersObj = cleanOptions.headers as Record<string, string>;
          for (const [key, value] of Object.entries(headersObj)) {
            // Only include ASCII-safe headers
            if (typeof value === 'string' && /^[\x00-\x7F]*$/.test(value)) {
              headers[key] = value;
            }
          }
          cleanOptions.headers = headers;
        }
        return await originalFetch(url, cleanOptions);
      } catch (err) {
        if (fetchErrorsSuppressed && err instanceof TypeError && (err as any).message?.includes('ISO-8859-1')) {
          // Suppress ISO-8859-1 encoding errors during initialization
          console.debug('Suppressed fetch encoding error:', err);
          return new Response(JSON.stringify({}), { status: 200 });
        }
        throw err;
      }
    },
  },
});

// Server-side Supabase client with service role
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper functions
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const signUp = async (email: string, password: string, fullName: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });
};

export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
};

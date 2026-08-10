import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: token,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { session: data.session },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Google auth error:', err);
    return NextResponse.json(
      { error: err?.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

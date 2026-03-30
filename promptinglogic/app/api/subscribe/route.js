// app/api/subscribe/route.js
// Purpose: Email capture API route. Stores subscriber email in Supabase.
//   Table: subscribers (id bigint, email text unique, created_at timestamptz)
//   Create with: CREATE TABLE subscribers (id bigserial primary key, email text unique not null, created_at timestamptz default now());
//
// Env vars required (set in Vercel dashboard):
//   SUPABASE_URL        — your project URL (https://xxxx.supabase.co)
//   SUPABASE_ANON_KEY   — project anon/public key
//
// Key exports: POST handler

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body.email ?? '').trim().toLowerCase();

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const supabase = getSupabase();

    if (!supabase) {
      // Supabase not configured yet — log and succeed gracefully during development
      console.log('[subscribe] Supabase not configured. Would have stored:', email);
      return NextResponse.json({ message: 'You\'re in. We\'ll be in touch.' }, { status: 200 });
    }

    const { error } = await supabase
      .from('subscribers')
      .insert({ email })
      .select();

    if (error) {
      // Duplicate email — treat as success (idempotent)
      if (error.code === '23505') {
        return NextResponse.json({ message: 'You\'re already on the list.' }, { status: 200 });
      }
      console.error('[subscribe] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to subscribe. Try again.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'You\'re in. We\'ll be in touch.' }, { status: 200 });
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

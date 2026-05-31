import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('Auth.js is deprecated. Please use native Supabase Auth.', { status: 404 });
}

export async function POST() {
  return new NextResponse('Auth.js is deprecated. Please use native Supabase Auth.', { status: 404 });
}

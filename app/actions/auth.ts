'use server';

import { cookies } from 'next/headers';

/**
 * Sets a secure, HTTP-only cookie with the Supabase session access token.
 */
export async function setSessionCookieAction(token: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set('sb-admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    return { success: true };
  } catch (err: any) {
    console.error('[setSessionCookieAction] Error setting cookie:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Deletes the secure admin session token cookie.
 */
export async function clearSessionCookieAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('sb-admin-token');
    return { success: true };
  } catch (err: any) {
    console.error('[clearSessionCookieAction] Error clearing cookie:', err);
    return { success: false, error: err?.message };
  }
}

import { cookies } from 'next/headers';
import { createSupabaseServer } from './server';

export async function verifyAdminSession() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('sb-admin-token');
    
    if (!tokenCookie || !tokenCookie.value) {
      return { authenticated: false, error: 'No session token cookie found.' };
    }

    const token = tokenCookie.value;
    const supabase = createSupabaseServer();
    
    // Call Supabase Auth API to securely verify token validity and fetch user details
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn('[verifyAdminSession] Session token is invalid or expired:', error?.message);
      return { authenticated: false, error: error?.message || 'Invalid token.' };
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'prabhatclasses2017@gmail.com';
    if (user.email !== adminEmail) {
      console.warn(`[verifyAdminSession] Access denied. User ${user.email} is not the configured admin.`);
      return { authenticated: false, error: 'Access denied: User is not authorized.' };
    }

    return { authenticated: true, user };
  } catch (err: any) {
    console.error('[verifyAdminSession] Unexpected error during verification:', err);
    return { authenticated: false, error: err?.message || 'Authentication error.' };
  }
}

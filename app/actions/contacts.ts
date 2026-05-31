'use server';

import { verifyAdminSession } from '@/lib/supabase/admin';
import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Helper to authenticate administrator via Supabase cookie session
async function authenticateAdmin() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    throw new Error(`Unauthorized: ${session.error || 'Admin privilege required.'}`);
  }
  return session;
}

// 5-second rate limiting helper using cookies
async function checkRateLimit(cookieName: string) {
  const cookieStore = await cookies();
  const lastSubmitCookie = cookieStore.get(cookieName);
  const now = Date.now();

  if (lastSubmitCookie && lastSubmitCookie.value) {
    const lastSubmitTime = parseInt(lastSubmitCookie.value, 10);
    const elapsed = now - lastSubmitTime;
    if (elapsed < 5000) {
      const waitTime = Math.ceil((5000 - elapsed) / 1000);
      throw new Error(`Please wait ${waitTime} second(s) before submitting another request.`);
    }
  }

  // Set the rate limit cookie for 5 seconds
  cookieStore.set(cookieName, now.toString(), {
    maxAge: 5,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
}

// Submit a new contact message
export async function submitContactAction(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
}) {
  try {
    // Apply 5-second rate limit
    await checkRateLimit('last-contact-submit');

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      return { success: false, message: 'All required fields must be filled.' };
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (formData.message.length > 1000) {
      return { success: false, message: 'Message cannot exceed 1000 characters.' };
    }

    const supabase = createSupabaseServer();

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          source: formData.source || 'footer_form',
          is_read: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[submitContactAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error submitting contact inquiry.' };
  }
}

// Get all contact submissions (admin only)
export async function getContactsAction(params?: { isRead?: boolean }) {
  try {
    await authenticateAdmin();

    const supabase = createSupabaseServer();
    let query = supabase.from('contacts').select('*');

    if (params?.isRead !== undefined) {
      query = query.eq('is_read', params.isRead);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('[getContactsAction] DB Error:', error);
      return { success: false, message: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error fetching contact submissions.', data: [] };
  }
}

// Mark contact as read (admin only)
export async function markContactReadAction(id: string) {
  try {
    await authenticateAdmin();

    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('contacts')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[markContactReadAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error marking contact as read.' };
  }
}

// Delete contact submission (admin only)
export async function deleteContactAction(id: string) {
  try {
    await authenticateAdmin();

    const supabase = createSupabaseServer();
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[deleteContactAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error deleting contact submission.' };
  }
}

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

// Create a new demo booking
export async function createBookingAction(formData: {
  name: string;
  phone: string;
  email: string;
  selectedDate: Date | string;
  classInterested: string;
  preferredBatch?: string;
  notes?: string;
}) {
  try {
    // Apply 5-second rate limit
    await checkRateLimit('last-booking-submit');

    // Validation
    if (!formData.name || !formData.phone || !formData.email || !formData.selectedDate || !formData.classInterested) {
      return { success: false, message: 'All required fields must be filled.' };
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      return { success: false, message: 'Please enter a valid 10-digit phone number.' };
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const supabase = createSupabaseServer();

    // Check for existing active booking with same email/phone on same date
    const { data: existing, error: findError } = await supabase
      .from('bookings')
      .select('id')
      .or(`phone.eq.${formData.phone},email.eq.${formData.email}`)
      .eq('selected_date', new Date(formData.selectedDate).toISOString())
      .neq('status', 'cancelled')
      .limit(1);

    if (findError) {
      console.error('[createBookingAction] Find Error:', findError);
    }

    if (existing && existing.length > 0) {
      return {
        success: false,
        message: 'A booking already exists for this phone/email on the selected date.',
      };
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          selected_date: new Date(formData.selectedDate).toISOString(),
          class_interested: formData.classInterested,
          preferred_batch: formData.preferredBatch || 'Morning',
          notes: formData.notes || '',
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[createBookingAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data,
      message: 'Demo class booked successfully! We will contact you shortly.',
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error creating booking.' };
  }
}

// Get all bookings (admin only)
export async function getBookingsAction(params?: { status?: string; date?: string }) {
  try {
    await authenticateAdmin();

    const supabase = createSupabaseServer();
    let query = supabase.from('bookings').select('*');

    if (params?.status) {
      query = query.eq('status', params.status);
    }
    if (params?.date) {
      const start = new Date(params.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(params.date);
      end.setHours(23, 59, 59, 999);
      query = query.gte('selected_date', start.toISOString()).lte('selected_date', end.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('[getBookingsAction] DB Error:', error);
      return { success: false, message: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error fetching bookings.', data: [] };
  }
}

// Update booking status (admin only)
export async function updateBookingStatusAction(id: string, status: string) {
  try {
    await authenticateAdmin();

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return { success: false, message: 'Invalid booking status.' };
    }

    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[updateBookingStatusAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error updating booking status.' };
  }
}

// Cancel booking (admin or soft cancellation)
export async function cancelBookingAction(id: string) {
  try {
    await authenticateAdmin();

    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[cancelBookingAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error cancelling booking.' };
  }
}

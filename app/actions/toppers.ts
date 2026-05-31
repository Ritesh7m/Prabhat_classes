'use server';

import { verifyAdminSession } from '@/lib/supabase/admin';
import { createSupabaseServer } from '@/lib/supabase/server';
import { topperSchema } from '@/lib/supabase/schemas';
import { revalidatePath } from 'next/cache';

// Helper to authenticate administrator via Supabase cookie session
async function authenticateAdmin() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    throw new Error(`Unauthorized: ${session.error || 'Admin privilege required.'}`);
  }
  return session;
}

export async function createTopperAction(formData: any) {
  try {
    await authenticateAdmin();

    const parsed = topperSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    const supabase = createSupabaseServer();
    const targetYear = parsed.data.academic_year;

    // 1. Capacity Limits: Retrieve all existing toppers to list unique academic years
    const { data: allToppers, error: fetchError } = await supabase
      .from('toppers')
      .select('academic_year');

    if (fetchError) {
      console.error('[createTopperAction] Fetch Error:', fetchError);
      return { success: false, message: fetchError.message };
    }

    const uniqueYears = Array.from(new Set((allToppers || []).map(t => t.academic_year)));
    const yearExists = uniqueYears.includes(targetYear);

    // 2. If it's a new academic year, check if we already have 10 distinct academic years
    if (!yearExists && uniqueYears.length >= 10) {
      // Find the oldest year using chronological/lexicographical sorting (e.g. "2023-2024", "2024-2025")
      const sortedYears = [...uniqueYears].sort();
      const oldestYear = sortedYears[0];

      // Delete all toppers associated with this oldest year
      const { error: purgeError } = await supabase
        .from('toppers')
        .delete()
        .eq('academic_year', oldestYear);

      if (purgeError) {
        console.error(`[createTopperAction] Failed to purge oldest year ${oldestYear}:`, purgeError);
        return { success: false, message: `Failed to purge oldest year (${oldestYear}) to make room.` };
      }

      console.log(`[createTopperAction] Automatically purged academic year ${oldestYear} to maintain 10-year limit.`);
    }

    // 3. Enforce maximum 10 toppers per academic year
    const toppersForTargetYear = (allToppers || []).filter(t => t.academic_year === targetYear);
    if (toppersForTargetYear.length >= 10) {
      return {
        success: false,
        message: `Maximum limit of 10 toppers reached for the academic year ${targetYear}.`,
      };
    }

    // 4. Insert simplified columns
    const { data, error } = await supabase
      .from('toppers')
      .insert([
        {
          student_name: parsed.data.student_name,
          percentage: parsed.data.percentage,
          image_url: parsed.data.image_url,
          academic_year: parsed.data.academic_year,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[createTopperAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/toppers');
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error' };
  }
}

// Helper to check if string is a valid UUID format
function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

export async function updateTopperAction(id: string, formData: any) {
  try {
    await authenticateAdmin();

    if (!isValidUUID(id)) {
      return { success: false, message: 'System fallback records cannot be modified. Please register a new topper record.' };
    }

    const parsed = topperSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('toppers')
      .update({
        student_name: parsed.data.student_name,
        percentage: parsed.data.percentage,
        image_url: parsed.data.image_url,
        academic_year: parsed.data.academic_year,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[updateTopperAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/toppers');
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error' };
  }
}

export async function deleteTopperAction(id: string) {
  try {
    await authenticateAdmin();

    if (!isValidUUID(id)) {
      // Return success gracefully so client-side UI optimistically removes the fallback item from state
      return { success: true, message: 'Fallback record successfully handled.' };
    }

    const supabase = createSupabaseServer();
    const { error } = await supabase
      .from('toppers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[deleteTopperAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/toppers');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error' };
  }
}


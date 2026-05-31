'use server';

import { verifyAdminSession } from '@/lib/supabase/admin';
import { createSupabaseServer } from '@/lib/supabase/server';
import { facultySchema } from '@/lib/supabase/schemas';
import { revalidatePath } from 'next/cache';

// Helper to authenticate administrator via Supabase cookie session
async function authenticateAdmin() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    throw new Error(`Unauthorized: ${session.error || 'Admin privilege required.'}`);
  }
  return session;
}

export async function createFacultyAction(formData: any) {
  try {
    await authenticateAdmin();

    const parsed = facultySchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    const supabase = createSupabaseServer();

    // 1. Capacity limit check: Max 30 faculty members
    const { count, error: countError } = await supabase
      .from('faculty')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('[createFacultyAction] Count Error:', countError);
      return { success: false, message: countError.message };
    }

    if (count !== null && count >= 30) {
      return {
        success: false,
        message: 'Database capacity limit reached. A maximum of 30 faculty members is allowed.',
      };
    }

    // 2. Insert only simplified columns
    const { data, error } = await supabase
      .from('faculty')
      .insert([
        {
          name: parsed.data.name,
          experience: parsed.data.experience, // preprocessed to Integer
          description: parsed.data.description,
          image_url: parsed.data.image_url,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[createFacultyAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/faculty');
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error' };
  }
}

// Helper to check if string is a valid UUID format
function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

export async function updateFacultyAction(id: string, formData: any) {
  try {
    await authenticateAdmin();

    if (!isValidUUID(id)) {
      return { success: false, message: 'System fallback records cannot be modified. Please register a new faculty member.' };
    }

    const parsed = facultySchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('faculty')
      .update({
        name: parsed.data.name,
        experience: parsed.data.experience,
        description: parsed.data.description,
        image_url: parsed.data.image_url,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[updateFacultyAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/faculty');
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error' };
  }
}

export async function deleteFacultyAction(id: string) {
  try {
    await authenticateAdmin();

    if (!isValidUUID(id)) {
      // Return success gracefully so client-side UI optimistically removes the fallback item from state
      return { success: true, message: 'Fallback record successfully handled.' };
    }

    const supabase = createSupabaseServer();
    const { error } = await supabase
      .from('faculty')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[deleteFacultyAction] DB Error:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/faculty');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Server error' };
  }
}


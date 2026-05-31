'use server';

import { verifyAdminSession } from '@/lib/supabase/admin';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function uploadImageAction(
  base64Data: string,
  fileName: string,
  fileType: string,
  fileSize: number
) {
  try {
    // 1. Authenticate session via Supabase cookie session
    const session = await verifyAdminSession();
    if (!session.authenticated) {
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }

    // 2. Validate file type (png/jpg/jpeg only)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(fileType.toLowerCase())) {
      return {
        success: false,
        message: 'Unsupported format. Only PNG, JPG, and JPEG files are allowed.',
      };
    }

    // 3. Validate file size (10 MB max)
    const maxBytes = 10 * 1024 * 1024;
    if (fileSize > maxBytes) {
      return {
        success: false,
        message: 'File size exceeds limit. Maximum allowed size is 10 MB.',
      };
    }

    // 4. Decode base64 data to buffer
    const base64Content = base64Data.includes(',')
      ? base64Data.split(',')[1]
      : base64Data;
    const buffer = Buffer.from(base64Content, 'base64');

    // 5. Generate a safe unique name
    const fileExt = fileName.split('.').pop() || 'jpg';
    const uniqueName = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    // 6. Connect to Supabase and upload
    const supabase = createSupabaseServer();
    const { error } = await supabase.storage
      .from('toppers-faculty')
      .upload(uniqueName, buffer, {
        contentType: fileType,
        upsert: true,
      });

    if (error) {
      console.error('[uploadImageAction] Storage Upload Error:', error);
      return { success: false, message: error.message };
    }

    // 7. Get public URL
    const { data: urlData } = supabase.storage
      .from('toppers-faculty')
      .getPublicUrl(uniqueName);

    return {
      success: true,
      url: urlData.publicUrl,
      fileName: uniqueName,
    };
  } catch (err: any) {
    console.error('[uploadImageAction] Server Error:', err);
    return { success: false, message: err?.message || 'Server upload failed.' };
  }
}

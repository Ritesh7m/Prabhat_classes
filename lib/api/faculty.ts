import { supabaseClient } from '@/lib/supabase/client';
import { fallbackFaculty } from './fallback-data';

export interface Faculty {
  _id: string;
  name: string;
  role: string;
  subject: string;
  image: string;
  experience: string;
  description?: string;
  qualifications?: string[];
  isOwner: boolean;
  order: number;
  isActive?: boolean;
}

const getSupabaseInstance = () => {
  if (typeof window === 'undefined') {
    // Dynamic import to prevent service role key leakage in browser bundling
    const { createSupabaseServer } = require('@/lib/supabase/server');
    return createSupabaseServer();
  }
  return supabaseClient;
};

interface FacultyParams {
  limit?: number;
}

// Get all faculty members
export const getFaculty = async (params?: FacultyParams): Promise<{ data: Faculty[]; error: string | null; isOffline: boolean }> => {
  try {
    const supabase = getSupabaseInstance();
    let query = supabase
      .from('faculty')
      .select('*')
      .order('created_at', { ascending: true });

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data && data.length > 0) {
      const mappedData: Faculty[] = data.map((item: any) => {
        const nameLower = item.name.toLowerCase();
        const isOwner = nameLower.includes('prabhat');
        return {
          _id: item.id,
          name: item.name,
          role: isOwner ? 'Founder & Director' : 'Senior Faculty',
          subject: isOwner ? 'Commerce & Accounts' : '',
          image: item.image_url,
          experience: typeof item.experience === 'number' ? `${item.experience}+ Years` : item.experience,
          description: item.description || '',
          isOwner: isOwner,
          order: isOwner ? 1 : 2,
        };
      });

      // Sort so owner appears first
      mappedData.sort((a, b) => a.order - b.order);

      return {
        data: mappedData,
        error: null,
        isOffline: false,
      };
    }

    // If data is empty, trigger standard fallback
    let filteredFallback = fallbackFaculty;
    if (params?.limit) {
      filteredFallback = filteredFallback.slice(0, params.limit);
    }
    return {
      data: filteredFallback,
      error: null,
      isOffline: true,
    };
  } catch (error: any) {
    console.warn('[Faculty Service] Supabase unavailable, falling back to static local data. Error:', error?.message || error);
    let filteredFallback = fallbackFaculty;
    if (params?.limit) {
      filteredFallback = filteredFallback.slice(0, params.limit);
    }
    return {
      data: filteredFallback,
      error: error?.message || 'Supabase error',
      isOffline: true,
    };
  }
};

// Get single faculty member by ID
export const getFacultyById = async (id: string): Promise<{ data: Faculty | null; error: string | null }> => {
  try {
    const supabase = getSupabaseInstance();
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      const nameLower = data.name.toLowerCase();
      const isOwner = nameLower.includes('prabhat');
      const mapped: Faculty = {
        _id: data.id,
        name: data.name,
        role: isOwner ? 'Founder & Director' : 'Senior Faculty',
        subject: isOwner ? 'Commerce & Accounts' : '',
        image: data.image_url,
        experience: typeof data.experience === 'number' ? `${data.experience}+ Years` : data.experience,
        description: data.description || '',
        isOwner: isOwner,
        order: isOwner ? 1 : 2,
      };
      return { data: mapped, error: null };
    }

    const fallback = fallbackFaculty.find(f => f._id === id) || null;
    return { data: fallback, error: null };
  } catch (error: any) {
    console.warn('[Faculty Service] Failed to retrieve by ID, using static fallback. Error:', error?.message || error);
    const fallback = fallbackFaculty.find(f => f._id === id) || null;
    return { data: fallback, error: error?.message || 'Supabase error' };
  }
};

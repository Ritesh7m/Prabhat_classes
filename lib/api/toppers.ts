import { supabaseClient } from '@/lib/supabase/client';
import { fallbackToppers, fallbackToppers2024 } from './fallback-data';

export interface Topper {
  _id: string;
  name: string;
  percentage: string;
  rank: number;
  image: string;
  year: string;
  subjects?: { name: string; score: number }[];
  attendanceRecord?: string;
  batch?: string;
  isActive?: boolean;
}

interface ToppersParams {
  year?: string;
  limit?: number;
}

const getSupabaseInstance = () => {
  if (typeof window === 'undefined') {
    // Dynamic import to prevent service role key leakage in browser bundling
    const { createSupabaseServer } = require('@/lib/supabase/server');
    return createSupabaseServer();
  }
  return supabaseClient;
};

// Get all toppers with optional filters
export const getToppers = async (params?: ToppersParams): Promise<{ data: Topper[]; error: string | null; isOffline: boolean }> => {
  try {
    const supabase = getSupabaseInstance();
    let query = supabase.from('toppers').select('*');

    if (params?.year && params.year !== 'All-Time Records') {
      query = query.eq('academic_year', params.year);
    }

    // Always sort by percentage descending to rank them dynamically
    query = query.order('percentage', { ascending: false });

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data && data.length > 0) {
      const mappedData: Topper[] = data.map((item: any, index: number) => {
        const pctStr = item.percentage.toString();
        return {
          _id: item.id,
          name: item.student_name,
          percentage: pctStr.endsWith('%') ? pctStr : `${pctStr}%`,
          rank: index + 1, // Dynamically compute rank based on sorted percentages
          image: item.image_url,
          year: item.academic_year,
          attendanceRecord: '95%',
          batch: 'English Medium',
        };
      });

      return {
        data: mappedData,
        error: null,
        isOffline: false,
      };
    }

    // If data is empty, use custom local fallback
    let filteredData = fallbackToppers;
    if (params?.year && params.year !== 'All-Time Records') {
      filteredData = params.year === '2024-2025' ? fallbackToppers2024 : fallbackToppers.filter(t => t.year === params.year);
    }
    if (params?.limit) {
      filteredData = filteredData.slice(0, params.limit);
    }

    return {
      data: filteredData,
      error: null,
      isOffline: true,
    };
  } catch (error: any) {
    console.warn('[Toppers Service] Supabase unavailable, falling back to static local data. Error:', error?.message || error);
    
    let filteredData = fallbackToppers;
    if (params?.year && params.year !== 'All-Time Records') {
      filteredData = params.year === '2024-2025' ? fallbackToppers2024 : fallbackToppers.filter(t => t.year === params.year);
    }
    if (params?.limit) {
      filteredData = filteredData.slice(0, params.limit);
    }

    return {
      data: filteredData,
      error: error?.message || 'Supabase error',
      isOffline: true,
    };
  }
};

// Get single topper by ID
export const getTopperById = async (id: string): Promise<{ data: Topper | null; error: string | null }> => {
  try {
    const supabase = getSupabaseInstance();
    const { data, error } = await supabase
      .from('toppers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      const pctStr = data.percentage.toString();
      const mapped: Topper = {
        _id: data.id,
        name: data.student_name,
        percentage: pctStr.endsWith('%') ? pctStr : `${pctStr}%`,
        rank: 1, // Default fallback for single retrieval
        image: data.image_url,
        year: data.academic_year,
        attendanceRecord: '95%',
        batch: 'English Medium',
      };
      return { data: mapped, error: null };
    }

    const fallback = fallbackToppers.find(t => t._id === id) || fallbackToppers2024.find(t => t._id === id) || null;
    return { data: fallback, error: null };
  } catch (error: any) {
    console.warn('[Toppers Service] Failed to retrieve by ID, using static fallback. Error:', error?.message || error);
    const fallback = fallbackToppers.find(t => t._id === id) || fallbackToppers2024.find(t => t._id === id) || null;
    return { data: fallback, error: error?.message || 'Supabase error' };
  }
};

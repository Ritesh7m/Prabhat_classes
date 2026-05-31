import { 
  createBookingAction, 
  getBookingsAction, 
  updateBookingStatusAction, 
  cancelBookingAction 
} from '@/app/actions/bookings';

export interface DemoBooking {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  selectedDate: Date | string;
  preferredBatch?: 'Morning' | 'Afternoon' | 'Evening';
  classInterested: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
}

// Create a new demo booking
export const createBooking = async (bookingData: Omit<DemoBooking, '_id' | 'status' | 'createdAt'>): Promise<{ 
  data: DemoBooking | null; 
  message: string; 
  error: string | null;
  isOffline: boolean;
}> => {
  try {
    const response = await createBookingAction({
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      selectedDate: bookingData.selectedDate,
      classInterested: bookingData.classInterested,
      preferredBatch: bookingData.preferredBatch,
    });

    if (response.success && response.data) {
      const item = response.data;
      return { 
        data: {
          _id: item.id,
          name: item.name,
          phone: item.phone,
          email: item.email,
          selectedDate: item.selected_date,
          preferredBatch: item.preferred_batch,
          classInterested: item.class_interested,
          status: item.status,
          notes: item.notes,
          createdAt: item.created_at,
        }, 
        message: response.message || 'Booking created successfully!',
        error: null,
        isOffline: false
      };
    } else {
      return { 
        data: null, 
        message: '',
        error: response.message || 'Failed to create booking',
        isOffline: false
      };
    }
  } catch (error: any) {
    console.warn('[Bookings Service] Supabase Server Action error - falling back to offline mode. Error:', error?.message || error);
    return {
      data: { ...bookingData, _id: `offline-${Date.now()}`, status: 'pending' },
      message: 'Your booking request has been received. We will confirm once our system is back online.',
      error: null,
      isOffline: true
    };
  }
};

// Get all bookings (admin)
export const getBookings = async (params?: { status?: string; date?: string }): Promise<{ 
  data: DemoBooking[]; 
  error: string | null 
}> => {
  try {
    const response = await getBookingsAction(params);
    if (response.success && response.data) {
      const mapped = response.data.map((item: any) => ({
        _id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email,
        selectedDate: item.selected_date,
        preferredBatch: item.preferred_batch,
        classInterested: item.class_interested,
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at,
      }));
      return { data: mapped, error: null };
    }
    return { data: [], error: response.message || 'Failed to fetch bookings' };
  } catch (error: any) {
    console.error('[Bookings Service] Error in getBookings:', error);
    return { data: [], error: error?.message || 'Failed to fetch bookings' };
  }
};

// Update booking status (admin)
export const updateBookingStatus = async (
  id: string, 
  status: DemoBooking['status']
): Promise<{ data: DemoBooking | null; error: string | null }> => {
  try {
    const response = await updateBookingStatusAction(id, status || 'pending');
    if (response.success && response.data) {
      const item = response.data;
      const mapped: DemoBooking = {
        _id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email,
        selectedDate: item.selected_date,
        preferredBatch: item.preferred_batch,
        classInterested: item.class_interested,
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at,
      };
      return { data: mapped, error: null };
    }
    return { data: null, error: response.message || 'Failed to update booking' };
  } catch (error: any) {
    console.error('[Bookings Service] Error in updateBookingStatus:', error);
    return { data: null, error: error?.message || 'Failed to update booking' };
  }
};

// Cancel booking
export const cancelBooking = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const response = await cancelBookingAction(id);
    return { success: !!response.success, error: response.success ? null : (response.message || 'Failed to cancel') };
  } catch (error: any) {
    console.error('[Bookings Service] Error in cancelBooking:', error);
    return { success: false, error: error?.message || 'Failed to cancel booking' };
  }
};


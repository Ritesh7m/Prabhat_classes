import { 
  submitContactAction, 
  getContactsAction, 
  markContactReadAction, 
  deleteContactAction 
} from '@/app/actions/contacts';

export interface ContactSubmission {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: 'footer_form' | 'contact_page' | 'popup';
  isRead?: boolean;
  createdAt?: string;
}

// Submit contact form
export const submitContact = async (contactData: Omit<ContactSubmission, '_id' | 'isRead' | 'createdAt'>): Promise<{
  data: ContactSubmission | null;
  message: string;
  error: string | null;
  isOffline: boolean;
}> => {
  try {
    const response = await submitContactAction({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      message: contactData.message,
      source: contactData.source,
    });

    if (response.success && response.data) {
      const item = response.data;
      return {
        data: {
          _id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message,
          source: item.source as any,
          isRead: item.is_read,
          createdAt: item.created_at,
        },
        message: response.message || 'Message sent successfully!',
        error: null,
        isOffline: false
      };
    } else {
      return {
        data: null,
        message: '',
        error: response.message || 'Failed to submit contact form',
        isOffline: false
      };
    }
  } catch (error: any) {
    console.warn('[Contacts Service] Supabase Server Action error - falling back to offline mode. Error:', error?.message || error);
    return {
      data: { ...contactData, _id: `offline-${Date.now()}` },
      message: 'Your message has been received. We will respond once our system is back online.',
      error: null,
      isOffline: true
    };
  }
};

// Get all contacts (admin)
export const getContacts = async (params?: { isRead?: boolean }): Promise<{
  data: ContactSubmission[];
  error: string | null;
}> => {
  try {
    const response = await getContactsAction(params);
    if (response.success && response.data) {
      const mapped = response.data.map((item: any) => ({
        _id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        message: item.message,
        source: item.source as any,
        isRead: item.is_read,
        createdAt: item.created_at,
      }));
      return { data: mapped, error: null };
    }
    return { data: [], error: response.message || 'Failed to fetch contacts' };
  } catch (error: any) {
    console.error('[Contacts Service] Error in getContacts:', error);
    return { data: [], error: error?.message || 'Failed to fetch contacts' };
  }
};

// Mark contact as read (admin)
export const markContactRead = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const response = await markContactReadAction(id);
    return { success: !!response.success, error: response.success ? null : (response.message || 'Failed to update contact') };
  } catch (error: any) {
    console.error('[Contacts Service] Error in markContactRead:', error);
    return { success: false, error: error?.message || 'Failed to mark contact as read' };
  }
};

// Delete contact (admin)
export const deleteContact = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const response = await deleteContactAction(id);
    return { success: !!response.success, error: response.success ? null : (response.message || 'Failed to delete contact') };
  } catch (error: any) {
    console.error('[Contacts Service] Error in deleteContact:', error);
    return { success: false, error: error?.message || 'Failed to delete contact' };
  }
};


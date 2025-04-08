
import { supabase } from '@/integrations/supabase/client';
import type { 
  Profile, Subject, TutorSubject, Availability, 
  Booking, Review, Message, Conversation, 
  BookingStatus, BookingMode 
} from '@/types/database.types';

// Profile APIs
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

export const updateProfile = async (userId: string, profile: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  
  return data;
};

// Subject APIs
export const getSubjects = async (): Promise<Subject[]> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
  
  return data || [];
};

export const getSubject = async (subjectId: string): Promise<Subject | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .single();
  
  if (error) {
    console.error('Error fetching subject:', error);
    return null;
  }
  
  return data;
};

// Tutor Subject APIs
export const getTutorSubjects = async (tutorId: string): Promise<TutorSubject[]> => {
  const { data, error } = await supabase
    .from('tutor_subjects')
    .select('*, subjects(*)')
    .eq('tutor_id', tutorId);
  
  if (error) {
    console.error('Error fetching tutor subjects:', error);
    return [];
  }
  
  return data || [];
};

export const addTutorSubject = async (tutorSubject: Omit<TutorSubject, 'id' | 'created_at'>): Promise<TutorSubject | null> => {
  const { data, error } = await supabase
    .from('tutor_subjects')
    .insert(tutorSubject)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding tutor subject:', error);
    return null;
  }
  
  return data;
};

export const removeTutorSubject = async (tutorId: string, subjectId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tutor_subjects')
    .delete()
    .eq('tutor_id', tutorId)
    .eq('subject_id', subjectId);
  
  if (error) {
    console.error('Error removing tutor subject:', error);
    return false;
  }
  
  return true;
};

// Availability APIs
export const getTutorAvailability = async (tutorId: string): Promise<Availability[]> => {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('tutor_id', tutorId)
    .order('day_of_week')
    .order('start_time');
  
  if (error) {
    console.error('Error fetching tutor availability:', error);
    return [];
  }
  
  return data || [];
};

export const addAvailability = async (availability: Omit<Availability, 'id' | 'created_at' | 'updated_at'>): Promise<Availability | null> => {
  const { data, error } = await supabase
    .from('availability')
    .insert(availability)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding availability:', error);
    return null;
  }
  
  return data;
};

export const updateAvailability = async (availabilityId: string, availability: Partial<Availability>): Promise<Availability | null> => {
  const { data, error } = await supabase
    .from('availability')
    .update(availability)
    .eq('id', availabilityId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating availability:', error);
    return null;
  }
  
  return data;
};

export const deleteAvailability = async (availabilityId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('availability')
    .delete()
    .eq('id', availabilityId);
  
  if (error) {
    console.error('Error deleting availability:', error);
    return false;
  }
  
  return true;
};

// Booking APIs
export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }
  
  return data;
};

export const getBooking = async (bookingId: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();
  
  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
  
  return data;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles!bookings_tutor_id_fkey(*), subjects(*)')
    .or(`student_id.eq.${userId},tutor_id.eq.${userId}`)
    .order('start_time', { ascending: false });
  
  if (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
  
  return data || [];
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating booking status:', error);
    return null;
  }
  
  return data;
};

// Review APIs
export const createReview = async (review: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating review:', error);
    return null;
  }
  
  return data;
};

export const getTutorReviews = async (tutorId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles!reviews_reviewer_id_fkey(*)')
    .eq('reviewee_id', tutorId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tutor reviews:', error);
    return [];
  }
  
  return data || [];
};

// Messaging APIs
export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, profiles!conversations_student_id_fkey(*), profiles!conversations_tutor_id_fkey(*)')
    .or(`student_id.eq.${userId},tutor_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
  
  return data || [];
};

export const getOrCreateConversation = async (studentId: string, tutorId: string): Promise<Conversation | null> => {
  // Check if conversation exists
  const { data: existingConversation, error: fetchError } = await supabase
    .from('conversations')
    .select('*')
    .eq('student_id', studentId)
    .eq('tutor_id', tutorId)
    .single();
  
  if (!fetchError && existingConversation) {
    return existingConversation;
  }
  
  // Create new conversation
  const { data: newConversation, error: createError } = await supabase
    .from('conversations')
    .insert({ student_id: studentId, tutor_id: tutorId })
    .select()
    .single();
  
  if (createError) {
    console.error('Error creating conversation:', createError);
    return null;
  }
  
  return newConversation;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles!messages_sender_id_fkey(*)')
    .eq('conversation_id', conversationId)
    .order('created_at');
  
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  
  return data || [];
};

export const sendMessage = async (message: Omit<Message, 'id' | 'created_at' | 'is_read'>): Promise<Message | null> => {
  const { data, error } = await supabase
    .from('messages')
    .insert({ ...message, is_read: false })
    .select()
    .single();
  
  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  
  return data;
};

export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .eq('recipient_id', userId);
  
  if (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
  
  return true;
};

// Search Tutors API
export const searchTutors = async (subjectId?: string, location?: string): Promise<Profile[]> => {
  let query = supabase
    .from('profiles')
    .select('*, tutor_subjects!inner(*)')
    .eq('role', 'tutor');
  
  if (subjectId) {
    query = query.eq('tutor_subjects.subject_id', subjectId);
  }
  
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error searching tutors:', error);
    return [];
  }
  
  // Remove duplicates (can happen when joining with tutor_subjects)
  const uniqueTutors = Array.from(new Map(data.map(tutor => [tutor.id, tutor])).values());
  
  return uniqueTutors;
};

// Get profile data including related records
export const getProfileWithDetails = async (userId: string): Promise<{
  profile: Profile | null;
  subjects?: TutorSubject[];
  availability?: Availability[];
  bookings?: Booking[];
}> => {
  const profile = await getProfile(userId);
  
  if (!profile) {
    return { profile: null };
  }
  
  if (profile.role === 'tutor') {
    const [subjects, availability] = await Promise.all([
      getTutorSubjects(userId),
      getTutorAvailability(userId),
    ]);
    
    return { profile, subjects, availability };
  } else {
    // For students
    const bookings = await getUserBookings(userId);
    return { profile, bookings };
  }
};

// Setup real-time listeners
export const subscribeToMessages = (conversationId: string, callback: (message: Message) => void) => {
  return supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      callback(payload.new as Message);
    })
    .subscribe();
};

export const subscribeToBookingUpdates = (userId: string, callback: (booking: Booking) => void) => {
  return supabase
    .channel(`bookings:${userId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'bookings',
      filter: `student_id=eq.${userId}` 
    }, (payload) => {
      callback(payload.new as Booking);
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'bookings',
      filter: `tutor_id=eq.${userId}`
    }, (payload) => {
      callback(payload.new as Booking);
    })
    .subscribe();
};

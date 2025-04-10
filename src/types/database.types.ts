
export type Profile = {
  id: string;
  name: string;
  role: 'student' | 'tutor';
  bio?: string;
  hourly_rate?: number;
  location?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Subject = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  created_at: string;
};

export type TutorSubject = {
  id: string;
  tutor_id: string;
  subject_id: string;
  experience_years?: number;
  created_at: string;
};

export type Availability = {
  id: string;
  tutor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
};

export type BookingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';
export type BookingMode = 'online' | 'in-person';

export type Booking = {
  id: string;
  student_id: string;
  tutor_id: string;
  subject_id?: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  mode: BookingMode;
  location?: string;
  meeting_link?: string;
  notes?: string;
  amount?: number;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  booking_id?: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  conversation_id?: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  student_id: string;
  tutor_id: string;
  created_at: string;
  updated_at: string;
};

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export type Course = {
  id: string;
  tutor_id: string;
  title: string;
  description: string;
  subject_id: string;
  duration_weeks: number;
  level: CourseLevel;
  price: number;
  max_students: number;
  current_students?: number;
  created_at: string;
  updated_at: string;
  // Add relations that come from Supabase joins
  profiles?: Profile;
  subjects?: Subject;
};

export type CourseEnrollment = {
  id: string;
  course_id: string;
  student_id: string;
  enrollment_date: string;
  status: EnrollmentStatus;
  // Add relations that come from Supabase joins
  profiles?: Profile;
  courses?: Course;
};

export type Testimonial = {
  id: string;
  student_name: string;
  student_avatar?: string;
  course_name?: string;
  subject?: string;
  content: string;
  rating: number;
  created_at: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  type: 'blog' | 'document' | 'video' | 'link';
  url?: string;
  file_url?: string;
  thumbnail_url?: string;
  created_at: string;
  subject_id?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar_url?: string;
  order: number;
};

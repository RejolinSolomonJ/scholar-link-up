
-- Create users table extensions (to extend the built-in auth.users table)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'tutor')),
  bio TEXT,
  hourly_rate DECIMAL(10, 2),
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create tutor_subjects junction table (which subjects a tutor teaches)
CREATE TABLE IF NOT EXISTS tutor_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(tutor_id, subject_id)
);

-- Create availability table (for tutors to set their available times)
CREATE TABLE IF NOT EXISTS availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
  mode TEXT NOT NULL CHECK (mode IN ('online', 'in-person')),
  location TEXT,
  meeting_link TEXT,
  notes TEXT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create conversation table to group messages
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(student_id, tutor_id)
);

-- Add column to messages to link to conversations
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;

-- Insert some basic subjects
INSERT INTO subjects (name, description) VALUES
('Mathematics', 'General mathematics, algebra, geometry, calculus, and statistics'),
('Physics', 'Classical mechanics, thermodynamics, electromagnetism, and quantum physics'),
('Chemistry', 'Organic chemistry, inorganic chemistry, biochemistry, and analytical chemistry'),
('Biology', 'Cell biology, genetics, ecology, and evolutionary biology'),
('English', 'Literature, writing, grammar, and language studies'),
('Computer Science', 'Programming, algorithms, data structures, and software engineering'),
('History', 'World history, regional history, and historical analysis')
ON CONFLICT (name) DO NOTHING;

-- Set up RLS (Row Level Security) policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- Profiles: users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subjects: everyone can read
CREATE POLICY "Subjects are viewable by everyone" ON subjects FOR SELECT USING (true);

-- Tutor subjects: everyone can read, tutors can manage their own
CREATE POLICY "Tutor subjects are viewable by everyone" ON tutor_subjects FOR SELECT USING (true);
CREATE POLICY "Tutors can manage their subjects" ON tutor_subjects FOR ALL USING (auth.uid() = tutor_id);

-- Availability: everyone can read, tutors can manage their own
CREATE POLICY "Availability is viewable by everyone" ON availability FOR SELECT USING (true);
CREATE POLICY "Tutors can manage their availability" ON availability FOR ALL USING (auth.uid() = tutor_id);

-- Bookings: users can read and update their own bookings (as student or tutor)
CREATE POLICY "Users can view their bookings" ON bookings FOR SELECT 
USING (auth.uid() = student_id OR auth.uid() = tutor_id);
CREATE POLICY "Students can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can update their bookings" ON bookings FOR UPDATE 
USING (auth.uid() = student_id OR auth.uid() = tutor_id);

-- Reviews: everyone can read, reviewer can create their own
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- Conversations: users can read and manage conversations they're part of
CREATE POLICY "Users can view their conversations" ON conversations FOR SELECT 
USING (auth.uid() = student_id OR auth.uid() = tutor_id);
CREATE POLICY "Users can create conversations they're part of" ON conversations FOR INSERT 
WITH CHECK (auth.uid() = student_id OR auth.uid() = tutor_id);
CREATE POLICY "Users can update conversations they're part of" ON conversations FOR UPDATE 
USING (auth.uid() = student_id OR auth.uid() = tutor_id);

-- Messages: users can read messages in their conversations
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT
USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id OR
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = messages.conversation_id AND (c.student_id = auth.uid() OR c.tutor_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE 
USING (auth.uid() = sender_id);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'name', 'New User'), coalesce(new.raw_user_meta_data->>'role', 'student'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_availability_updated_at BEFORE UPDATE ON availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

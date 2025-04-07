
import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vanarjtvxuveoxgnwhyw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbmFyanR2eHV2ZW94Z253aHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjIyMjQsImV4cCI6MjA1OTU5ODIyNH0.1qNxGfJBw7svHahD8dfCNt2ioVJdJS6csfgZUlgmCJ0'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

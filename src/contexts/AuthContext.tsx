
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setLoading(true);
      try {
        console.log("Initializing auth...");
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session ? "Session exists" : "No session");
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign in...");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log("Sign in successful");
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign up...");
      // Create auth user
      const { error: signUpError, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      console.log("Sign up successful");
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Attempting to sign out...");
      await supabase.auth.signOut();
      console.log("Sign out successful");
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

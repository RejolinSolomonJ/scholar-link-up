
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile } from '@/lib/api';
import { toast } from 'sonner';

const AuthRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      if (isAuthenticated && user) {
        try {
          console.log("Attempting to redirect authenticated user:", user.id);
          const profile = await getProfile(user.id);
          
          if (profile) {
            console.log("Profile found:", profile);
            // Redirect based on role
            if (profile.role === 'student') {
              navigate('/search');
              toast.success(`Welcome back, ${profile.name}!`);
            } else if (profile.role === 'tutor') {
              navigate('/dashboard');
              toast.success(`Welcome back, ${profile.name}!`);
            } else {
              // If role is invalid, redirect to profile page
              console.log("Invalid role, redirecting to profile page");
              navigate('/profile');
              toast.info('Please complete your profile');
            }
          } else {
            console.log("No profile found, redirecting to profile page");
            // If no profile exists, redirect to complete profile
            navigate('/profile');
            toast.info('Please complete your profile');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Default to dashboard on error rather than crashing
          navigate('/dashboard');
          toast.error('Something went wrong, but we redirected you to the dashboard');
        }
      } else if (!loading && !isAuthenticated) {
        // Redirect to login if not authenticated and not loading
        console.log("Not authenticated, redirecting to login");
        navigate('/login');
      }
    };

    if (!loading) {
      console.log("Auth state loaded, redirecting based on role");
      redirectBasedOnRole();
    }
  }, [isAuthenticated, loading, user, navigate]);

  return null;
};

export default AuthRedirect;

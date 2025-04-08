
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
          const profile = await getProfile(user.id);
          
          if (profile) {
            // Redirect based on role
            if (profile.role === 'student') {
              navigate('/search');
            } else {
              navigate('/dashboard');
            }
            toast.success(`Welcome back, ${profile.name}!`);
          } else {
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
        navigate('/login');
      }
    };

    if (!loading) {
      redirectBasedOnRole();
    }
  }, [isAuthenticated, loading, user, navigate]);

  return null;
};

export default AuthRedirect;

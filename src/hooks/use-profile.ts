
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/lib/api';
import type { Profile } from '@/types/database.types';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profileData = await getProfile(user.id);
        setProfile(profileData);
        setError(null);
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setError(err.message || 'Failed to load profile');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const updateUserProfile = async (data: Partial<Profile>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return null;
    }

    try {
      setLoading(true);
      const updatedProfile = await updateProfile(user.id, data);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Profile updated successfully');
        return updatedProfile;
      }
      return null;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast.error('Failed to update profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile: updateUserProfile
  };
};


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    newsletter: false,
    marketing: false
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "John Doe",
      email: user?.email || "",
      phone: ""
    }
  });

  // Fetch profile data when the component mounts
  const fetchProfileData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, phone')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        profileForm.reset({
          fullName: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      }
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updateProfile = async (data: ProfileFormData) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsLoading(true);
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.fullName,
          email: data.email,
          phone: data.phone
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Also update user preferences (would be in a separate table in a real app)
      // For now just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to update user preferences
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast.success("Preferences updated successfully!");
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profileForm,
    preferences,
    handlePreferencesChange,
    updateProfile,
    updatePreferences,
    isLoading,
    fetchProfileData
  };
}


import { useState, useEffect } from 'react';
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
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    newsletter: false,
    marketing: false
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      phone: ""
    }
  });

  // Fetch profile data when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, phone, image_url')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        profileForm.reset({
          fullName: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
        
        setAvatarUrl(data.image_url || null);
      }
      
      // Fetch user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('profiles')
        .select('newsletter, marketing')
        .eq('id', user.id)
        .single();
        
      if (!prefsError && prefsData) {
        setPreferences({
          newsletter: prefsData.newsletter || false,
          marketing: prefsData.marketing || false
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
      const { error } = await supabase
        .from('profiles')
        .update({
          newsletter: preferences.newsletter,
          marketing: preferences.marketing
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Preferences updated successfully!");
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };
  
  const uploadProfilePicture = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in to upload a profile picture");
      return;
    }
    
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Check if avatars bucket exists, if not create it (this is just a safeguard)
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('avatars');
        
      if (bucketError && bucketError.message.includes('does not exist')) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket('avatars', {
          public: true
        });
      }
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = data.publicUrl;
      
      // Update the profile with the new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ image_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setAvatarUrl(publicUrl);
      
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    profileForm,
    preferences,
    avatarUrl,
    isUploading,
    handlePreferencesChange,
    updateProfile,
    updatePreferences,
    uploadProfilePicture,
    isLoading,
    fetchProfileData
  };
}


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export function useProfilePicture() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    if (!user?.id) {
      toast.error("Vous devez être connecté pour télécharger une image");
      return null;
    }

    setIsUploading(true);
    try {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error("Veuillez sélectionner un fichier image");
        return null;
      }

      // Check if file is too large (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image est trop volumineuse (maximum 5 Mo)");
        return null;
      }

      // Create a unique file name using the user's ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update the user profile with the new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success("Photo de profil mise à jour");
      return publicUrl;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Erreur lors du téléchargement de l'image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfilePicture,
    isUploading
  };
}


import { useState, useEffect } from "react";
import { FileInput } from "@/components/ui/file-input";

interface ImageUploadProps {
  initialImageUrl?: string;
  onImageChange: (file: File | null, previewUrl: string) => void;
}

export function ImageUpload({ initialImageUrl, onImageChange }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string>(initialImageUrl || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      onImageChange(file, previewUrl);
    }
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== initialImageUrl) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, initialImageUrl]);

  return (
    <div className="space-y-2">
      <FileInput
        label="Upload Image"
        showPreview={true}
        accept=".jpg,.jpeg,.png"
        onChange={handleImageChange}
        previewUrl={imagePreview}
      />
      <p className="text-xs text-muted-foreground">
        Upload an image of the meeting point to help drivers and passengers identify it.
      </p>
    </div>
  );
}

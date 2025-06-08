
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, User, X } from 'lucide-react';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string | undefined) => void;
  disabled?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  currentPhoto, 
  onPhotoChange, 
  disabled = false 
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentPhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onPhotoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(undefined);
    onPhotoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Profile Photo</Label>
      
      <div className="flex items-center space-x-4">
        {/* Photo Preview */}
        <div className="w-20 h-20 rounded-full border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
          {preview ? (
            <img 
              src={preview} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={disabled}
            className="w-fit"
          >
            <Upload className="w-4 h-4 mr-2" />
            {preview ? 'Change Photo' : 'Upload Photo'}
          </Button>
          
          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemovePhoto}
              disabled={disabled}
              className="w-fit text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <p className="text-xs text-muted-foreground">
        Supported formats: JPG, PNG, GIF. Max size: 5MB
      </p>
    </div>
  );
};

export default PhotoUpload;

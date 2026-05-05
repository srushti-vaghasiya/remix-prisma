import React, { useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface FileUploadProps {
  currentImage?: string;
  onRemove?: () => void;
  className?: string;
  name?: string; // Add name prop for form field
}

export const FileUpload: React.FC<FileUploadProps> = ({
  currentImage,
  onRemove,
  className = '',
  name = 'profileImage',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(currentImage || null);

  // Update preview when currentImage prop changes (after profile update)
  React.useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Profile Image */}
          <div
            className={`
              w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'bg-gray-100'}
              transition-all duration-200 cursor-pointer
            `}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </>
            ) : (
              <>
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              </>
            )}
          </div>

          {/* Remove Button */}
          {preview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
          )}

          {/* Upload Overlay */}
          <div
            className="absolute inset-0 w-32 h-32 rounded-full bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center cursor-pointer"
            onClick={handleClick}
          >
            <Upload className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Click or drag to upload a profile picture
        </p>
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG, or WebP (max 5MB)
        </p>
      </div>
    </div>
  );
};

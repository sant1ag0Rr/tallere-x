import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onAddImage: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAddImage }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay and mock image URL return
    setTimeout(() => {
      const mockUrl = `https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400&auto=format&fit=crop&rnd=${Math.random()}`;
      onAddImage(mockUrl);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800 transition-all group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          ) : (
            <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-3" />
          )}
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-blue-600 dark:text-blue-500">Haz clic para subir</span> o arrastra y suelta
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG o GIF</p>
        </div>
      </button>
    </div>
  );
};

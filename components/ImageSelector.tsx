import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';
import LazyImage from './LazyImage';

interface ImageSelectorProps {
  defaultImages: string[];
  onImageSelect: (imageSrc: string) => void;
  selectedImage: string | null;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
};

const ImageSelector: React.FC<ImageSelectorProps> = ({ defaultImages, onImageSelect, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onImageSelect(base64);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("There was an error uploading the image. Please try again.");
      }
    }
  }, [onImageSelect]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-slate-200">1. Choose an Image</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {defaultImages.map((src, index) => (
          <div
            key={src}
            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-4 transition-all duration-200 ${selectedImage === src ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/30' : 'border-transparent hover:border-purple-400'}`}
            onClick={() => onImageSelect(src)}
          >
            <LazyImage 
              src={src} 
              alt={`Default puzzle ${index + 1}`} 
              className="w-full h-full"
              imageClassName="w-full h-full object-cover"
            />
          </div>
        ))}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
        <div
          onClick={handleUploadClick}
          className={`flex flex-col items-center justify-center bg-slate-700/50 rounded-lg cursor-pointer border-4 transition-all duration-200 aspect-square text-slate-400 hover:text-white hover:bg-slate-700 ${selectedImage && !defaultImages.includes(selectedImage) ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/30' : 'border-transparent hover:border-purple-400'}`}
        >
          <UploadIcon className="w-10 h-10 mb-2" />
          <span className="font-semibold text-sm">Upload Photo</span>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;
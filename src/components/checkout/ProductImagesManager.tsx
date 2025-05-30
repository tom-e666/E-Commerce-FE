"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload } from 'lucide-react';
import Image from 'next/image';

interface ProductImagesManagerProps {
  images: string[];
  setImages: (images: string[]) => void;
  productName: string;
  onImagesChange: (images: string[]) => void;
}

export default function ProductImagesManager({ 
  images, 
  setImages, 
  productName, 
  onImagesChange 
}: ProductImagesManagerProps) {
  const [imageUrl, setImageUrl] = useState("");

  const addImage = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      const newImages = [...images, imageUrl];
      setImages(newImages);
      onImagesChange(newImages);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Nhập URL hình ảnh"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button type="button" onClick={addImage}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square relative border rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`${productName} - ${index + 1}`}
                fill
                className="object-cover"
                onError={() => removeImage(index)}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {images.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Chưa có hình ảnh nào</p>
        </div>
      )}
    </div>
  );
}

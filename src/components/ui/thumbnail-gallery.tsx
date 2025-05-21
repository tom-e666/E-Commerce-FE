"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ThumbnailGalleryProps {
  images: string[];
  currentIndex: number;
  onSelect: (index: number) => void;
  productName: string;
  className?: string;
}

export function ThumbnailGallery({
  images,
  currentIndex,
  onSelect,
  productName,
  className,
}: ThumbnailGalleryProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5; // Number of thumbnails visible at once

  // If no images or only one image, return null
  if (!images.length || images.length === 1) return null;

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(images.length - visibleCount, prev + 1));
  };

  // Calculate visible images based on screen size and startIndex
  const visibleImages = images.slice(
    startIndex,
    Math.min(startIndex + visibleCount, images.length)
  );

  const showLeftArrow = startIndex > 0;
  const showRightArrow = startIndex + visibleCount < images.length;

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-center">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
            onClick={handlePrevious}
            aria-label="Previous thumbnails"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div className="flex gap-2 overflow-hidden px-8">
          <AnimatePresence initial={false}>
            {visibleImages.map((img, idx) => {
              const actualIndex = startIndex + idx;
              return (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "aspect-square relative rounded-md overflow-hidden border cursor-pointer w-16 h-16 flex-shrink-0",
                    currentIndex === actualIndex
                      ? "ring-2 ring-primary border-primary"
                      : "hover:ring-1 hover:ring-primary/50"
                  )}
                  onClick={() => onSelect(actualIndex)}
                >
                  <Image
                    src={img}
                    alt={`${productName} - thumbnail ${actualIndex + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                    loading={idx < 2 ? "eager" : "lazy"}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
            onClick={handleNext}
            aria-label="Next thumbnails"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

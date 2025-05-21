"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ImageSliderProps {
  images: string[];
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number; // in milliseconds
  showArrows?: boolean;
  showDots?: boolean;
  productName: string;
}

export function ImageSlider({
  images,
  className,
  aspectRatio = "square",
  loop = true,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  productName,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Handle auto play
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, currentIndex, interval, isPaused, images.length]);

  // Handle navigation
  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return loop ? images.length - 1 : 0;
      }
      return prevIndex - 1;
    });
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => {
      if (prevIndex === images.length - 1) {
        return loop ? 0 : images.length - 1;
      }
      return prevIndex + 1;
    });
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Variants for animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  // Get aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
  }[aspectRatio];

  // If no images, return null
  if (!images.length) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        aspectRatioClass,
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`${productName} - image ${currentIndex + 1}`}
            fill
            className="object-contain p-4 bg-white"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>

      {showArrows && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-white transition-all",
                currentIndex === index ? "w-3 opacity-100" : "opacity-50"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

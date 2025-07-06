
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    onError?.();
  };

  if (hasError && !fallbackSrc) {
    return (
      <div className={cn("bg-gray-200 flex items-center justify-center", className)}>
        <span className="text-gray-400 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className={cn(
          "absolute inset-0 bg-gray-100 animate-pulse rounded",
          className
        )} />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;

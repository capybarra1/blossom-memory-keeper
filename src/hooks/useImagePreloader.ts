
import { useState, useEffect } from 'react';

export const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    const preloadImage = (src: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    };

    const preloadAllImages = async () => {
      try {
        const promises = imageUrls.map(url => preloadImage(url));
        const loaded = await Promise.allSettled(promises);
        
        const successfullyLoaded = new Set<string>();
        loaded.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfullyLoaded.add(imageUrls[index]);
          }
        });
        
        setLoadedImages(successfullyLoaded);
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsLoading(false);
      }
    };

    preloadAllImages();
  }, [imageUrls]);

  return { loadedImages, isLoading };
};

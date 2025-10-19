import { useCallback, useMemo, useRef, useEffect, useLayoutEffect, useState } from 'react';

// Debounce hook for search and API calls
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized API call hook
export const useMemoizedApiCall = (apiFunction, dependencies = []) => {
  const cacheRef = useRef(new Map());
  const promiseRef = useRef(new Map());

  return useCallback(async (...args) => {
    const cacheKey = JSON.stringify(args);
    
    // Return cached result if available
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }

    // Return in-flight promise if available
    if (promiseRef.current.has(cacheKey)) {
      return promiseRef.current.get(cacheKey);
    }

    const promise = apiFunction(...args)
      .then(result => {
        cacheRef.current.set(cacheKey, result);
        promiseRef.current.delete(cacheKey);
        return result;
      })
      .catch(error => {
        promiseRef.current.delete(cacheKey);
        throw error;
      });

    promiseRef.current.set(cacheKey, promise);
    return promise;
  }, dependencies);
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

// Image preloading hook
export const useImagePreload = (imageUrls) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const loadingImagesRef = useRef(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageUrls.map(url => {
        if (loadedImages.has(url) || loadingImagesRef.current.has(url)) {
          return Promise.resolve();
        }
        
        loadingImagesRef.current.add(url);
        
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            if (mountedRef.current) {
              setLoadedImages(prev => new Set([...prev, url]));
              loadingImagesRef.current.delete(url);
            }
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    if (imageUrls.length > 0) {
      preloadImages();
    }
  }, [imageUrls]);

  return { loadedImages, loadingImages: Array.from(loadingImagesRef.current) };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  const renderStart = useRef(performance.now());
  const renderCount = useRef(0);

  // Capture start timestamp at the beginning of render
  renderStart.current = performance.now();

  useLayoutEffect(() => {
    // Capture render end timestamp
    const renderEnd = performance.now();
    
    // Compute render duration
    const renderTime = renderEnd - renderStart.current;
    
    // Increment render count
    renderCount.current += 1;
    
    // Log warning if render took too long
    if (renderTime > 16) { // More than one frame (16ms)
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
    }
    
    // Update start timestamp for next render
    renderStart.current = performance.now();
  });

  return { renderCount: renderCount.current };
};

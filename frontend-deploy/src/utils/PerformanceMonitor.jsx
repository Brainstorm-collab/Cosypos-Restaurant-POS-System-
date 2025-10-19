import { useEffect, useRef } from 'react';

// Performance monitoring component
export const PerformanceMonitor = ({ componentName, children }) => {
  const renderCount = useRef(0);
  const renderStart = useRef();

  // Capture render start time before React starts rendering
  renderStart.current = performance.now();
  renderCount.current += 1;

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    
    // Log slow renders (more than 16ms = one frame)
    if (renderTime > 16) {
      console.warn(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
    } else if (renderTime > 100) {
      console.error(`🚨 Very slow render: ${componentName} took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
    }  });

  return children;
};

// Web Vitals monitoring
export const WebVitalsMonitor = () => {
  useEffect(() => {
    // Check if PerformanceObserver is supported
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('PerformanceObserver not supported in this browser');
      return;
    }

    // Check supported entry types
    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];
    const desiredTypes = ['largest-contentful-paint', 'first-input', 'layout-shift'];
    const availableTypes = desiredTypes.filter(type => supportedEntryTypes.includes(type));

    if (availableTypes.length === 0) {
      console.warn('No supported entry types for Web Vitals monitoring');
      return;
    }

    let observer;
    try {
      // Monitor Core Web Vitals
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('🎨 LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            console.log('⚡ FID:', entry.processingStart - entry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            if (!entry.hadRecentInput) {
              console.log('📐 CLS:', entry.value);
            }
          }
        }
      });

      observer.observe({ entryTypes: availableTypes });
    } catch (error) {
      console.warn('Failed to initialize PerformanceObserver:', error);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return null;
};

// Memory usage monitoring (Chromium-only)
export const MemoryMonitor = ({ 
  enabled = process.env.NODE_ENV === 'development',
  interval = 30000 
} = {}) => {
  useEffect(() => {
    // Feature detection for performance.memory (Chromium-only)
    if (!performance.memory) {
      console.warn('performance.memory API not available (Chromium-only feature)');
      return;
    }

    if (!enabled) {
      return;
    }

    const logMemoryUsage = () => {
      const memory = performance.memory;
      const used = Math.round(memory.usedJSHeapSize / 1048576);
      const total = Math.round(memory.totalJSHeapSize / 1048576);
      const limit = Math.round(memory.jsHeapSizeLimit / 1048576);
      
      console.log(`🧠 Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`);
      
      // Warn if memory usage is high
      if (used / limit > 0.8) {
        console.warn('⚠️ High memory usage detected!');
      }
    };

    // Log memory usage at specified interval
    const intervalId = setInterval(logMemoryUsage, interval);
    
    // Initial log
    logMemoryUsage();

    return () => clearInterval(intervalId);
  }, [enabled, interval]);

  return null;
};

// Bundle size monitoring
export const BundleSizeMonitor = () => {
  useEffect(() => {
    // Check if PerformanceObserver is supported
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('PerformanceObserver not supported in this browser');
      return;
    }

    // Check if resource entry type is supported
    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];
    if (!supportedEntryTypes.includes('resource')) {
      console.warn('Resource entry type not supported for bundle monitoring');
      return;
    }

    let observer;
    try {
      // Process existing resources before starting observer
      const existingResources = performance.getEntriesByType('resource');
      for (const entry of existingResources) {
        const loadTime = entry.responseEnd - entry.startTime;
        const size = entry.transferSize;
        
        // Log slow resources
        if (loadTime > 1000) {
          const sizeKB = size ? Math.round(size/1024) : 'unknown';
          console.warn(`🐌 Slow resource: ${entry.name} took ${loadTime.toFixed(2)}ms (${sizeKB}KB)`);
        }
        
        // Log large resources
        if (size && size > 500000) { // 500KB
          console.warn(`📦 Large resource: ${entry.name} is ${Math.round(size/1024)}KB`);
        }
      }

      // Monitor resource loading times
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const loadTime = entry.responseEnd - entry.startTime;
            const size = entry.transferSize;
            
            // Log slow resources
            if (loadTime > 1000) {
              const sizeKB = size ? Math.round(size/1024) : 'unknown';
              console.warn(`🐌 Slow resource: ${entry.name} took ${loadTime.toFixed(2)}ms (${sizeKB}KB)`);
            }
            
            // Log large resources
            if (size && size > 500000) { // 500KB
              console.warn(`📦 Large resource: ${entry.name} is ${Math.round(size/1024)}KB`);
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('BundleSizeMonitor: Performance monitoring not supported', error);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return null;
};
// Combined performance monitor
export const PerformanceDashboard = () => {
  return (
    <>
      <WebVitalsMonitor />
      <MemoryMonitor />
      <BundleSizeMonitor />
    </>
  );
};

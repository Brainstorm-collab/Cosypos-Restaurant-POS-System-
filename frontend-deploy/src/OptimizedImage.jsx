import React, { useState, useCallback } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  fallback = '/placeholder-food.jpg',
  loading = 'lazy',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    // Only set fallback if current src is not already the fallback
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  }, [fallback, imageSrc]);

  return (
    <div style={{ position: 'relative', ...style }} className={className}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#3D4142',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#777979',
          fontSize: '12px'
        }}>
          Loading...
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;

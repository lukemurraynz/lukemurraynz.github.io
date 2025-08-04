import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  loading = 'lazy',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Generate WebP and AVIF sources if the original is not already modern
  const getModernSources = (originalSrc) => {
    if (!originalSrc || originalSrc.includes('.webp') || originalSrc.includes('.avif')) {
      return [];
    }

    const basePath = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    return [
      { srcSet: `${basePath}.avif`, type: 'image/avif' },
      { srcSet: `${basePath}.webp`, type: 'image/webp' }
    ];
  };

  const modernSources = getModernSources(src);

  // If we have modern format alternatives, use picture element
  if (modernSources.length > 0) {
    return (
      <picture className={className}>
        {modernSources.map((source, index) => (
          <source 
            key={index} 
            srcSet={source.srcSet} 
            type={source.type}
          />
        ))}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          {...props}
        />
      </picture>
    );
  }

  // Fallback to regular img element for modern formats or when no alternatives exist
  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      className={`${className} ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      {...props}
    />
  );
};

export default OptimizedImage;
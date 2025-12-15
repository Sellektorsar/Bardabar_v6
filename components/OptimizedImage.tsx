"use client";

import { useState, useCallback } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  placeholder?: string;
  onError?: () => void;
}

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTIwSDI0MFYxODBIMTYwVjEyMFoiIGZpbGw9IiNkMWQ1ZGIiLz4KPGNpcmNsZSBjeD0iMjgwIiBjeT0iMTAwIiByPSIyMCIgZmlsbD0iI2QxZDVkYiIvPgo8L3N2Zz4K";

/**
 * Optimized image component with:
 * - Lazy loading by default
 * - Placeholder while loading
 * - Error fallback
 * - Smooth fade-in transition
 */
export function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  placeholder = DEFAULT_PLACEHOLDER,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const imageSrc = hasError ? placeholder : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder shown while loading */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 960, 1280]
): string {
  // For external URLs (like Unsplash), append width parameter
  if (baseUrl.includes("unsplash.com")) {
    return widths
      .map((w) => {
        const url = baseUrl.includes("?")
          ? `${baseUrl}&w=${w}`
          : `${baseUrl}?w=${w}`;
        return `${url} ${w}w`;
      })
      .join(", ");
  }

  // For local images, assume naming convention: image.jpg -> image-320.jpg
  const ext = baseUrl.split(".").pop();
  const baseName = baseUrl.replace(`.${ext}`, "");

  return widths.map((w) => `${baseName}-${w}.${ext} ${w}w`).join(", ");
}

/**
 * Get optimized image URL (for services that support it)
 */
export function getOptimizedUrl(
  url: string,
  options: { width?: number; quality?: number; format?: "webp" | "avif" | "auto" } = {}
): string {
  const { width, quality = 80, format = "auto" } = options;

  // Unsplash optimization
  if (url.includes("unsplash.com")) {
    const params = new URLSearchParams();
    if (width) params.set("w", width.toString());
    params.set("q", quality.toString());
    if (format !== "auto") params.set("fm", format);
    params.set("auto", "format");

    return url.includes("?")
      ? `${url}&${params.toString()}`
      : `${url}?${params.toString()}`;
  }

  return url;
}

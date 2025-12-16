import React, { useState } from "react";

// Placeholder SVG для ошибки загрузки
const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

// Альтернативные источники изображений (fallback если Unsplash недоступен)
const FALLBACK_SOURCES: Record<string, string> = {
  // Интерьер ресторана
  "photo-1517248135467": "https://picsum.photos/seed/restaurant1/800/600",
  "photo-1554118811": "https://picsum.photos/seed/restaurant2/800/600",
  "photo-1559329007": "https://picsum.photos/seed/restaurant3/800/600",
  // Еда
  "photo-1414235077428": "https://picsum.photos/seed/food1/800/600",
  "photo-1578474846511": "https://picsum.photos/seed/food2/800/600",
  "photo-1546833999": "https://picsum.photos/seed/food3/800/600",
};

// Получить fallback URL для изображения
function getFallbackUrl(originalUrl: string): string | null {
  for (const [key, fallback] of Object.entries(FALLBACK_SOURCES)) {
    if (originalUrl.includes(key)) {
      return fallback;
    }
  }
  // Общий fallback для любого Unsplash изображения
  if (originalUrl.includes("unsplash.com")) {
    const seed = originalUrl.split("/").pop()?.split("?")[0] || "default";
    return `https://picsum.photos/seed/${seed}/800/600`;
  }
  return null;
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [currentSrc, setCurrentSrc] = useState(props.src);
  const [triedFallback, setTriedFallback] = useState(false);
  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    // Если ещё не пробовали fallback, попробуем
    if (!triedFallback && props.src) {
      const fallback = getFallbackUrl(props.src);
      if (fallback) {
        setCurrentSrc(fallback);
        setTriedFallback(true);
        setIsLoading(true);
        return;
      }
    }
    // Если fallback тоже не сработал — показываем placeholder
    setDidError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const { src, alt, style, className, ...rest } = props;

  if (didError) {
    return (
      <div
        className={`inline-block bg-muted text-center align-middle ${className ?? ""}`}
        style={style}
      >
        <div className="flex h-full w-full items-center justify-center">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`h-full w-full object-cover ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        {...rest}
      />
    </div>
  );
}

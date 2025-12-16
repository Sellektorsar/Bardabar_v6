"use client";

import { Calendar, Camera, ChevronLeft, ChevronRight, Users, Utensils } from "lucide-react";
import { useState } from "react";

import type { GalleryImage } from "../src/types";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev: number) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev: number) => (prev - 1 + images.length) % images.length);
  };

  const categories = [
    { category: "interior", title: "Интерьер", icon: Camera },
    { category: "food", title: "Блюда", icon: Utensils },
    { category: "events", title: "Мероприятия", icon: Calendar },
    { category: "team", title: "Команда", icon: Users },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="gradient-text-animated mb-4 text-4xl font-bold">Галерея</h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Окунитесь в атмосферу нашего ресторана
        </p>
      </div>

      {/* Main Gallery Image */}
      <div className="relative mb-8">
        <div className="relative h-96 overflow-hidden rounded-2xl md:h-[500px]">
          <ImageWithFallback
            src={images[currentIndex]?.url || ""}
            alt={images[currentIndex]?.alt || ""}
            className="h-full w-full object-cover"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/80 p-2 text-foreground hover:bg-white"
            aria-label="Предыдущее изображение"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/80 p-2 text-foreground hover:bg-white"
            aria-label="Следующее изображение"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-20 overflow-hidden rounded-lg transition-all duration-200 md:h-24 ${
              index === currentIndex
                ? "scale-105 ring-2 ring-amber-400"
                : "opacity-70 hover:scale-105 hover:opacity-100"
            }`}
          >
            <ImageWithFallback
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Gallery Categories */}
      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {categories.map(({ category, title, icon: Icon }) => (
          <Card key={category} className="loft-card p-6 text-center">
            <Icon className="mx-auto mb-3 h-8 w-8 text-amber-400" />
            <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {images.filter((img) => img.category === category).length} фото
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

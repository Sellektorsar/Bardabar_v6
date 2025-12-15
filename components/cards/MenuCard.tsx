"use client";

import React, { memo } from "react";

import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface MenuCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  allergens?: string[];
  isSpecial?: boolean;
}

/**
 * Мемоизированная карточка меню для оптимизации рендеринга
 */
export const MenuCard = memo(function MenuCard({
  name,
  description,
  price,
  image,
  allergens = [],
  isSpecial = false,
}: MenuCardProps) {
  return (
    <Card className="hover-lift group relative overflow-hidden border-orange-100 transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={image}
            alt={name}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {isSpecial && (
            <Badge className="absolute right-2 top-2 animate-pulse bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
              ⭐ Хит
            </Badge>
          )}
          
          {/* Price badge on hover */}
          <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-3 py-1 text-lg font-bold text-orange-600 shadow-lg backdrop-blur-sm">
              {price}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <CardTitle className="text-lg text-foreground transition-colors group-hover:text-orange-600">{name}</CardTitle>
          <span className="text-lg font-bold text-orange-600 transition-transform group-hover:scale-110">{price}</span>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

        {allergens.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-xs text-muted-foreground">Аллергены:</p>
            <div className="flex flex-wrap gap-1">
              {allergens.map((allergen, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-red-200 text-xs text-red-600 transition-colors hover:bg-red-50"
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Decorative corner */}
      <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-gradient-to-br from-orange-500/10 to-red-500/10 transition-all duration-300 group-hover:scale-150" />
    </Card>
  );
});

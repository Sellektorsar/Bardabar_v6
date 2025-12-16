"use client";

import { memo } from "react";

import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface MenuCardProps {
  name: string;
  description: string;
  price: string;
  weight?: string;
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
  weight,
  image,
  allergens = [],
  isSpecial = false,
}: MenuCardProps) {
  return (
    <Card className="loft-card group relative overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-amber-500/10">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={image}
            alt={name}
            className="h-48 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Warm gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
          
          {isSpecial && (
            <Badge className="absolute right-2 top-2 bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg transition-transform duration-300 hover:scale-110">
              ⭐ Хит
            </Badge>
          )}
          
          {/* Price badge on hover - visible on image */}
          <div className="absolute bottom-3 left-3 translate-y-6 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full bg-card/95 px-4 py-2 font-bold text-amber-400 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-card">
              <span className="text-lg">{price}</span>
              {weight && <span className="ml-2 text-xs text-muted-foreground">• {weight}</span>}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <CardTitle className="text-lg text-foreground transition-colors duration-300 ease-out group-hover:text-amber-400">{name}</CardTitle>
          <div className="text-right transition-transform duration-300 ease-out group-hover:scale-105">
            <span className="text-lg font-bold text-amber-400">{price}</span>
            {weight && <div className="text-xs text-muted-foreground transition-opacity duration-300">{weight}</div>}
          </div>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground transition-colors duration-300">{description}</p>

        {allergens.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-xs text-muted-foreground">Аллергены:</p>
            <div className="flex flex-wrap gap-1">
              {allergens.map((allergen, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-red-500/30 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Decorative corner - contained within card */}
      <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 overflow-hidden">
        <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-gradient-to-br from-amber-500/10 to-red-600/10 transition-all duration-500 ease-out group-hover:scale-150 group-hover:from-amber-500/20 group-hover:to-red-600/20" />
      </div>
    </Card>
  );
});

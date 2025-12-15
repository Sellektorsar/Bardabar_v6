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
    <Card className="group border-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={image}
            alt={name}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isSpecial && (
            <Badge className="absolute right-2 top-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Хит
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <CardTitle className="text-lg text-foreground">{name}</CardTitle>
          <span className="text-lg font-bold text-orange-600">{price}</span>
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
                  className="border-red-200 text-xs text-red-600"
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

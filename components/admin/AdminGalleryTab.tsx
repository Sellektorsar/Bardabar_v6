"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import type React from "react";

import type { GalleryImage } from "../../src/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type GalleryCategory = "interior" | "food" | "events" | "team";

interface AdminGalleryTabProps {
  galleryImages: GalleryImage[];
  newGalleryImage: Omit<GalleryImage, "id">;
  editingGalleryImage: GalleryImage | null;
  onNewGalleryImageChange: (image: Omit<GalleryImage, "id">) => void;
  onEditingGalleryImageChange: (image: GalleryImage | null) => void;
  onAddGalleryImage: () => void;
  onUpdateGalleryImage: () => void;
  onDeleteGalleryImage: (id: number) => void;
}

const categoryLabels: Record<GalleryCategory, string> = {
  interior: "Интерьер",
  food: "Блюда",
  events: "Мероприятия",
  team: "Команда",
};

export function AdminGalleryTab({
  galleryImages,
  newGalleryImage,
  editingGalleryImage,
  onNewGalleryImageChange,
  onEditingGalleryImageChange,
  onAddGalleryImage,
  onUpdateGalleryImage,
  onDeleteGalleryImage,
}: AdminGalleryTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Добавить изображение
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>URL изображения</Label>
              <Input
                value={newGalleryImage.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNewGalleryImageChange({ ...newGalleryImage, url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label>Категория</Label>
              <Select
                value={newGalleryImage.category}
                onValueChange={(value: GalleryCategory) =>
                  onNewGalleryImageChange({ ...newGalleryImage, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interior">Интерьер</SelectItem>
                  <SelectItem value="food">Блюда</SelectItem>
                  <SelectItem value="events">Мероприятия</SelectItem>
                  <SelectItem value="team">Команда</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Описание</Label>
            <Input
              value={newGalleryImage.alt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onNewGalleryImageChange({ ...newGalleryImage, alt: e.target.value })
              }
              placeholder="Краткое описание изображения"
            />
          </div>
          <Button onClick={onAddGalleryImage} className="w-full">
            Добавить изображение
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Галерея изображений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-32 w-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditingGalleryImageChange(image)}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteGalleryImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">{image.alt}</p>
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabels[image.category as GalleryCategory]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingGalleryImage && (
        <Card>
          <CardHeader>
            <CardTitle>Редактировать изображение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>URL изображения</Label>
                <Input
                  value={editingGalleryImage.url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditingGalleryImageChange({
                      ...editingGalleryImage,
                      url: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Категория</Label>
                <Select
                  value={editingGalleryImage.category}
                  onValueChange={(value: GalleryCategory) =>
                    onEditingGalleryImageChange({
                      ...editingGalleryImage,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interior">Интерьер</SelectItem>
                    <SelectItem value="food">Блюда</SelectItem>
                    <SelectItem value="events">Мероприятия</SelectItem>
                    <SelectItem value="team">Команда</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Описание</Label>
              <Input
                value={editingGalleryImage.alt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onEditingGalleryImageChange({
                    ...editingGalleryImage,
                    alt: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onUpdateGalleryImage}>Сохранить изменения</Button>
              <Button variant="outline" onClick={() => onEditingGalleryImageChange(null)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

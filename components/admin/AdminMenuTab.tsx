"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import type React from "react";

import type { MenuItem } from "../../src/types";
import { menuCategories } from "../../src/data/navigation";
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
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

interface AdminMenuTabProps {
  menuItems: MenuItem[];
  newMenuItem: Omit<MenuItem, "id">;
  editingMenuItem: MenuItem | null;
  onNewMenuItemChange: (item: Omit<MenuItem, "id">) => void;
  onEditingMenuItemChange: (item: MenuItem | null) => void;
  onAddMenuItem: () => void;
  onUpdateMenuItem: () => void;
  onDeleteMenuItem: (id: number) => void;
}

export function AdminMenuTab({
  menuItems,
  newMenuItem,
  editingMenuItem,
  onNewMenuItemChange,
  onEditingMenuItemChange,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
}: AdminMenuTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Добавить блюдо
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>Название</Label>
              <Input
                value={newMenuItem.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNewMenuItemChange({ ...newMenuItem, name: e.target.value })
                }
                placeholder="Название блюда"
              />
            </div>
            <div>
              <Label>Цена (без символа ₽)</Label>
              <Input
                value={newMenuItem.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNewMenuItemChange({ ...newMenuItem, price: e.target.value })
                }
                placeholder="1000"
                type="number"
              />
            </div>
            <div>
              <Label>Категория</Label>
              <Select
                value={newMenuItem.category}
                onValueChange={(value: string) =>
                  onNewMenuItemChange({ ...newMenuItem, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {menuCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Калории</Label>
              <Input
                value={newMenuItem.calories?.toString() || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNewMenuItemChange({
                    ...newMenuItem,
                    calories: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="350"
                type="number"
              />
            </div>
            <div>
              <Label>Аллергены (через запятую)</Label>
              <Input
                value={newMenuItem.allergens?.join(", ") || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNewMenuItemChange({
                    ...newMenuItem,
                    allergens: e.target.value.split(", ").filter(Boolean),
                  })
                }
                placeholder="глютен, молочные продукты"
              />
            </div>
          </div>
          <div>
            <Label>URL изображения</Label>
            <Input
              value={newMenuItem.image}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onNewMenuItemChange({ ...newMenuItem, image: e.target.value })
              }
              placeholder="https://example.com/dish.jpg"
            />
          </div>
          <div>
            <Label>Описание</Label>
            <Textarea
              value={newMenuItem.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onNewMenuItemChange({ ...newMenuItem, description: e.target.value })
              }
              placeholder="Описание блюда"
              rows={3}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="special"
                checked={newMenuItem.isSpecial}
                onCheckedChange={(checked: boolean) =>
                  onNewMenuItemChange({ ...newMenuItem, isSpecial: checked })
                }
              />
              <Label htmlFor="special">Специальное предложение</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="vegetarian"
                checked={newMenuItem.isVegetarian}
                onCheckedChange={(checked: boolean) =>
                  onNewMenuItemChange({ ...newMenuItem, isVegetarian: checked })
                }
              />
              <Label htmlFor="vegetarian">Вегетарианское</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="vegan"
                checked={newMenuItem.isVegan}
                onCheckedChange={(checked: boolean) =>
                  onNewMenuItemChange({ ...newMenuItem, isVegan: checked })
                }
              />
              <Label htmlFor="vegan">Веганское</Label>
            </div>
          </div>
          <Button onClick={onAddMenuItem} className="w-full">
            Добавить блюдо
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список блюд</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "https://via.placeholder.com/60"}
                  alt={item.name}
                  className="h-12 w-12 rounded object-cover"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant="outline">{item.price} ₽</Badge>
                    {item.isSpecial && <Badge>Хит</Badge>}
                    {item.isVegetarian && (
                      <Badge className="bg-green-100 text-green-700">🌱</Badge>
                    )}
                    {item.isVegan && (
                      <Badge className="bg-green-200 text-green-800">🌿</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditingMenuItemChange(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteMenuItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingMenuItem && (
        <Card>
          <CardHeader>
            <CardTitle>Редактировать блюдо</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>Название</Label>
                <Input
                  value={editingMenuItem.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditingMenuItemChange({ ...editingMenuItem, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Цена</Label>
                <Input
                  value={editingMenuItem.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditingMenuItemChange({ ...editingMenuItem, price: e.target.value })
                  }
                  type="number"
                />
              </div>
              <div>
                <Label>Категория</Label>
                <Select
                  value={editingMenuItem.category}
                  onValueChange={(value: string) =>
                    onEditingMenuItemChange({ ...editingMenuItem, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {menuCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Калории</Label>
                <Input
                  value={editingMenuItem.calories?.toString() || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditingMenuItemChange({
                      ...editingMenuItem,
                      calories: parseInt(e.target.value) || 0,
                    })
                  }
                  type="number"
                />
              </div>
              <div>
                <Label>Аллергены (через запятую)</Label>
                <Input
                  value={editingMenuItem.allergens?.join(", ") || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditingMenuItemChange({
                      ...editingMenuItem,
                      allergens: e.target.value.split(", ").filter(Boolean),
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>URL изображения</Label>
              <Input
                value={editingMenuItem.image}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onEditingMenuItemChange({ ...editingMenuItem, image: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea
                value={editingMenuItem.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onEditingMenuItemChange({
                    ...editingMenuItem,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="special-edit"
                  checked={editingMenuItem.isSpecial}
                  onCheckedChange={(checked: boolean) =>
                    onEditingMenuItemChange({ ...editingMenuItem, isSpecial: checked })
                  }
                />
                <Label htmlFor="special-edit">Специальное предложение</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="vegetarian-edit"
                  checked={editingMenuItem.isVegetarian}
                  onCheckedChange={(checked: boolean) =>
                    onEditingMenuItemChange({ ...editingMenuItem, isVegetarian: checked })
                  }
                />
                <Label htmlFor="vegetarian-edit">Вегетарианское</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="vegan-edit"
                  checked={editingMenuItem.isVegan}
                  onCheckedChange={(checked: boolean) =>
                    onEditingMenuItemChange({ ...editingMenuItem, isVegan: checked })
                  }
                />
                <Label htmlFor="vegan-edit">Веганское</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onUpdateMenuItem}>Сохранить изменения</Button>
              <Button variant="outline" onClick={() => onEditingMenuItemChange(null)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

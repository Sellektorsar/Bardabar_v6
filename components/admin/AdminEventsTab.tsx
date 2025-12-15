"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import type React from "react";

import type { Event } from "../../src/types";
import { eventTypes } from "../../src/data/navigation";
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

interface AdminEventsTabProps {
  events: Event[];
  newEvent: Omit<Event, "id">;
  editingEvent: Event | null;
  onNewEventChange: (event: Omit<Event, "id">) => void;
  onEditingEventChange: (event: Event | null) => void;
  onAddEvent: () => void;
  onUpdateEvent: () => void;
  onDeleteEvent: (id: number) => void;
}

export function AdminEventsTab({
  events,
  newEvent,
  editingEvent,
  onNewEventChange,
  onEditingEventChange,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: AdminEventsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Добавить мероприятие
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Название</Label>
              <Input
                value={newEvent.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNewEventChange({ ...newEvent, title: e.target.value })
                }
                placeholder="Название мероприятия"
              />
            </div>
            <div>
              <Label>Тип</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value: string) =>
                  onNewEventChange({ ...newEvent, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Дата</Label>
              <Input
                value={newEvent.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNewEventChange({ ...newEvent, date: e.target.value })
                }
                type="date"
              />
            </div>
            <div>
              <Label>Время</Label>
              <Input
                value={newEvent.time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNewEventChange({ ...newEvent, time: e.target.value })
                }
                type="time"
              />
            </div>
          </div>
          <div>
            <Label>URL изображения</Label>
            <Input
              value={newEvent.image}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onNewEventChange({ ...newEvent, image: e.target.value })
              }
              placeholder="https://example.com/event.jpg"
            />
          </div>
          <div>
            <Label>Описание</Label>
            <Textarea
              value={newEvent.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onNewEventChange({ ...newEvent, description: e.target.value })
              }
              placeholder="Описание мероприятия"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="free-event"
                checked={newEvent.isFree}
                onCheckedChange={(checked: boolean) =>
                  onNewEventChange({
                    ...newEvent,
                    isFree: checked,
                    price: checked ? "Бесплатно" : "",
                  })
                }
              />
              <Label htmlFor="free-event">Бесплатное мероприятие</Label>
            </div>
            {!newEvent.isFree && (
              <div>
                <Label>Цена</Label>
                <Input
                  value={newEvent.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onNewEventChange({ ...newEvent, price: e.target.value })
                  }
                  placeholder="1000"
                  type="number"
                />
              </div>
            )}
          </div>
          <Button onClick={onAddEvent} className="w-full">
            Добавить мероприятие
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список мероприятий</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={event.image || "https://via.placeholder.com/60"}
                  alt={event.title}
                  className="h-12 w-12 rounded object-cover"
                />
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{event.type}</Badge>
                    <Badge variant="outline">
                      {event.date} {event.time}
                    </Badge>
                    {event.isFree && (
                      <Badge className="bg-green-100 text-green-700">Бесплатно</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditingEventChange(event)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteEvent(event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Редактировать мероприятие</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Название</Label>
                <Input
                  value={editingEvent.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditingEventChange({ ...editingEvent, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Тип</Label>
                <Select
                  value={editingEvent.type}
                  onValueChange={(value: string) =>
                    onEditingEventChange({ ...editingEvent, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Дата</Label>
                <Input
                  value={editingEvent.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditingEventChange({ ...editingEvent, date: e.target.value })
                  }
                  type="date"
                />
              </div>
              <div>
                <Label>Время</Label>
                <Input
                  value={editingEvent.time}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onEditingEventChange({ ...editingEvent, time: e.target.value })
                  }
                  type="time"
                />
              </div>
            </div>
            <div>
              <Label>URL изображения</Label>
              <Input
                value={editingEvent.image}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onEditingEventChange({ ...editingEvent, image: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea
                value={editingEvent.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onEditingEventChange({ ...editingEvent, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="free-event-edit"
                  checked={editingEvent.isFree}
                  onCheckedChange={(checked: boolean) =>
                    onEditingEventChange({
                      ...editingEvent,
                      isFree: checked,
                      price: checked ? "Бесплатно" : "",
                    })
                  }
                />
                <Label htmlFor="free-event-edit">Бесплатное мероприятие</Label>
              </div>
              {!editingEvent.isFree && (
                <div>
                  <Label>Цена</Label>
                  <Input
                    value={editingEvent.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onEditingEventChange({ ...editingEvent, price: e.target.value })
                    }
                    type="number"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={onUpdateEvent}>Сохранить изменения</Button>
              <Button variant="outline" onClick={() => onEditingEventChange(null)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

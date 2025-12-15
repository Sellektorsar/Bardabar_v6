"use client";

import { Save, Settings } from "lucide-react";
import type React from "react";

import type { SiteSettings } from "../../src/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

interface AdminSettingsTabProps {
  siteSettings: SiteSettings;
  onSiteSettingsChange: (settings: SiteSettings) => void;
  onSaveSiteSettings: () => void;
}

export function AdminSettingsTab({
  siteSettings,
  onSiteSettingsChange,
  onSaveSiteSettings,
}: AdminSettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Общие настройки сайта
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>Название кафе</Label>
            <Input
              value={siteSettings.cafeName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSiteSettingsChange({ ...siteSettings, cafeName: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Телефон</Label>
            <Input
              value={siteSettings.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSiteSettingsChange({ ...siteSettings, phone: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>Email</Label>
            <Input
              value={siteSettings.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSiteSettingsChange({ ...siteSettings, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Адрес</Label>
            <Input
              value={siteSettings.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSiteSettingsChange({ ...siteSettings, address: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label>Режим работы</Label>
          <Textarea
            value={siteSettings.workingHours}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onSiteSettingsChange({ ...siteSettings, workingHours: e.target.value })
            }
            rows={3}
          />
        </div>

        <div>
          <Label>Описание кафе</Label>
          <Textarea
            value={siteSettings.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onSiteSettingsChange({ ...siteSettings, description: e.target.value })
            }
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Кафе открыто</Label>
              <p className="text-sm text-muted-foreground">
                Отображать статус "Открыто" на сайте
              </p>
            </div>
            <Switch
              checked={siteSettings.isOpen}
              onCheckedChange={(checked: boolean) =>
                onSiteSettingsChange({ ...siteSettings, isOpen: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Принимать бронирования</Label>
              <p className="text-sm text-muted-foreground">
                Разрешить пользователям бронировать столики
              </p>
            </div>
            <Switch
              checked={siteSettings.acceptsReservations}
              onCheckedChange={(checked: boolean) =>
                onSiteSettingsChange({ ...siteSettings, acceptsReservations: checked })
              }
            />
          </div>
        </div>

        <Button onClick={onSaveSiteSettings} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Сохранить настройки
        </Button>
      </CardContent>
    </Card>
  );
}

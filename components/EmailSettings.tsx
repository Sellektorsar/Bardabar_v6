import { AlertCircle, CheckCircle, Mail, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { emailSettingsApi, ProjectPausedError } from "../src/api/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

interface EmailSettings {
  enabled: boolean;
  adminEmail: string;
  fromEmail: string;
  templates: {
    tableReservation: boolean;
    eventBooking: boolean;
    paymentConfirmation: boolean;
  };
}

export function EmailSettings() {
  const [settings, setSettings] = useState<EmailSettings>({
    enabled: true,
    adminEmail: 'admin@bar-da-bar.ru',
    fromEmail: 'noreply@bar-da-bar.ru',
    templates: {
      tableReservation: true,
      eventBooking: true,
      paymentConfirmation: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  // Получение настроек с сервера
  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await emailSettingsApi.get();
      if (data && typeof data === "object") {
        setSettings((prev) => ({ ...prev, ...data }));
      }
      setBackendUnavailable(false);
    } catch (error) {
      console.log("Ошибка при загрузке настроек email:", error);
      setBackendUnavailable(true);
      if (!(error instanceof ProjectPausedError)) {
        toast.error("Не удалось загрузить настройки email");
      }
    } finally {
      setLoading(false);
    }
  };

  // Сохранение настроек на сервер
  const saveSettings = async () => {
    setSaving(true);
    try {
      await emailSettingsApi.update(settings);
      setBackendUnavailable(false);
      toast.success("Настройки email сохранены!");
    } catch (error) {
      console.log("Ошибка при сохранении настроек email:", error);
      setBackendUnavailable(true);
      toast.error("Не удалось сохранить настройки email");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = (updates: Partial<EmailSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateTemplates = (templateType: keyof EmailSettings['templates'], enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      templates: {
        ...prev.templates,
        [templateType]: enabled
      }
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Настройки Email уведомлений
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка настроек...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Настройки Email уведомлений
          {backendUnavailable && (
            <AlertCircle className="h-4 w-4 text-amber-500" title="Нет связи с сервером" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Основные настройки */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Включить email уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Отправлять email уведомления клиентам и администраторам
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) => updateSettings({ enabled })}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email администратора</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSettings({ adminEmail: e.target.value })}
                placeholder="admin@bar-da-bar.ru"
                disabled={!settings.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email отправителя</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) => updateSettings({ fromEmail: e.target.value })}
                placeholder="noreply@bar-da-bar.ru"
                disabled={!settings.enabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Настройки шаблонов */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <Label className="text-base">Типы уведомлений</Label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Бронирование столиков</Label>
                <p className="text-sm text-muted-foreground">
                  Подтверждение бронирования столика
                </p>
              </div>
              <Switch
                checked={settings.templates.tableReservation}
                onCheckedChange={(enabled) => updateTemplates('tableReservation', enabled)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Бронирование мероприятий</Label>
                <p className="text-sm text-muted-foreground">
                  Подтверждение бронирования на мероприятие
                </p>
              </div>
              <Switch
                checked={settings.templates.eventBooking}
                onCheckedChange={(enabled) => updateTemplates('eventBooking', enabled)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Подтверждение оплаты</Label>
                <p className="text-sm text-muted-foreground">
                  Уведомление об успешной оплате мероприятия
                </p>
              </div>
              <Switch
                checked={settings.templates.paymentConfirmation}
                onCheckedChange={(enabled) => updateTemplates('paymentConfirmation', enabled)}
                disabled={!settings.enabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Кнопки действий */}
        <div className="flex gap-3">
          <Button
            onClick={saveSettings}
            disabled={saving || !settings.enabled}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Сохранение...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Сохранить настройки
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={loadSettings}
            disabled={loading}
          >
            Обновить
          </Button>
        </div>

        {backendUnavailable && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Нет связи с сервером. Настройки могут быть неактуальными.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
"use client";

import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Пожалуйста, введите email адрес");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Пожалуйста, введите корректный email адрес");
      return;
    }
    toast.success("Спасибо за подписку! Мы будем присылать вам новости о наших мероприятиях.");
    setEmail("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle id="newsletter-title">Подписка на новости</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Закрыть">
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Получайте уведомления о новых мероприятиях, специальных предложениях и новостях
            ресторана
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="newsletter-email" className="sr-only">Email адрес</label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Ваш email адрес"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
            >
              Подписаться
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

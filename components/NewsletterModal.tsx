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
    if (email) {
      toast.success("Спасибо за подписку! Мы будем присылать вам новости о наших мероприятиях.");
      setEmail("");
      onClose();
    } else {
      toast.error("Пожалуйста, введите email адрес");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Подписка на новости</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Получайте уведомления о новых мероприятиях, специальных предложениях и новостях
            ресторана
          </p>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Ваш email адрес"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
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

"'use client'";

import { Bell, Calendar, Edit, Menu, Plus, Save, Settings, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminNotifications } from "./AdminNotifications";
import { BookingManagement } from "./BookingManagement";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";

export function AdminPanel() {
  // Staff management
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "Алексей Иванов",
      position: "Шеф-повар",
      description: "Опытный шеф-повар с 15-летним стажем.",
      image: "https://images.unsplash.com/photo-1583394293214-28a5b42b6171?w=400",
    },
    {
      id: 2,
      name: "Мария Петрова",
      position: "Бариста",
      description: "Мастер кофейного дела.",
      image: "https://images.unsplash.com/photo-1494790108755-2616c8e3e7fa?w=400",
    },
  ]);

  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    description: "",
    image: "",
  });

  const [editingStaff, setEditingStaff] = useState<any>(null);

  // Menu management
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Стейк рибай",
      description: "Сочный стейк из мраморной говядины",
      price: "1500",
      category: "Горячие блюда",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      isSpecial: true,
    },
    {
      id: 2,
      name: "Паста карбонара",
      description: "Классическая итальянская паста",
      price: "890",
      category: "Горячие блюда",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d292?w=400",
      isSpecial: false,
    },
  ]);

  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "Горячие блюда",
    image: "",
    isSpecial: false,
  });

  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);

  // Settings
  const [settings, setSettings] = useState({
    cafeName: "Бар-да-бар",
    phone: "+7 (495) 123-45-67",
    email: "info@bar-da-bar.ru",
    address: "г. Москва, ул. Центральная, 123",
    workingHours: "Пн-Чт: 09:00-23:00, Пт-Сб: 09:00-01:00, Вс: 10:00-22:00",
    description: "Уютное кафе в самом сердце города",
    isOpen: true,
    acceptsReservations: true,
  });

  const menuCategories = ["Горячие блюда", "Салаты", "Напитки", "Десерты"];

  // Staff functions
  const addStaff = () => {
    if (newStaff.name && newStaff.position) {
      setStaff([...staff, { ...newStaff, id: Date.now() }]);
      setNewStaff({ name: "", position: "", description: "", image: "" });
      toast.success("Сотрудник добавлен");
    } else {
      toast.error("Заполните имя и должность");
    }
  };

  const updateStaff = () => {
    if (editingStaff) {
      setStaff(staff.map((s) => (s.id === editingStaff.id ? editingStaff : s)));
      setEditingStaff(null);
      toast.success("Данные сотрудника обновлены");
    }
  };

  const deleteStaff = (id: number) => {
    setStaff(staff.filter((s) => s.id !== id));
    toast.success("Сотрудник удален");
  };

  // Menu functions
  const addMenuItem = () => {
    if (newMenuItem.name && newMenuItem.price) {
      setMenuItems([...menuItems, { ...newMenuItem, id: Date.now() }]);
      setNewMenuItem({
        name: "",
        description: "",
        price: "",
        category: "Горячие блюда",
        image: "",
        isSpecial: false,
      });
      toast.success("Блюдо добавлено в меню");
    } else {
      toast.error("Заполните название и цену");
    }
  };

  const updateMenuItem = () => {
    if (editingMenuItem) {
      setMenuItems(
        menuItems.map((item) => (item.id === editingMenuItem.id ? editingMenuItem : item)),
      );
      setEditingMenuItem(null);
      toast.success("Блюдо обновлено");
    }
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    toast.success("Блюдо удалено из меню");
  };

  const saveSettings = () => {
    toast.success("Настройки сохранены!");
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-foreground">Панель администратора</h2>
        <p className="text-xl text-muted-foreground">
          Управляйте контентом и бронированиями вашего кафе
        </p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-5">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Бронирования
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Персонал
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Menu className="h-4 w-4" />
            Меню
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Настройки
          </TabsTrigger>
        </TabsList>

        {/* Notifications Management */}
        <TabsContent value="notifications">
          <AdminNotifications />
        </TabsContent>

        {/* Bookings Management */}
        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>

        {/* Staff Management */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Добавить сотрудника
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="Введите имя сотрудника"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Должность</Label>
                  <Input
                    id="position"
                    value={newStaff.position}
                    onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                    placeholder="Введите должность"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="image">URL изображения</Label>
                <Input
                  id="image"
                  value={newStaff.image}
                  onChange={(e) => setNewStaff({ ...newStaff, image: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newStaff.description}
                  onChange={(e) => setNewStaff({ ...newStaff, description: e.target.value })}
                  placeholder="Краткое описание сотрудника"
                  rows={3}
                />
              </div>
              <Button onClick={addStaff} className="w-full">
                Добавить сотрудника
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Список сотрудников</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={member.image || "https://via.placeholder.com/60"}
                      alt={member.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge variant="secondary">{member.position}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingStaff(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteStaff(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {editingStaff && (
            <Card>
              <CardHeader>
                <CardTitle>Редактировать сотрудника</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>Имя</Label>
                    <Input
                      value={editingStaff.name}
                      onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Должность</Label>
                    <Input
                      value={editingStaff.position}
                      onChange={(e) =>
                        setEditingStaff({ ...editingStaff, position: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>URL изображения</Label>
                  <Input
                    value={editingStaff.image}
                    onChange={(e) => setEditingStaff({ ...editingStaff, image: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={editingStaff.description}
                    onChange={(e) =>
                      setEditingStaff({ ...editingStaff, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateStaff}>Сохранить изменения</Button>
                  <Button variant="outline" onClick={() => setEditingStaff(null)}>
                    Отмена
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Menu Management */}
        <TabsContent value="menu" className="space-y-6">
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
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                    placeholder="Название блюда"
                  />
                </div>
                <div>
                  <Label>Цена</Label>
                  <Input
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label>Категория</Label>
                  <Select
                    value={newMenuItem.category}
                    onValueChange={(value) => setNewMenuItem({ ...newMenuItem, category: value })}
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
              <div>
                <Label>URL изображения</Label>
                <Input
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, image: e.target.value })}
                  placeholder="https://example.com/dish.jpg"
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                  placeholder="Описание блюда"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="special"
                  checked={newMenuItem.isSpecial}
                  onCheckedChange={(checked) =>
                    setNewMenuItem({ ...newMenuItem, isSpecial: checked })
                  }
                />
                <Label htmlFor="special">Специальное предложение</Label>
              </div>
              <Button onClick={addMenuItem} className="w-full">
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
                      <div className="flex gap-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="outline">{item.price} ₽</Badge>
                        {item.isSpecial && <Badge>Хит</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingMenuItem(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteMenuItem(item.id)}>
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
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Цена</Label>
                    <Input
                      value={editingMenuItem.price}
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Категория</Label>
                    <Select
                      value={editingMenuItem.category}
                      onValueChange={(value) =>
                        setEditingMenuItem({ ...editingMenuItem, category: value })
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
                <div>
                  <Label>URL изображения</Label>
                  <Input
                    value={editingMenuItem.image}
                    onChange={(e) =>
                      setEditingMenuItem({ ...editingMenuItem, image: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={editingMenuItem.description}
                    onChange={(e) =>
                      setEditingMenuItem({ ...editingMenuItem, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="special-edit"
                    checked={editingMenuItem.isSpecial}
                    onCheckedChange={(checked) =>
                      setEditingMenuItem({ ...editingMenuItem, isSpecial: checked })
                    }
                  />
                  <Label htmlFor="special-edit">Специальное предложение</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateMenuItem}>Сохранить изменения</Button>
                  <Button variant="outline" onClick={() => setEditingMenuItem(null)}>
                    Отмена
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Общие настройки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Название кафе</Label>
                  <Input
                    value={settings.cafeName}
                    onChange={(e) => setSettings({ ...settings, cafeName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Телефон</Label>
                  <Input
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Адрес</Label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Режим работы</Label>
                <Textarea
                  value={settings.workingHours}
                  onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Описание кафе</Label>
                <Textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
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
                    checked={settings.isOpen}
                    onCheckedChange={(checked) => setSettings({ ...settings, isOpen: checked })}
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
                    checked={settings.acceptsReservations}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, acceptsReservations: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={saveSettings} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
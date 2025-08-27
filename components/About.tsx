"'use client'";

import { Award, Coffee, Heart, Users } from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AboutProps {
  isAdminMode?: boolean;
}

export function About({ isAdminMode: _isAdminMode }: AboutProps) {
  const teamMembers = [
    {
      id: 1,
      name: "Алексей Иванов",
      position: "Шеф-повар",
      description:
        "Опытный шеф-повар с 15-летним стажем работы в лучших ресторанах Москвы. Специализируется на европейской и авторской кухне.",
      image:
        "https://images.unsplash.com/photo-1583394293214-28a5b42b6171?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      speciality: "Авторская кухня",
    },
    {
      id: 2,
      name: "Мария Петрова",
      position: "Старший бариста",
      description:
        "Мастер кофейного дела, чемпион городских соревнований по латте-арт. Знает все секреты идеального кофе.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616c8e3e7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      speciality: "Кофейные напитки",
    },
    {
      id: 3,
      name: "Дмитрий Соколов",
      position: "Су-шеф",
      description:
        "Правая рука шеф-повара, отвечает за качество каждого блюда. Мастер холодных закусок и десертов.",
      image:
        "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      speciality: "Десерты",
    },
    {
      id: 4,
      name: "Анна Васильева",
      position: "Управляющая",
      description:
        "Обеспечивает безупречный сервис и уютную атмосферу. Всегда готова помочь с выбором и сделать ваш визит незабываемым.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      speciality: "Сервис",
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: "Лучшее кафе района 2023",
      description: 'По версии портала "Афиша"',
    },
    {
      icon: Coffee,
      title: 'Премия "Золотой турок"',
      description: "За лучший кофе в городе",
    },
    {
      icon: Heart,
      title: "2000+ довольных гостей",
      description: "Каждый месяц нас посещают",
    },
    {
      icon: Users,
      title: "Команда профессионалов",
      description: "Опыт работы более 50 лет суммарно",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-foreground">О нас</h2>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          "Бар-да-бар" — это не просто кафе, это место, где встречаются традиции и современность,
          где каждая чашка кофе готовится с душой, а каждое блюдо — произведение искусства.
        </p>
      </div>

      {/* История кафе */}
      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h3 className="mb-6 text-2xl font-bold text-foreground">Наша история</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Наше кафе открылось в 2018 году с простой идеей — создать место, где люди могут
              отдохнуть от городской суеты и насладиться качественной едой и напитками.
            </p>
            <p>
              За годы работы мы собрали команду настоящих профессионалов, каждый из которых
              вкладывает душу в свое дело. Мы тщательно отбираем продукты от лучших поставщиков и
              постоянно совершенствуем наши рецепты.
            </p>
            <p>
              Сегодня "Бар-да-бар" — это признанное место встреч для жителей и гостей города, где
              царит атмосфера уюта и гостеприимства.
            </p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Интерьер кафе Бар-да-бар"
            className="h-96 w-full rounded-2xl object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Достижения */}
      <div className="mb-16">
        <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Наши достижения</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={index}
                className="border-border text-center transition-shadow duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="bg-accent/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h4 className="mb-2 font-bold text-foreground">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Команда */}
      <div>
        <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Наша команда</h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="group border-border transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute right-4 top-4">
                    <Badge variant="secondary" className="text-xs">
                      {member.speciality}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-1 text-lg text-foreground">{member.name}</CardTitle>
                <Badge variant="secondary" className="mb-3">
                  {member.position}
                </Badge>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Философия */}
      <div className="bg-accent/20 mt-16 rounded-2xl p-8">
        <div className="text-center">
          <h3 className="mb-4 text-2xl font-bold text-foreground">Наша философия</h3>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Мы верим, что хорошая еда объединяет людей. Каждое блюдо готовится с любовью, каждый
            гость — наш почетный друг. Мы создаем не просто кафе, а пространство для душевных встреч
            и незабываемых моментов.
          </p>
        </div>
      </div>
    </section>
  );
}

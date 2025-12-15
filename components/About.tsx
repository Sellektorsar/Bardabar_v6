"use client";

import { Award, Coffee, Heart, Users } from "lucide-react";

import type { TeamMember } from "../src/types";
import { AnimatedCounter } from "./AnimatedCounter";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ScrollReveal } from "./ScrollReveal";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AboutProps {
  cafeName: string;
  teamMembers: TeamMember[];
}

export function About({ cafeName, teamMembers }: AboutProps) {
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
      <ScrollReveal>
        <div className="mb-16 text-center">
          <h2 className="gradient-text-animated mb-4 text-4xl font-bold">О нас</h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            "{cafeName}" — это не просто кафе, это место, где встречаются традиции и современность,
            где каждая чашка кофе готовится с душой, а каждое блюдо — произведение искусства.
          </p>
        </div>
      </ScrollReveal>

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
              Сегодня "{cafeName}" — это признанное место встреч для жителей и гостей города, где
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
      <ScrollReveal delay={200}>
        <div className="mb-16">
          <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Наши достижения</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card
                  key={index}
                  className="hover-lift group border-orange-100 text-center"
                >
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 transition-transform group-hover:scale-110 dark:from-orange-900/30 dark:to-red-900/30">
                      <Icon className="h-8 w-8 text-orange-600 transition-transform group-hover:rotate-12" />
                    </div>
                    <h4 className="mb-2 font-bold text-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Команда */}
      <ScrollReveal delay={300}>
        <div>
          <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Наша команда</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <Card
                key={member.id}
                className="hover-lift group border-orange-100"
                style={{ animationDelay: `${index * 100}ms` }}
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
      </ScrollReveal>

      {/* Философия */}
      <ScrollReveal delay={400}>
        <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 p-8 dark:from-orange-900/20 dark:to-red-900/20">
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold text-foreground">Наша философия</h3>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Мы верим, что хорошая еда объединяет людей. Каждое блюдо готовится с любовью, каждый
              гость — наш почетный друг. Мы создаем не просто кафе, а пространство для душевных встреч
              и незабываемых моментов.
            </p>
            {/* Animated stats */}
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  <AnimatedCounter end={2018} duration={1500} />
                </div>
                <div className="text-sm text-muted-foreground">Год основания</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  <AnimatedCounter end={50} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Лет опыта команды</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  <AnimatedCounter end={2000} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Гостей в месяц</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

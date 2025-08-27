"use client";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Добавляем явные типы для элементов меню, чтобы свойство isSpecial стало опциональным
// и корректно воспринималось в строгом режиме TypeScript
type MenuItem = {
  name: string;
  description: string;
  price: string;
  image: string;
  allergens: string[];
  isSpecial?: boolean;
};

type MenuCategory = {
  title: string;
  items: MenuItem[];
};

export function Menu() {
  const menuCategories: MenuCategory[] = [
    {
      title: "Горячие блюда",
      items: [
        {
          name: "Стейк рибай",
          description: "Сочный стейк из мраморной говядины с картофелем гриль",
          price: "1500 ₽",
          image:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          isSpecial: true,
          allergens: [],
        },
        {
          name: "Паста карбонара",
          description: "Классическая итальянская паста с беконом и пармезаном",
          price: "890 ₽",
          image:
            "https://images.unsplash.com/photo-1621996346565-e3dbc353d292?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["глютен", "молочные продукты", "яйца"],
        },
        {
          name: "Ризотто с грибами",
          description: "Кремовое ризотто с лесными грибами и трюфельным маслом",
          price: "750 ₽",
          image:
            "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["молочные продукты"],
        },
        {
          name: "Лосось гриль",
          description: "Филе норвежского лосося с овощами на пару и лимонным соусом",
          price: "1200 ₽",
          image:
            "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["рыба"],
        },
        {
          name: "Куриное филе в сливочном соусе",
          description: "Нежное куриное филе в сливочно-грибном соусе с гарниром из риса",
          price: "680 ₽",
          image:
            "https://images.unsplash.com/photo-1532636644-d49bc01a8c48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["молочные продукты"],
        },
        {
          name: "Говядина веллингтон",
          description: "Говяжья вырезка в слоеном тесте с грибным дюкселем",
          price: "1800 ₽",
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          isSpecial: true,
          allergens: ["глютен", "яйца"],
        },
      ],
    },
    {
      title: "Салаты",
      items: [
        {
          name: "Цезарь с курицей",
          description: "Классический салат с курицей гриль, пармезаном и соусом цезарь",
          price: "650 ₽",
          image:
            "https://images.unsplash.com/photo-1512852939750-1305098529bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["глютен", "молочные продукты", "яйца"],
        },
        {
          name: "Греческий салат",
          description: "Свежие овощи с сыром фета и оливковым маслом",
          price: "590 ₽",
          image:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["молочные продукты"],
        },
        {
          name: "Салат с тунцом",
          description: "Микс салатов с тунцом, авокадо, помидорами черри и кунжутом",
          price: "720 ₽",
          image:
            "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["рыба", "кунжут"],
        },
        {
          name: "Салат с козьим сыром",
          description: "Салат из рукколы и шпината с теплым козьим сыром и грецкими орехами",
          price: "590 ₽",
          image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["молочные продукты", "орехи"],
        },
        {
          name: "Салат с креветками",
          description: "Салат из креветок с авокадо, огурцом и пряным соусом",
          price: "890 ₽",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["ракообразные"],
        },
      ],
    },
    {
      title: "Закуски",
      items: [
        {
          name: "Брускетта с томатами",
          description: "Хрустящий багет с томатами, базиликом и оливковым маслом",
          price: "420 ₽",
          image:
            "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен"],
        },
        {
          name: "Куриные крылышки BBQ",
          description: "Пикантные крылышки в соусе барбекю с соусом блю чиз",
          price: "560 ₽",
          image:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["молочные продукты"],
        },
        {
          name: "Сырная тарелка",
          description: "Ассорти европейских сыров с виноградом и медом",
          price: "790 ₽",
          image:
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["молочные продукты"],
        },
        {
          name: "Мидии в белом вине",
          description: "Свежие мидии в ароматном соусе из белого вина с чесноком",
          price: "650 ₽",
          image:
            "https://images.unsplash.com/photo-1567876576464-ad47ce7996d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["моллюски"],
        },
        {
          name: "Устрицы свежие",
          description: "Французские устрицы с лимоном и мигнонетом",
          price: "220 ₽ за шт.",
          image:
            "https://images.unsplash.com/photo-1535473895227-bdce8602246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          isSpecial: true,
          allergens: ["моллюски"],
        },
        {
          name: "Хумус с питой",
          description: "Домашний хумус с теплой питой и овощными палочками",
          price: "380 ₽",
          image:
            "https://images.unsplash.com/photo-1593606605657-ad78ed2ab23b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен", "кунжут"],
        },
      ],
    },
    {
      title: "Пицца",
      items: [
        {
          name: "Маргарита",
          description: "Классическая пицца с соусом из томатов Сан-Марцано и моцареллой",
          price: "790 ₽",
          image:
            "https://images.unsplash.com/photo-1542831371-d531d36971e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен", "молочные продукты"],
        },
        {
          name: "Пепперони",
          description: "Пицца с пепперони, сыром моцарелла и пряным томатным соусом",
          price: "890 ₽",
          image:
            "https://images.unsplash.com/photo-1548365328-8b849c1d79b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен", "молочные продукты"],
        },
        {
          name: "Кватро формаджи",
          description: "Пицца с четырьмя видами сыра: моцарелла, горгонзола, пармезан, козий",
          price: "950 ₽",
          image:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен", "молочные продукты"],
        },
        {
          name: "Прошутто и рукола",
          description: "Пицца с пармской ветчиной, рукколой и пармезаном",
          price: "1050 ₽",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен", "молочные продукты"],
        },
        {
          name: "Морепродукты",
          description: "Пицца с креветками, мидиями, кальмарами и чесноком",
          price: "1150 ₽",
          image:
            "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          isSpecial: true,
          allergens: ["глютен", "молочные продукты", "ракообразные", "моллюски"],
        },
      ],
    },
    {
      title: "Десерты",
      items: [
        {
          name: "Тирамису",
          description: "Итальянский десерт с маскарпоне, кофе и какао",
          price: "450 ₽",
          image:
            "https://images.unsplash.com/photo-1606313564200-e75d5e30476a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен", "молочные продукты", "яйца"],
        },
        {
          name: "Чизкейк Нью-Йорк",
          description: "Нежный чизкейк с ванилью и малиновым соусом",
          price: "480 ₽",
          image:
            "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен", "молочные продукты", "яйца"],
        },
        {
          name: "Крем-брюле",
          description: "Классический французский десерт с ванильным кремом и карамелью",
          price: "420 ₽",
          image:
            "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["молочные продукты", "яйца"],
        },
        {
          name: "Шоколадный фондан",
          description: "Теплый шоколадный кекс с жидкой начинкой и ванильным мороженым",
          price: "520 ₽",
          image:
            "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          isSpecial: true,
          allergens: ["глютен", "молочные продукты", "яйца"],
        },
        {
          name: "Панна-котта с ягодами",
          description: "Нежный итальянский десерт со свежими сезонными ягодами",
          price: "390 ₽",
          image:
            "https://images.unsplash.com/photo-1488477304112-4944851de03d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["молочные продукты"],
        },
        {
          name: "Лимонный тарт",
          description: "Хрустящая основа с нежным лимонным кремом и меренгой",
          price: "460 ₽",
          image:
            "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1100&q=80",
          allergens: ["глютен", "молочные продукты", "яйца"],
        },
      ],
    },
    {
      title: "Напитки",
      items: [
        {
          name: 'Авторский коктейль "Бар-да-бар"',
          description: "Фирменный коктейль с ромом, фруктовыми соками и мятой",
          price: "450 ₽",
          image:
            "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          isSpecial: true,
          allergens: [],
        },
        {
          name: "Свежевыжатый сок",
          description: "Апельсиновый, яблочный или морковный сок",
          price: "250 ₽",
          image:
            "https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: [],
        },
        {
          name: "Мохито",
          description: "Освежающий коктейль с белым ромом, мятой и лаймом",
          price: "380 ₽",
          image:
            "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: [],
        },
        {
          name: "Эспрессо мартини",
          description: "Коктейль с водкой, кофейным ликером и эспрессо",
          price: "420 ₽",
          image:
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: [],
        },
        {
          name: "Домашний лимонад",
          description: "Освежающий лимонад с мятой и газированной водой",
          price: "180 ₽",
          image:
            "https://images.unsplash.com/photo-1523371683702-aeddf6b3d64b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: [],
        },
        {
          name: "Вино (бокал)",
          description: "Красное, белое или розовое вино из нашей винной карты",
          price: "от 320 ₽",
          image:
            "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["сульфиты"],
        },
        {
          name: "Крафтовое пиво",
          description: "IPA, стаут или пшеничное пиво от локальной пивоварни",
          price: "от 280 ₽",
          image:
            "https://images.unsplash.com/photo-1559740720-ec9d013b3e50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          allergens: ["глютен"],
        },
      ],
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-foreground">Наше меню</h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Изысканные блюда, приготовленные с любовью из свежих продуктов
        </p>
      </div>

      <div className="space-y-12">
        {menuCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-6">
            <h3 className="border-b-2 border-border pb-2 text-2xl font-bold text-foreground">
              {category.title}
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item, itemIndex) => (
                <Card
                  key={itemIndex}
                  className="group border-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {item.isSpecial && (
                        <Badge className="absolute right-2 top-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          Хит
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="mb-2 flex items-start justify-between">
                      <CardTitle className="text-lg text-foreground">{item.name}</CardTitle>
                      <span className="text-lg font-bold text-orange-600">{item.price}</span>
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    {item.allergens && item.allergens.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-1 text-xs text-muted-foreground">Аллергены:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen, allergenIndex) => (
                            <Badge
                              key={allergenIndex}
                              variant="outline"
                              className="border-red-200 text-xs text-red-600"
                            >
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

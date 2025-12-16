/**
 * Скрипт для загрузки изображений в Supabase Storage
 * Запуск: npx tsx scripts/upload-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

// Supabase credentials
const SUPABASE_URL = "https://epzjzmvefnlchacvegtk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

if (!SUPABASE_SERVICE_KEY) {
  console.error("❌ SUPABASE_SERVICE_KEY не установлен!");
  console.log("Установите переменную окружения:");
  console.log("  set SUPABASE_SERVICE_KEY=your_service_role_key");
  console.log("\nService key можно найти в Supabase Dashboard → Settings → API → service_role key");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Изображения для загрузки
const IMAGES_TO_UPLOAD = [
  // Галерея - интерьер
  { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000", name: "interior-1.jpg", category: "interior" },
  { url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000", name: "interior-2.jpg", category: "interior" },
  { url: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1000", name: "interior-3.jpg", category: "interior" },
  // Галерея - еда
  { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000", name: "food-1.jpg", category: "food" },
  { url: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1000", name: "food-2.jpg", category: "food" },
  { url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000", name: "food-3.jpg", category: "food" },
  { url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1000", name: "food-4.jpg", category: "food" },
  // Галерея - мероприятия
  { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000", name: "events-1.jpg", category: "events" },
  { url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1000", name: "events-2.jpg", category: "events" },
  { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000", name: "events-3.jpg", category: "events" },
  { url: "https://images.unsplash.com/photo-1512852939750-1305098529bf?w=1000", name: "events-4.jpg", category: "events" },
  { url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=1000", name: "events-5.jpg", category: "events" },
];

// Скачать изображение по URL
async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Следуем редиректам
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    }).on("error", reject);
  });
}

// Загрузить изображение в Supabase Storage
async function uploadToStorage(buffer: Buffer, fileName: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    throw error;
  }

  // Получить публичный URL
  const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
  return urlData.publicUrl;
}

// Обновить URL в базе данных
async function updateGalleryUrl(oldUrl: string, newUrl: string): Promise<void> {
  const { error } = await supabase
    .from("gallery_images")
    .update({ url: newUrl })
    .like("url", `%${oldUrl.split("photo-")[1]?.split("?")[0] || ""}%`);

  if (error) {
    console.warn(`⚠️ Не удалось обновить URL в БД: ${error.message}`);
  }
}

// Главная функция
async function main() {
  console.log("🚀 Начинаем загрузку изображений в Supabase Storage...\n");

  const results: { name: string; url: string; success: boolean }[] = [];

  for (const image of IMAGES_TO_UPLOAD) {
    try {
      console.log(`📥 Скачиваем: ${image.name}...`);
      const buffer = await downloadImage(image.url);
      
      console.log(`📤 Загружаем в Storage: ${image.name}...`);
      const newUrl = await uploadToStorage(buffer, `gallery/${image.name}`);
      
      console.log(`🔄 Обновляем URL в БД...`);
      await updateGalleryUrl(image.url, newUrl);
      
      console.log(`✅ ${image.name} → ${newUrl}\n`);
      results.push({ name: image.name, url: newUrl, success: true });
    } catch (error) {
      console.error(`❌ Ошибка с ${image.name}:`, error);
      results.push({ name: image.name, url: "", success: false });
    }
  }

  console.log("\n📊 Результаты:");
  console.log(`✅ Успешно: ${results.filter(r => r.success).length}`);
  console.log(`❌ Ошибок: ${results.filter(r => !r.success).length}`);

  // Сохраняем маппинг URL
  const mapping = results
    .filter(r => r.success)
    .reduce((acc, r) => ({ ...acc, [r.name]: r.url }), {});
  
  fs.writeFileSync("scripts/image-urls.json", JSON.stringify(mapping, null, 2));
  console.log("\n💾 Маппинг URL сохранён в scripts/image-urls.json");
}

main().catch(console.error);

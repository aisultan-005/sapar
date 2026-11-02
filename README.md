# Sapar — тур-приложение

Монорепо: `frontend` (React + Vite + Tailwind + Clerk + Supabase) и `backend` (Express + MongoDB + Groq).

## Деплой (только frontend на Vercel + Supabase)

1. **GitHub**: залить этот репозиторий.
2. **Supabase**: создать проект → Project Settings → API → скопировать Project URL и anon-ключ.
3. **Clerk**: dashboard.clerk.com → создать приложение, добавить Vercel-домен в Allowed origins,
   создать JWT Template с именем `supabase`.
4. **Vercel**: Add New → Project → выбрать репозиторий. Настройки:
   - Root Directory: `frontend`
   - Framework: Vite, Build: `npm run build`, Output: `dist`
   - Environment Variables:
     - `VITE_CLERK_PUBLISHABLE_KEY`
     - `VITE_SUPABASE_URL` = `https://ВАШ-ПРОЕКТ.supabase.co/rest/v1/`
     - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Каждый `git push` в `main` пересобирает сайт автоматически.

## Переменные окружения

Скопируйте `frontend/.env.example` → `frontend/.env` и `backend/.env.example` → `backend/.env`,
подставьте свои ключи. Файлы `.env` в репозиторий не коммитятся (см. `.gitignore`).

## Backend (опционально, отдельно)

Express + MongoDB + Groq на Vercel не работает стабильно. Для ИИ-маршрутов разверните
backend на Render.com / Railway, базу — на MongoDB Atlas, затем добавьте `VITE_API_URL` в Vercel.

## Локальный запуск

```
npm install
npm run dev   # frontend + backend параллельно
npm test      # тесты backend (AI-маршрут, гео) и frontend (расчёт сводки маршрута)
```

## Возможности

- **Маршрут сохраняется в браузере** (localStorage) — переживает перезагрузку и открывается без сети.
- **Многодневные AI-маршруты**: длительность из окна AI (1/2/3/7 дней) уходит в Groq, пункты
  группируются по дням. Groq получает каталог мест Sapar с координатами и возвращает `locId`/`lat`/`lon`.
- **Демо-маршрут без ключа Groq**: backend сам строит маршрут из каталога — места по интересам,
  порядок «ближайший сосед», по 2 места в день с завтраком, обедом и ночёвкой.
- **Реальная сводка**: расстояние — по координатам (формула гаверсинуса × 1.3 на дороги),
  время — сумма длительностей, бюджет — по типам пунктов + бензин.
- **Маршрут на карте**: кнопка «Показать на карте» — нумерованные остановки и линия маршрута.
- **«Рядом с вами»** по реальной геопозиции (если включена «Геолокация» в профиле).
- Окно AI и новые экраны переведены на русский, казахский и английский; AI отвечает на языке интерфейса.

## API (backend)

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/ai/route` | `{ preferences: { tags, days, budget, lang } }` → `{ data: { title, items, source } }`, `source` = `groq` или `demo` |
| GET | `/api/locations` | `?search=&tag=` |
| GET | `/api/locations/nearby` | `?lat=&lon=&limit=` — места, отсортированные по расстоянию |
| GET/POST/DELETE | `/api/itinerary[/:id]` | сохранённые маршруты пользователя (нужны `MONGO_URI` и `CLERK_SECRET_KEY`) |

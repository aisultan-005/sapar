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
```

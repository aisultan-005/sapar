# Sapar Backend — Деплой на Render

## Что сделано (изменения в коде)
Backend подготовлен к работе на облачном сервере:
- **CORS** теперь читается из переменной `CORS_ORIGINS` (раньше был прибит к localhost)
- **MongoDB опциональна** — если URI не задан, сервер всё равно стартует, просто `/api/itinerary` отдаст 503. AI-роуты работают без БД.
- **Clerk опционален** — если `CLERK_SECRET_KEY` не задан, мидлварь не подключается (раньше падало)
- Добавлены **healthcheck-эндпоинты** `/` и `/health` — нужны Render'у, чтобы проверять что сервер жив
- В `package.json` указан **Node 20+** (engines)
- Добавлен **`render.yaml`** — Blueprint для автодеплоя
- Добавлен **`backend/.env.example`** — образец переменных

## Изменённые/новые файлы (7 штук)
- `backend/package.json` — добавлен `engines`
- `backend/.env.example` — новый, со всеми переменными
- `backend/src/app.js` — CORS из env, healthcheck, Clerk/Mongo опциональны
- `backend/src/config/env.js` — добавлен `corsOrigins`
- `backend/src/config/mongo.connector.js` — не падает без БД
- `backend/src/controllers/itinerary.controller.js` — graceful 503 без БД
- `render.yaml` — Blueprint для Render (в корне репо)

## Проверка работы
✓ Backend стартует без MONGO_URI и GROQ_API_KEY (вернётся mock-маршрут)
✓ `/health` отдаёт статус Mongo/Groq
✓ `/api/locations` работает (использует mock-данные)
✓ `/api/ai/route` работает (mock без ключа, реальный AI с ключом)

---

# 🚀 Деплой на Render — пошаговая инструкция

## Шаг 1: Получи Groq ключ (если ещё не)
1. Открой https://console.groq.com/keys
2. Войди (можно через Google)
3. **Create API Key** → дай имя «sapar» → скопируй ключ (вид `gsk_xxxxxxxxxxxxx`)
4. **Сохрани его в блокноте** — больше его не покажут

## Шаг 2: Залей изменения на GitHub
1. Распакуй `sapar-render.zip`, перенеси файлы поверх своих в репо
2. В терминале из корня проекта:
   ```bash
   git add .
   git commit -m "feat: backend ready for Render"
   git push
   ```

## Шаг 3: Создай Web Service на Render
1. Открой https://dashboard.render.com
2. Сверху справа: **New +** → **Web Service**
3. Если Render видит твой GitHub — выбери репо `aisultan-005/sapar`.
   Если не видит — нажми **Configure account** и разреши доступ к репо.
4. В форме настройки:
   - **Name:** `sapar-backend`
   - **Region:** `Frankfurt (EU Central)` (ближе всего к Казахстану)
   - **Branch:** `main`
   - **Root Directory:** `backend` ← **ВАЖНО**, иначе соберёт фронт
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Прокрути вниз до **Environment Variables**, добавь:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `GROQ_API_KEY` | `gsk_...` (твой ключ из шага 1) |
   | `GROQ_MODEL` | `openai/gpt-oss-20b` |
   | `CORS_ORIGINS` | `https://ТВОЙ_VERCEL_ДОМЕН.vercel.app` (без слэша на конце!) |

   **`MONGO_URI` пока НЕ заполняй** — мы её добавим позже.

6. Нажми **Create Web Service**
7. Render начнёт сборку — это займёт 2–4 минуты. Жди статус **Live**.
8. Скопируй URL сервиса сверху страницы — будет вида `https://sapar-backend-xxxx.onrender.com`

## Шаг 4: Проверь что backend жив
Открой в браузере: `https://sapar-backend-xxxx.onrender.com/health`

Должен увидеть JSON:
```json
{
  "status": "ok",
  "name": "sapar-backend",
  "mongo": "disconnected",
  "groq": "configured",
  ...
}
```
Главное: `"groq": "configured"`. Если `"missing"` — переменная не доехала, перепроверь Environment.

## Шаг 5: Подключи backend к фронту на Vercel
1. Открой https://vercel.com → твой проект **sapar** → **Settings** → **Environment Variables**
2. Добавь новую переменную:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://sapar-backend-xxxx.onrender.com/api` ← **с `/api` на конце**
   - **Environments:** все три галочки (Production, Preview, Development)
3. Нажми **Save**
4. **Передеплой фронта:** Vercel → Deployments → последний деплой → три точки → **Redeploy**
5. После деплоя зайди на свой сайт, нажми «Сгенерировать AI-маршрут» — должно работать (первый запрос будет ~30 сек, потому что Render «просыпается» из режима сна)

## Шаг 6 (опционально): MongoDB
Пока не нужна — AI работает без неё. Когда захочешь сохранять маршруты пользователей — заведём MongoDB Atlas и добавим `MONGO_URI` в Render. Скажи в следующем чате.

---

## Важные моменты

### «Сон» сервера (Free план)
Бесплатный Render усыпляет сервер после **15 минут без запросов**. Первый запрос после сна = ~30 сек ожидания. Для разработки/демо нормально, для прода поднимешь до Starter ($7/мес).

### Если что-то сломалось
- **Render Dashboard → твой сервис → Logs** — там вся диагностика
- Сервер не стартует → смотри Build Logs (вероятно опечатка в env)
- AI не отвечает → проверь что `/health` показывает `"groq": "configured"`
- Фронт не видит бэк → проверь что `CORS_ORIGINS` точно совпадает с Vercel-доменом (без `/` на конце, c `https://`)

### Render Blueprint (альтернатива, для гика)
В архиве лежит `render.yaml`. Если в шаге 3 вместо «New Web Service» выбрать **New + → Blueprint**, Render прочитает этот файл и создаст сервис автоматически — но env-переменные всё равно придётся вписать руками. Лень — используй обычный путь выше.

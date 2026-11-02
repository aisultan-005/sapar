import { createContext, useContext, useEffect, useState } from "react";

// Словари переводов. Ключи одинаковы для всех языков.
const dict = {
    РУС: {
        // ── Общее
        hello: "Сәлем!",
        whereTo: "Куда отправимся?",
        searchPlaceholder: "Поиск мест и достопримечательностей...",
        searchEmpty: "Ничего не найдено",
        noResults: "Нет результатов",

        // ── Нижняя навигация
        navHome: "Главная",
        navMap: "Карта",
        navRoute: "Маршрут",
        navFav: "Избранное",
        navProfile: "Профиль",

        // ── Discovery
        popular: "Популярные направления",
        nearby: "Рядом с вами",
        seeAll: "Все",
        aiTitle: "Сгенерировать AI-маршрут",
        aiSubtitle: "Умный планировщик подберёт идеальный путь",
        reviews: "отзывов",

        // ── Карта
        mapEyebrow: "Карта мест",
        mapTitle: "Казахстан на карте",
        mapHint: "Нажмите маркер",
        mapOpen: "Открыть место",

        // ── POI (детали места)
        verified: "Проверено Sapar",
        openNow: "Открыто сейчас",
        hours: "09:00 – 18:00 · Ежедневно",
        about: "О месте",
        aboutText: "Одно из самых популярных мест Казахстана. Здесь вы найдёте уникальное сочетание природной красоты, богатой истории и гостеприимства местных жителей. Идеальное место для семейного отдыха и культурного обогащения.",
        safetySection: "Безопасность и доступность",
        safetyKids: "Для детей",
        safetyAccessible: "Маломобильным",
        safetySafe: "Безопасно",
        safetyConnection: "Связь доступна",
        addToRoute: "Добавить в маршрут",
        inRoute: "Добавлено в маршрут",

        // ── Itinerary (маршрут)
        routeEyebrow: "Ваш маршрут",
        routeTitle: "Алматинская область",
        routeDays: "1 день",
        offlineAvailable: "Доступно офлайн",
        routeEmpty: "Маршрут пуст",
        routeEmptyHint: "Добавляйте места с главного экрана",
        routeSummary: "Итого по маршруту",
        sumDistance: "Расстояние",
        sumTime: "Время",
        sumBudget: "Бюджет",

        // ── Favorites
        favEyebrow: "Коллекция",
        favTitle: "Избранные места",
        favSavedOne: "место сохранено",
        favSavedMany: "мест сохранено",
        favEmpty: "Пока пусто",
        favEmptyHint: "Нажмите ♡ на любой достопримечательности, чтобы сохранить её здесь",

        // ── Profile
        userName: "Айдар Касымов",
        userSubtitle: "Путешественник с 2024",
        language: "Язык интерфейса",
        privacy: "Приватность и данные",
        privGeo: "Геолокация",
        privGeoDesc: "Для поиска мест рядом",
        privAnalytics: "Аналитика",
        privAnalyticsDesc: "Помогает улучшать приложение",
        appSettings: "Настройки",
        notif: "Уведомления",
        notifDesc: "Push о маршрутах",
        darkTheme: "Тёмная тема",
        darkThemeDesc: "Сберегите заряд",
        premiumTitle: "Подписка Premium",
        premiumDesc: "AI-рекомендации, эксклюзивные маршруты, без рекламы",
        premiumPerMonth: "/ месяц",
        premiumF1: "AI-маршруты без ограничений",
        premiumF2: "Офлайн-карты всех регионов",
        premiumF3: "Эксклюзивные скрытые места",
        premiumActive: "Активировано ✓",

        // ── Фильтры (теги)
        filterAll: "Все",
        filterNature: "Природа",
        filterCulture: "Культура",
        filterFood: "Еда",
        filterAdventure: "Приключения",
        filterFamily: "Семья",

        // ── Маршрут: дни, действия, подсказки
        days_one: "{n} день",
        days_few: "{n} дня",
        days_many: "{n} дней",
        dayN: "День {n}",
        offlineSavedHint: "Маршрут сохранён на устройстве и откроется без интернета",
        sumMeasuredHint: "Расстояние по координатам мест (с поправкой на дороги)",
        sumEstimatedHint: "Оценка: для части мест нет координат",
        showOnMap: "Показать на карте",
        routeReset: "Демо-маршрут",
        routeClear: "Очистить",
        routeClearConfirm: "Удалить все пункты маршрута?",
        moveUp: "Переместить вверх",
        moveDown: "Переместить вниз",
        remove: "Удалить",

        // ── Карта: маршрут
        mapRoute: "Маршрут",
        mapAllPlaces: "Все места",
        mapStop: "Остановка",

        // ── Рядом с вами
        nearbyFromYou: "от вас",

        // ── AI-планировщик
        aiEyebrow: "AI-планировщик",
        aiModalTitle: "Создать маршрут",
        aiInterests: "Интересы",
        aiDuration: "Длительность",
        aiBudget: "Бюджет",
        aiGenerate: "Сгенерировать",
        aiGenerating: "Генерирую маршрут...",
        aiSlowHint: "Первый запрос может занять до 30 секунд",
        aiErrEmpty: "Сервер вернул пустой маршрут",
        aiErrUnavailable: "Сервис AI временно недоступен",
        aiErrNetwork: "Не удалось связаться с сервером. Проверь интернет.",
        aiErrGeneric: "Ошибка генерации. Попробуй ещё раз.",
        close: "Закрыть",
        tagNature: "Природа",
        tagHistory: "История",
        tagCulture: "Культура",
        tagFood: "Еда",
        tagMountains: "Горы",
        tagLakes: "Озёра",
        dur1: "1 день",
        dur2: "2 дня",
        dur3: "3 дня",
        dur7: "Неделя",
        budgetLow: "До 20к ₸",
        budgetMid: "20–50к ₸",
        budgetHigh: "От 50к ₸",
    },

    ҚАЗ: {
        hello: "Сәлем!",
        whereTo: "Қайда барамыз?",
        searchPlaceholder: "Орындар мен көрікті жерлерді іздеу...",
        searchEmpty: "Ештеңе табылмады",
        noResults: "Нәтиже жоқ",

        navHome: "Басты бет",
        navMap: "Карта",
        navRoute: "Бағыт",
        navFav: "Таңдаулы",
        navProfile: "Профиль",

        popular: "Танымал бағыттар",
        nearby: "Жақын маңда",
        seeAll: "Барлығы",
        aiTitle: "AI-бағыт жасау",
        aiSubtitle: "Ақылды жоспарлаушы тамаша жол таңдайды",
        reviews: "пікір",

        mapEyebrow: "Орындар картасы",
        mapTitle: "Қазақстан картада",
        mapHint: "Маркерді басыңыз",
        mapOpen: "Орынды ашу",

        verified: "Sapar тексерген",
        openNow: "Қазір ашық",
        hours: "09:00 – 18:00 · Күнделікті",
        about: "Орын туралы",
        aboutText: "Қазақстанның ең танымал орындарының бірі. Мұнда сіз табиғи сұлулықтың, бай тарихтың және жергілікті тұрғындардың қонақжайлылығының бірегей үйлесімін көресіз. Отбасылық демалыс пен мәдени байытуға тамаша орын.",
        safetySection: "Қауіпсіздік және қолжетімділік",
        safetyKids: "Балалар үшін",
        safetyAccessible: "Мүмкіндігі шектеулі",
        safetySafe: "Қауіпсіз",
        safetyConnection: "Байланыс бар",
        addToRoute: "Бағытқа қосу",
        inRoute: "Бағытқа қосылды",

        routeEyebrow: "Сіздің бағытыңыз",
        routeTitle: "Алматы облысы",
        routeDays: "1 күн",
        offlineAvailable: "Офлайн қолжетімді",
        routeEmpty: "Бағыт бос",
        routeEmptyHint: "Басты беттен орындарды қосыңыз",
        routeSummary: "Бағыт қорытындысы",
        sumDistance: "Қашықтық",
        sumTime: "Уақыт",
        sumBudget: "Бюджет",

        favEyebrow: "Жинақ",
        favTitle: "Таңдаулы орындар",
        favSavedOne: "орын сақталды",
        favSavedMany: "орын сақталды",
        favEmpty: "Әзірге бос",
        favEmptyHint: "Кез келген көрікті жерде ♡ басып, оны осында сақтаңыз",

        userName: "Айдар Қасымов",
        userSubtitle: "2024 жылдан саяхатшы",
        language: "Интерфейс тілі",
        privacy: "Құпиялылық және деректер",
        privGeo: "Геолокация",
        privGeoDesc: "Жақын орындарды іздеу үшін",
        privAnalytics: "Аналитика",
        privAnalyticsDesc: "Қолданбаны жақсартуға көмектеседі",
        appSettings: "Баптаулар",
        notif: "Хабарландырулар",
        notifDesc: "Бағыттар туралы push",
        darkTheme: "Қараңғы тақырып",
        darkThemeDesc: "Зарядты үнемдеңіз",
        premiumTitle: "Premium жазылым",
        premiumDesc: "AI-ұсыныстар, эксклюзивті бағыттар, жарнамасыз",
        premiumPerMonth: "/ ай",
        premiumF1: "Шектеусіз AI-бағыттар",
        premiumF2: "Барлық өңірлердің офлайн карталары",
        premiumF3: "Эксклюзивті жасырын орындар",
        premiumActive: "Белсендірілді ✓",

        filterAll: "Барлығы",
        filterNature: "Табиғат",
        filterCulture: "Мәдениет",
        filterFood: "Тағам",
        filterAdventure: "Шытырман",
        filterFamily: "Отбасы",

        days_one: "{n} күн",
        days_few: "{n} күн",
        days_many: "{n} күн",
        dayN: "{n}-күн",
        offlineSavedHint: "Бағыт құрылғыда сақталды, интернетсіз ашылады",
        sumMeasuredHint: "Қашықтық орындардың координаттары бойынша (жолға түзетумен)",
        sumEstimatedHint: "Шамамен: кейбір орындардың координаттары жоқ",
        showOnMap: "Картада көрсету",
        routeReset: "Демо-бағыт",
        routeClear: "Тазалау",
        routeClearConfirm: "Бағыттың барлық нүктелерін өшіру керек пе?",
        moveUp: "Жоғары жылжыту",
        moveDown: "Төмен жылжыту",
        remove: "Өшіру",

        mapRoute: "Бағыт",
        mapAllPlaces: "Барлық орындар",
        mapStop: "Аялдама",

        nearbyFromYou: "сізден",

        aiEyebrow: "AI-жоспарлаушы",
        aiModalTitle: "Бағыт құру",
        aiInterests: "Қызығушылықтар",
        aiDuration: "Ұзақтығы",
        aiBudget: "Бюджет",
        aiGenerate: "Жасау",
        aiGenerating: "Бағыт жасалуда...",
        aiSlowHint: "Алғашқы сұраныс 30 секундқа дейін созылуы мүмкін",
        aiErrEmpty: "Сервер бос бағыт қайтарды",
        aiErrUnavailable: "AI қызметі уақытша қолжетімсіз",
        aiErrNetwork: "Сервермен байланыс жоқ. Интернетті тексеріңіз.",
        aiErrGeneric: "Қате шықты. Қайталап көріңіз.",
        close: "Жабу",
        tagNature: "Табиғат",
        tagHistory: "Тарих",
        tagCulture: "Мәдениет",
        tagFood: "Тағам",
        tagMountains: "Таулар",
        tagLakes: "Көлдер",
        dur1: "1 күн",
        dur2: "2 күн",
        dur3: "3 күн",
        dur7: "Апта",
        budgetLow: "20 мың ₸ дейін",
        budgetMid: "20–50 мың ₸",
        budgetHigh: "50 мың ₸ бастап",
    },

    ENG: {
        hello: "Hello!",
        whereTo: "Where to?",
        searchPlaceholder: "Search places and attractions...",
        searchEmpty: "Nothing found",
        noResults: "No results",

        navHome: "Home",
        navMap: "Map",
        navRoute: "Route",
        navFav: "Favorites",
        navProfile: "Profile",

        popular: "Popular destinations",
        nearby: "Near you",
        seeAll: "All",
        aiTitle: "Generate AI route",
        aiSubtitle: "Smart planner will pick the perfect path",
        reviews: "reviews",

        mapEyebrow: "Places map",
        mapTitle: "Kazakhstan on map",
        mapHint: "Tap a marker",
        mapOpen: "Open place",

        verified: "Sapar verified",
        openNow: "Open now",
        hours: "09:00 – 18:00 · Daily",
        about: "About this place",
        aboutText: "One of the most popular destinations in Kazakhstan. Here you'll find a unique blend of natural beauty, rich history, and the hospitality of locals. A perfect spot for family vacations and cultural enrichment.",
        safetySection: "Safety & accessibility",
        safetyKids: "Kid-friendly",
        safetyAccessible: "Accessible",
        safetySafe: "Safe",
        safetyConnection: "Connection available",
        addToRoute: "Add to route",
        inRoute: "Added to route",

        routeEyebrow: "Your route",
        routeTitle: "Almaty region",
        routeDays: "1 day",
        offlineAvailable: "Available offline",
        routeEmpty: "Route is empty",
        routeEmptyHint: "Add places from the home screen",
        routeSummary: "Route summary",
        sumDistance: "Distance",
        sumTime: "Time",
        sumBudget: "Budget",

        favEyebrow: "Collection",
        favTitle: "Favorite places",
        favSavedOne: "place saved",
        favSavedMany: "places saved",
        favEmpty: "Nothing here yet",
        favEmptyHint: "Tap ♡ on any attraction to save it here",

        userName: "Aidar Kassymov",
        userSubtitle: "Traveler since 2024",
        language: "Interface language",
        privacy: "Privacy & data",
        privGeo: "Geolocation",
        privGeoDesc: "To find places near you",
        privAnalytics: "Analytics",
        privAnalyticsDesc: "Helps us improve the app",
        appSettings: "Settings",
        notif: "Notifications",
        notifDesc: "Push notifications for routes",
        darkTheme: "Dark theme",
        darkThemeDesc: "Save your battery",
        premiumTitle: "Premium subscription",
        premiumDesc: "AI recommendations, exclusive routes, ad-free",
        premiumPerMonth: "/ month",
        premiumF1: "Unlimited AI routes",
        premiumF2: "Offline maps of all regions",
        premiumF3: "Exclusive hidden places",
        premiumActive: "Activated ✓",

        filterAll: "All",
        filterNature: "Nature",
        filterCulture: "Culture",
        filterFood: "Food",
        filterAdventure: "Adventure",
        filterFamily: "Family",

        days_one: "{n} day",
        days_few: "{n} days",
        days_many: "{n} days",
        dayN: "Day {n}",
        offlineSavedHint: "The route is saved on this device and opens without internet",
        sumMeasuredHint: "Distance from place coordinates (adjusted for roads)",
        sumEstimatedHint: "Estimate: some places have no coordinates",
        showOnMap: "Show on map",
        routeReset: "Demo route",
        routeClear: "Clear",
        routeClearConfirm: "Remove all stops from the route?",
        moveUp: "Move up",
        moveDown: "Move down",
        remove: "Remove",

        mapRoute: "Route",
        mapAllPlaces: "All places",
        mapStop: "Stop",

        nearbyFromYou: "away",

        aiEyebrow: "AI planner",
        aiModalTitle: "Create a route",
        aiInterests: "Interests",
        aiDuration: "Duration",
        aiBudget: "Budget",
        aiGenerate: "Generate",
        aiGenerating: "Generating route...",
        aiSlowHint: "The first request may take up to 30 seconds",
        aiErrEmpty: "The server returned an empty route",
        aiErrUnavailable: "AI service is temporarily unavailable",
        aiErrNetwork: "Can't reach the server. Check your connection.",
        aiErrGeneric: "Generation failed. Please try again.",
        close: "Close",
        tagNature: "Nature",
        tagHistory: "History",
        tagCulture: "Culture",
        tagFood: "Food",
        tagMountains: "Mountains",
        tagLakes: "Lakes",
        dur1: "1 day",
        dur2: "2 days",
        dur3: "3 days",
        dur7: "Week",
        budgetLow: "Under 20k ₸",
        budgetMid: "20–50k ₸",
        budgetHigh: "Over 50k ₸",
    },
};

export const LANGS = ["РУС", "ҚАЗ", "ENG"];

/** Форма множественного числа: one / few / many (правила для русского; для ENG/ҚАЗ — one/many). */
function pluralForm(lang, n) {
    const abs = Math.abs(n);
    if (lang !== "РУС") return abs === 1 ? "one" : "many";
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod10 === 1 && mod100 !== 11) return "one";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
    return "many";
}

const LanguageContext = createContext(null);

function readStored() {
    try {
        const v = localStorage.getItem("sapar_lang");
        return LANGS.includes(v) ? v : "РУС";
    } catch {
        return "РУС";
    }
}

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(readStored);

    useEffect(() => {
        try {
            localStorage.setItem("sapar_lang", lang);
        } catch {
            /* приватный режим — игнорируем */
        }
    }, [lang]);

    const t = (key) => dict[lang]?.[key] ?? dict.РУС[key] ?? key;

    /** Перевод с числом и правильной формой множественного числа: tn("days", 3) → "3 дня". */
    const tn = (key, n) => t(`${key}_${pluralForm(lang, n)}`).replace("{n}", n);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, tn }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) return { lang: "РУС", setLang: () => {}, t: (k) => k, tn: (k, n) => `${n}` };
    return ctx;
}

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
    },
};

export const LANGS = ["РУС", "ҚАЗ", "ENG"];

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

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) return { lang: "РУС", setLang: () => {}, t: (k) => k };
    return ctx;
}

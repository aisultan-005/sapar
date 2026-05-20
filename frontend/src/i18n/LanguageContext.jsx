import { createContext, useContext, useEffect, useState } from "react";

// Словари переводов. Ключи одинаковы для всех языков.
const dict = {
    РУС: {
        hello: "Сәлем!",
        whereTo: "Куда отправимся?",
        searchPlaceholder: "Поиск мест и достопримечательностей...",
        navHome: "Главная",
        navMap: "Карта",
        navRoute: "Маршрут",
        navFav: "Избранное",
        navProfile: "Профиль",
        popular: "Популярные направления",
        nearby: "Рядом с вами",
        seeAll: "Все",
        aiTitle: "Сгенерировать AI-маршрут",
        aiSubtitle: "Умный планировщик подберёт идеальный путь",
        favEmpty: "Здесь пока пусто. Добавляйте места в избранное!",
        language: "Язык",
        // Карта
        mapEyebrow: "Карта мест",
        mapTitle: "Казахстан на карте",
        mapHint: "Нажмите маркер",
        mapOpen: "Открыть место",
    },
    ҚАЗ: {
        hello: "Сәлем!",
        whereTo: "Қайда барамыз?",
        searchPlaceholder: "Орындар мен көрікті жерлерді іздеу...",
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
        favEmpty: "Әзірге бос. Орындарды таңдаулыға қосыңыз!",
        language: "Тіл",
        // Карта
        mapEyebrow: "Орындар картасы",
        mapTitle: "Қазақстан картада",
        mapHint: "Маркерді басыңыз",
        mapOpen: "Орынды ашу",
    },
    ENG: {
        hello: "Hello!",
        whereTo: "Where to?",
        searchPlaceholder: "Search places and attractions...",
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
        favEmpty: "Nothing here yet. Add places to favorites!",
        language: "Language",
        // Карта
        mapEyebrow: "Places map",
        mapTitle: "Kazakhstan on map",
        mapHint: "Tap a marker",
        mapOpen: "Open place",
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

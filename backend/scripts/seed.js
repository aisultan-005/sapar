import "../src/config/env.js";
import { connectDB, disconnectDB } from "../src/config/mongo.connector.js";
import Location from "../src/models/Location.model.js";
import User from "../src/models/User.model.js";
import Itinerary from "../src/models/Itinerary.model.js";

const reset = process.argv.includes("--reset");

const locationDocs = [
    {
        name: "Алматы",
        subtitle: "Город у гор",
        rating: 4.8,
        reviews: 2340,
        img: "almaty",
        tags: ["Природа", "Еда", "Горы"],
        color: "#3B82F6",
        coords: { lat: 43.222, lon: 76.8512 },
    },
    {
        name: "Астана",
        subtitle: "Столица будущего",
        rating: 4.7,
        reviews: 1890,
        img: "astana",
        tags: ["Архитектура", "Семья"],
        color: "#8B5CF6",
        coords: { lat: 51.1694, lon: 71.4491 },
    },
    {
        name: "Туркестан",
        subtitle: "Духовная столица",
        rating: 4.9,
        reviews: 1450,
        img: "turkestan",
        tags: ["История", "Культура"],
        color: "#D97706",
        coords: { lat: 43.2973, lon: 68.2517 },
    },
    {
        name: "Бурабай",
        subtitle: "Казахская Швейцария",
        rating: 4.6,
        reviews: 980,
        img: "burabay",
        tags: ["Природа", "Озера"],
        color: "#059669",
        coords: { lat: 53.0848, lon: 70.3076 },
    },
    {
        name: "Медеу",
        subtitle: "Каток высокогорный",
        rating: 4.7,
        reviews: 500,
        img: "almaty",
        tags: ["Природа", "Спорт"],
        color: "#3b82f6",
        coords: { lat: 43.1696, lon: 77.0547 },
    },
    {
        name: "Кок-Тобе",
        subtitle: "Смотровая площадка",
        rating: 4.5,
        reviews: 430,
        img: "almaty",
        tags: ["Природа", "Семья"],
        color: "#10b981",
        coords: { lat: 43.2356, lon: 76.9786 },
    },
];

const demoItineraryItems = [
    { time: "08:00", title: "Завтрак в Kaganat", subtitle: "Национальная кухня", duration: "1ч", icon: "food" },
    { time: "10:00", title: "Чарынский каньон", subtitle: "Гранд-Каньон Казахстана", duration: "3ч", icon: "nature" },
    { time: "13:00", title: "Обед у реки Чарын", subtitle: "Пикник с видом", duration: "1ч", icon: "food" },
    { time: "15:00", title: "Кольсайские озёра", subtitle: "Жемчужины Тянь-Шаня", duration: "3ч", icon: "nature" },
    { time: "19:00", title: "Юрточный лагерь", subtitle: "Ночёвка под звёздами", duration: "—", icon: "stay" },
];

async function main() {
    await connectDB();

    const locCount = await Location.countDocuments();
    if (locCount > 0 && !reset) {
        console.log(
            "В базе уже есть данные. В Compass обновите список коллекций.\n" +
                "Чтобы очистить и залить заново: npm run seed -- --reset"
        );
        await disconnectDB();
        return;
    }

    if (reset) {
        await Promise.all([
            Location.deleteMany({}),
            User.deleteMany({}),
            Itinerary.deleteMany({}),
        ]);
        console.log("Старые данные удалены (--reset).");
    }

    const locations = await Location.insertMany(locationDocs);
    console.log(`Создано локаций: ${locations.length}`);

    const user = await User.create({
        name: "Демо-пользователь",
        email: "demo@sapar.local",
        password: "demo123",
        lang: "РУС",
        isPremium: false,
    });
    console.log(`Создан пользователь: ${user.email} (пароль для локальной разработки: demo123)`);

    const firstLoc = locations[0];
    const itemsWithRef = demoItineraryItems.map((item, i) =>
        i === 0 ? { ...item, locId: firstLoc._id } : item
    );

    await Itinerary.create({
        userId: user._id,
        title: "Тур выходного дня — Алматы",
        region: "Алматы",
        days: 1,
        items: itemsWithRef,
        budget: 15000,
        distance: 120,
        isAI: false,
    });
    console.log("Создан пример маршрута (itineraries).");

    console.log("\nВ MongoDB Compass: база sapar → коллекции locations, users, itineraries.");
    await disconnectDB();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

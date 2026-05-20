import { useState } from "react";
import { defaultItinerary } from "../data/locations";

const DEFAULT_TITLE = "Алматинская область";

export const useItinerary = () => {
    const [items, setItems] = useState(defaultItinerary);
    const [title, setTitle] = useState(DEFAULT_TITLE);

    const routeLocationIds = new Set(
        items.filter((it) => it.locId).map((it) => it.locId)
    );

    const addToRoute = (loc) => {
        setItems((prev) => {
            const ids = new Set(prev.filter((it) => it.locId).map((it) => it.locId));
            if (ids.has(loc.id)) return prev;
            const lastItem = prev[prev.length - 1];
            const lastHour = lastItem ? parseInt(lastItem.time.split(":")[0], 10) + 1 : 9;
            const newTime = `${String(lastHour).padStart(2, "0")}:00`;
            return [
                ...prev,
                {
                    id: Date.now(),
                    locId: loc.id,
                    time: newTime,
                    title: loc.name,
                    subtitle: loc.subtitle,
                    duration: "2ч",
                    icon: "added",
                },
            ];
        });
    };

    const removeFromRoute = (itemId) => {
        setItems((prev) => prev.filter((it) => it.id !== itemId));
    };

    const reorderItems = (newItems) => setItems(newItems);

    /**
     * Полная замена маршрута. Принимает результат AI:
     * { title, items, isAI } — title и items обновятся вместе.
     */
    const replaceItems = (data) => {
        // Поддерживаем 2 формы вызова: replaceItems({ title, items }) или replaceItems(arrayOfItems)
        const newItems = Array.isArray(data) ? data : data?.items;
        const newTitle = !Array.isArray(data) ? data?.title : null;

        if (!Array.isArray(newItems)) return;
        const stamped = newItems.map((it, i) => ({
            ...it,
            id: it.id || Date.now() + i,
        }));
        setItems(stamped);
        if (newTitle && typeof newTitle === "string") {
            setTitle(newTitle);
        }
    };

    return {
        items,
        title,
        routeLocationIds,
        addToRoute,
        removeFromRoute,
        reorderItems,
        replaceItems,
    };
};

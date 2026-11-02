import { useEffect, useMemo, useState } from "react";
import { defaultItinerary } from "../data/locations";
import { enrichItem } from "../lib/geo";
import { nextSlot } from "../lib/route";

const STORAGE_KEY = "sapar_itinerary";
const STORAGE_VERSION = 2;

const stamp = (items) =>
    items.map((it, i) => enrichItem({ ...it, id: it.id ?? Date.now() + i }));

/** Читаем сохранённый маршрут; title=null → показываем локализованный заголовок по умолчанию. */
function readStored() {
    const fallback = { title: null, items: defaultItinerary };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return fallback;
        const data = JSON.parse(raw);
        if (data?.v !== STORAGE_VERSION || !Array.isArray(data.items)) return fallback;
        return {
            title: typeof data.title === "string" ? data.title : null,
            items: stamp(data.items),
        };
    } catch {
        return fallback;
    }
}

export const useItinerary = () => {
    const [state, setState] = useState(readStored);
    const { items, title } = state;

    // Маршрут сохраняется в браузере — доступен без сети и после перезагрузки.
    useEffect(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ v: STORAGE_VERSION, title, items })
            );
        } catch {
            /* приватный режим — игнорируем */
        }
    }, [title, items]);

    const routeLocationIds = useMemo(
        () => new Set(items.filter((it) => it.locId != null).map((it) => it.locId)),
        [items]
    );

    const setItems = (updater) =>
        setState((prev) => ({
            ...prev,
            items: typeof updater === "function" ? updater(prev.items) : updater,
        }));

    const addToRoute = (loc) => {
        setItems((prev) => {
            if (prev.some((it) => it.locId === loc.id)) return prev;
            const { time, day } = nextSlot(prev);
            return [
                ...prev,
                {
                    id: Date.now(),
                    locId: loc.id,
                    day,
                    time,
                    title: loc.name,
                    subtitle: loc.subtitle,
                    duration: "2ч",
                    icon: "added",
                    coords: loc.coords,
                },
            ];
        });
    };

    const removeFromRoute = (itemId) => {
        setItems((prev) => prev.filter((it) => it.id !== itemId));
    };

    const reorderItems = (newItems) => setItems(newItems);

    /**
     * Полная замена маршрута. Принимает результат AI { title, items, isAI }
     * или просто массив пунктов.
     */
    const replaceItems = (data) => {
        const newItems = Array.isArray(data) ? data : data?.items;
        if (!Array.isArray(newItems)) return;
        const newTitle = !Array.isArray(data) && typeof data?.title === "string" ? data.title : null;
        setState((prev) => ({
            title: newTitle ?? prev.title,
            items: stamp(newItems.map((it, i) => ({ ...it, id: it.id ?? Date.now() + i }))),
        }));
    };

    /** Возврат к демо-маршруту по умолчанию. */
    const resetRoute = () => setState({ title: null, items: defaultItinerary });

    /** Очистить маршрут полностью. */
    const clearRoute = () => setState({ title: null, items: [] });

    return {
        items,
        title,
        routeLocationIds,
        addToRoute,
        removeFromRoute,
        reorderItems,
        replaceItems,
        resetRoute,
        clearRoute,
    };
};

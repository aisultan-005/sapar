import { useState } from "react";
import { defaultItinerary } from "../data/locations";

export const useItinerary = () => {
    const [items, setItems] = useState(defaultItinerary);

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

    return {
        items,
        routeLocationIds,
        addToRoute,
        removeFromRoute,
        reorderItems,
    };
};

import { useEffect, useState } from "react";

/**
 * Текущие координаты пользователя [lat, lon] или null.
 * Запрашивает геолокацию только если enabled (настройка «Геолокация» в профиле).
 */
export const useGeolocation = (enabled) => {
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        if (!enabled || typeof navigator === "undefined" || !navigator.geolocation) {
            setCoords(null);
            return undefined;
        }
        let cancelled = false;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                if (!cancelled) setCoords([pos.coords.latitude, pos.coords.longitude]);
            },
            () => {
                /* отказ или ошибка — показываем расстояния по умолчанию */
            },
            { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 }
        );
        return () => {
            cancelled = true;
        };
    }, [enabled]);

    return coords;
};

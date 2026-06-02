import { useState, useEffect } from "react";

const defaultSettings = {
    lang: "РУС",
    geoEnabled: true,
    analyticsEnabled: false,
    darkMode: false,
    notifications: true,
};

// Читаем сохранённые настройки из браузера
const load = () => {
    try {
        return { ...defaultSettings, ...JSON.parse(localStorage.getItem("sapar_settings") || "{}") };
    } catch {
        return defaultSettings;
    }
};

export const useSettings = () => {
    const [settings, setSettings] = useState(load);

    // Сохраняем настройки и включаем/выключаем тёмную тему для всего приложения
    useEffect(() => {
        try {
            localStorage.setItem("sapar_settings", JSON.stringify(settings));
        } catch {
            /* ignore */
        }
        document.documentElement.classList.toggle("dark", !!settings.darkMode);
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return { settings, setSettings, updateSetting };
};

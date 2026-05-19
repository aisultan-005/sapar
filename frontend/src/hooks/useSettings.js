import { useState } from "react";

const defaultSettings = {
    lang: "РУС",
    geoEnabled: true,
    analyticsEnabled: false,
    darkMode: false,
    notifications: true,
};

export const useSettings = () => {
    const [settings, setSettings] = useState(defaultSettings);

    const updateSetting = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return { settings, setSettings, updateSetting };
};

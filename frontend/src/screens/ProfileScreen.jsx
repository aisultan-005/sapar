import { Languages, Lock, Bell, CreditCard, Check, Star } from "lucide-react";
import OrnamentPattern from "../components/ui/OrnamentPattern";
import ShanyrakIcon    from "../components/ui/ShanyrakIcon";
import Toggle          from "../components/ui/Toggle";
import ClerkProfileHeader from "../components/auth/ClerkProfileHeader";
import ProfileAccountClerk from "../components/auth/ProfileAccountClerk";
import { TEAL, TEAL_DARK, GOLD, SAND } from "../constants/theme";

import { showClerk } from "../constants/clerk";

const ProfileScreen = ({ settings, onSettingsChange }) => {
    const { lang, darkMode } = settings;

    const update = (key, val) =>
        onSettingsChange({ ...settings, [key]: val });

    return (
        <div className={`flex flex-col h-full bg-white ${darkMode ? "dark-mode" : ""}`}>
            {/* ── Header ── */}
            <div
                className="relative px-5 pt-5 pb-6"
                style={{
                    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                }}
            >
                <OrnamentPattern opacity={0.06} color="#fff" />
                {showClerk ? (
                    <ClerkProfileHeader />
                ) : (
                    <div className="relative z-10 flex items-center gap-4">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: 64,
                                height: 64,
                                background: "rgba(255,255,255,0.15)",
                            }}
                        >
                            <ShanyrakIcon size={36} color="rgba(255,255,255,0.9)" />
                        </div>
                        <div>
                            <h1
                                className="text-white text-lg font-bold"
                            >
                                Айдар Касымов
                            </h1>
                            <p className="text-xs mt-1" style={{ color: "#80e0eb" }}>
                                Путешественник с 2024
                            </p>
                            <div
                                className="flex items-center gap-1 mt-2 px-2 py-1"
                                style={{ background: `${GOLD}30` }}
                            >
                                <Star size={10} fill={GOLD} color={GOLD} />
                                <span className="font-semibold" style={{ fontSize: 10, color: GOLD }}>
                                    Premium
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Settings ── */}
            <div
                className={`flex-1 overflow-y-auto px-5 ${darkMode ? "dm-bg" : ""}`}
                style={{ marginTop: -12 }}
            >
                {/* Language */}
                <div
                    className={`p-4 mb-3 ${darkMode ? "dm-card" : "bg-white"}`}
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Languages size={16} color={TEAL} />
                        <span
                            className={`text-xs font-bold ${darkMode ? "dm-text" : "text-gray-700"}`}
                        >
              Язык интерфейса
            </span>
                    </div>
                    <div className="flex gap-2">
                        {["ҚАЗ", "РУС", "ENG"].map((l) => (
                            <button
                                key={l}
                                onClick={() => update("lang", l)}
                                className="flex-1 py-2 text-xs font-bold transition-all"
                                style={{
                                    background:
                                        lang === l
                                            ? TEAL
                                            : darkMode
                                                ? "#475569"
                                                : "#f1f5f9",
                                    color:
                                        lang === l
                                            ? "#fff"
                                            : darkMode
                                                ? "#e2e8f0"
                                                : "#64748b",
                                    boxShadow: lang === l ? `0 2px 8px ${TEAL}30` : "none",
                                }}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Privacy */}
                <div
                    className={`p-4 mb-3 ${darkMode ? "dm-card" : "bg-white"}`}
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Lock size={16} color={TEAL} />
                        <span
                            className={`text-xs font-bold ${darkMode ? "dm-text" : "text-gray-700"}`}
                        >
              Приватность и данные
            </span>
                    </div>
                    {[
                        {
                            label: "Геолокация",
                            desc: "Для поиска мест рядом",
                            key: "geoEnabled",
                        },
                        {
                            label: "Аналитика",
                            desc: "Помогает улучшать приложение",
                            key: "analyticsEnabled",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between py-2"
                            style={{
                                borderBottom:
                                    i < 1
                                        ? `1px solid ${darkMode ? "#475569" : "#f1f5f9"}`
                                        : "none",
                            }}
                        >
                            <div>
                                <p
                                    className={`text-sm font-medium ${
                                        darkMode ? "dm-text" : "text-gray-700"
                                    }`}
                                >
                                    {item.label}
                                </p>
                                <p
                                    style={{
                                        fontSize: 10,
                                        color: darkMode ? "#94a3b8" : "#9ca3af",
                                    }}
                                    className="mt-1"
                                >
                                    {item.desc}
                                </p>
                            </div>
                            <Toggle
                                value={settings[item.key]}
                                onChange={(v) => update(item.key, v)}
                                label={item.label}
                            />
                        </div>
                    ))}
                </div>

                {/* App Settings */}
                <div
                    className={`p-4 mb-3 ${darkMode ? "dm-card" : "bg-white"}`}
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Bell size={16} color={TEAL} />
                        <span
                            className={`text-xs font-bold ${darkMode ? "dm-text" : "text-gray-700"}`}
                        >
              Настройки
            </span>
                    </div>
                    {[
                        {
                            label: "Уведомления",
                            desc: "Push-уведомления о маршрутах",
                            key: "notifications",
                        },
                        {
                            label: "Тёмная тема",
                            desc: "Сберегите заряд батареи",
                            key: "darkMode",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between py-2"
                            style={{
                                borderBottom:
                                    i < 1
                                        ? `1px solid ${darkMode ? "#475569" : "#f1f5f9"}`
                                        : "none",
                            }}
                        >
                            <div>
                                <p
                                    className={`text-sm font-medium ${
                                        darkMode ? "dm-text" : "text-gray-700"
                                    }`}
                                >
                                    {item.label}
                                </p>
                                <p
                                    style={{
                                        fontSize: 10,
                                        color: darkMode ? "#94a3b8" : "#9ca3af",
                                    }}
                                    className="mt-1"
                                >
                                    {item.desc}
                                </p>
                            </div>
                            <Toggle
                                value={settings[item.key]}
                                onChange={(v) => update(item.key, v)}
                                label={item.label}
                            />
                        </div>
                    ))}
                </div>

                {/* Premium Card */}
                <div
                    className="relative overflow-hidden p-4 mb-4"
                    style={{ background: `linear-gradient(135deg, ${GOLD}15, ${SAND})` }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={16} color={GOLD} />
                        <span className="text-xs font-bold text-gray-700">
              Подписка Premium
            </span>
                    </div>
                    <p
                        style={{ fontSize: 11, color: "#6b7280" }}
                        className="mb-3"
                    >
                        AI-рекомендации, эксклюзивные маршруты, без рекламы
                    </p>
                    <div className="flex items-end gap-1 mb-3">
                        <span className="text-2xl font-bold text-gray-800">1 990 ₸</span>
                        <span className="text-xs mb-1" style={{ color: "#9ca3af" }}>
              / месяц
            </span>
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        {[
                            "AI-маршруты без ограничений",
                            "Офлайн-карты всех регионов",
                            "Эксклюзивные скрытые места",
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Check size={12} color={GOLD} />
                                <span style={{ fontSize: 11, color: "#4b5563" }}>{f}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        className="w-full py-2 text-white text-xs font-bold"
                        style={{
                            background: `linear-gradient(135deg, ${GOLD}, #b8860b)`,
                            boxShadow: `0 3px 12px ${GOLD}40`,
                        }}
                    >
                        Активировано ✓
                    </button>
                </div>

                {showClerk ? (
                    <ProfileAccountClerk darkMode={darkMode} />
                ) : (
                    <div
                        className={`p-4 mb-3 ${darkMode ? "dm-card" : "bg-white"}`}
                        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                    >
                        <p
                            className={`text-xs font-bold mb-2 ${darkMode ? "dm-text" : "text-gray-700"}`}
                        >
                            Аккаунт и выход
                        </p>
                        <p
                            className="text-sm mb-2"
                            style={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                        >
                            Сейчас отображается демо-профиль. Кнопки «Выйти» и регистрация через Clerk
                            появятся после настройки ключа Clerk.
                        </p>
                        <p
                            className="text-xs leading-relaxed"
                            style={{ color: darkMode ? "#64748b" : "#9ca3af" }}
                        >
                            Скопируйте <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] text-slate-800 dark:bg-slate-700 dark:text-slate-100">frontend/.env.example</code> в{" "}
                            <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] text-slate-800 dark:bg-slate-700 dark:text-slate-100">frontend/.env</code>, укажите{" "}
                            <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] text-slate-800 dark:bg-slate-700 dark:text-slate-100">VITE_CLERK_PUBLISHABLE_KEY</code> из{" "}
                            <a
                                href="https://dashboard.clerk.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold underline"
                                style={{ color: TEAL }}
                            >
                                Clerk Dashboard
                            </a>
                            , перезапустите dev-сервер.
                        </p>
                    </div>
                )}

                <div style={{ height: 16 }} />
            </div>
        </div>
    );
};

export default ProfileScreen;

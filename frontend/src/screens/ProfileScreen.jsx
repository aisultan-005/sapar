import { Languages, Lock, Bell, CreditCard, Check, Star } from "lucide-react";
import OrnamentPattern from "../components/ui/OrnamentPattern";
import ShanyrakIcon    from "../components/ui/ShanyrakIcon";
import Toggle          from "../components/ui/Toggle";
import ClerkProfileHeader from "../components/auth/ClerkProfileHeader";
import ProfileAccountClerk from "../components/auth/ProfileAccountClerk";
import { TEAL, TEAL_DARK, GOLD, SAND } from "../constants/theme";

import { showClerk } from "../constants/clerk";
import { useLang } from "../i18n/LanguageContext";

const ProfileScreen = ({ settings, onSettingsChange }) => {
    const { darkMode } = settings;
    const { lang, setLang, t } = useLang();

    const update = (key, val) =>
        onSettingsChange({ ...settings, [key]: val });

    return (
        <div
            className={`flex flex-col h-full ${darkMode ? "dark-mode" : ""}`}
            style={{ background: darkMode ? "#0f172a" : "#FAFAF7" }}
        >
            {/* ── Header ── */}
            <div
                className="relative px-5 pt-6 pb-10 rounded-b-3xl overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                }}
            >
                <OrnamentPattern opacity={0.08} color="#fff" />
                {showClerk ? (
                    <ClerkProfileHeader />
                ) : (
                    <div className="relative z-10 flex items-center gap-4">
                        <div
                            className="flex items-center justify-center rounded-2xl"
                            style={{
                                width: 72, height: 72,
                                background: "rgba(255,255,255,0.18)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <ShanyrakIcon size={40} color="rgba(255,255,255,0.95)" />
                        </div>
                        <div>
                            <h1 className="text-white text-xl font-bold font-display">
                                {t("userName")}
                            </h1>
                            <p className="text-xs mt-1" style={{ color: "#A5F3FC" }}>
                                {t("userSubtitle")}
                            </p>
                            <div
                                className="flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full"
                                style={{ background: `${GOLD}35` }}
                            >
                                <Star size={11} fill={GOLD} color={GOLD} />
                                <span className="font-bold" style={{ fontSize: 10, color: "#FBBF24" }}>
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
                style={{ marginTop: -20 }}
            >
                {/* Language */}
                <div
                    className={`p-4 mb-3 rounded-2xl ${darkMode ? "dm-card" : "bg-white"}`}
                    style={{ boxShadow: "0 4px 20px rgba(31,41,55,0.06)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Languages size={16} color={TEAL} />
                        <span
                            className={`text-sm font-bold ${darkMode ? "dm-text" : "text-ink"}`}
                        >
                            {t("language")}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {["ҚАЗ", "РУС", "ENG"].map((l) => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                className="flex-1 py-2.5 text-xs font-bold transition-all rounded-xl press-effect-soft"
                                style={{
                                    background:
                                        lang === l
                                            ? TEAL
                                            : darkMode
                                                ? "#334155"
                                                : "#F5F5F0",
                                    color:
                                        lang === l
                                            ? "#fff"
                                            : darkMode
                                                ? "#e2e8f0"
                                                : "#64748b",
                                    boxShadow: lang === l ? `0 4px 14px ${TEAL}40` : "none",
                                }}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Privacy */}
                <div
                    className={`p-4 mb-3 rounded-2xl ${darkMode ? "dm-card" : "bg-white"}`}
                    style={{ boxShadow: "0 4px 20px rgba(31,41,55,0.06)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Lock size={16} color={TEAL} />
                        <span
                            className={`text-sm font-bold ${darkMode ? "dm-text" : "text-ink"}`}
                        >
                            {t("privacy")}
                        </span>
                    </div>
                    {[
                        { label: t("privGeo"),       desc: t("privGeoDesc"),       key: "geoEnabled" },
                        { label: t("privAnalytics"), desc: t("privAnalyticsDesc"), key: "analyticsEnabled" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between py-2.5"
                            style={{
                                borderBottom: i < 1
                                    ? `1px solid ${darkMode ? "#334155" : "#F1F0EC"}`
                                    : "none",
                            }}
                        >
                            <div>
                                <p
                                    className={`text-sm font-semibold ${
                                        darkMode ? "dm-text" : "text-ink"
                                    }`}
                                >
                                    {item.label}
                                </p>
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: darkMode ? "#94a3b8" : "#9CA3AF",
                                    }}
                                    className="mt-0.5"
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
                    className={`p-4 mb-3 rounded-2xl ${darkMode ? "dm-card" : "bg-white"}`}
                    style={{ boxShadow: "0 4px 20px rgba(31,41,55,0.06)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Bell size={16} color={TEAL} />
                        <span
                            className={`text-sm font-bold ${darkMode ? "dm-text" : "text-ink"}`}
                        >
                            {t("appSettings")}
                        </span>
                    </div>
                    {[
                        { label: t("notif"),     desc: t("notifDesc"),     key: "notifications" },
                        { label: t("darkTheme"), desc: t("darkThemeDesc"), key: "darkMode" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between py-2.5"
                            style={{
                                borderBottom: i < 1
                                    ? `1px solid ${darkMode ? "#334155" : "#F1F0EC"}`
                                    : "none",
                            }}
                        >
                            <div>
                                <p
                                    className={`text-sm font-semibold ${
                                        darkMode ? "dm-text" : "text-ink"
                                    }`}
                                >
                                    {item.label}
                                </p>
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: darkMode ? "#94a3b8" : "#9CA3AF",
                                    }}
                                    className="mt-0.5"
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
                    className="relative overflow-hidden p-5 mb-4 rounded-2xl"
                    style={{
                        background: `linear-gradient(135deg, ${GOLD}25, ${SAND})`,
                        boxShadow: "0 6px 24px rgba(212, 168, 83, 0.18)",
                    }}
                >
                    <OrnamentPattern opacity={0.06} color={GOLD} />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard size={16} color={GOLD} />
                            <span className="text-sm font-bold text-ink font-display">
                                {t("premiumTitle")}
                            </span>
                        </div>
                        <p
                            style={{ fontSize: 12, color: "#6B7280" }}
                            className="mb-3"
                        >
                            {t("premiumDesc")}
                        </p>
                        <div className="flex items-end gap-1 mb-3">
                            <span className="text-3xl font-bold text-ink font-display">1 990 ₸</span>
                            <span className="text-xs mb-1.5" style={{ color: "#9CA3AF" }}>
                                {t("premiumPerMonth")}
                            </span>
                        </div>
                        <div className="mb-4 flex flex-col gap-1.5">
                            {[t("premiumF1"), t("premiumF2"), t("premiumF3")].map((f, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div
                                        className="flex items-center justify-center rounded-full"
                                        style={{ width: 16, height: 16, background: GOLD }}
                                    >
                                        <Check size={10} color="#fff" strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: 12, color: "#4B5563" }}>{f}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="w-full py-2.5 text-white text-xs font-bold rounded-xl"
                            style={{
                                background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
                                boxShadow: `0 4px 14px ${GOLD}50`,
                            }}
                        >
                            {t("premiumActive")}
                        </button>
                    </div>
                </div>

                {showClerk ? (
                    <ProfileAccountClerk darkMode={darkMode} />
                ) : (
                    <div
                        className={`p-4 mb-3 rounded-2xl ${darkMode ? "dm-card" : "bg-white"}`}
                        style={{ boxShadow: "0 4px 20px rgba(31,41,55,0.06)" }}
                    >
                        <p
                            className={`text-sm font-bold mb-2 ${darkMode ? "dm-text" : "text-ink"}`}
                        >
                            Аккаунт и выход
                        </p>
                        <p
                            className="text-sm mb-2"
                            style={{ color: darkMode ? "#94a3b8" : "#6B7280" }}
                        >
                            Сейчас отображается демо-профиль. Кнопки «Выйти» и регистрация через Clerk
                            появятся после настройки ключа Clerk.
                        </p>
                        <p
                            className="text-xs leading-relaxed"
                            style={{ color: darkMode ? "#64748b" : "#9CA3AF" }}
                        >
                            Скопируйте <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-800 dark:bg-slate-700 dark:text-slate-100">frontend/.env.example</code> в{" "}
                            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-800 dark:bg-slate-700 dark:text-slate-100">frontend/.env</code>, укажите{" "}
                            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-800 dark:bg-slate-700 dark:text-slate-100">VITE_CLERK_PUBLISHABLE_KEY</code> из{" "}
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

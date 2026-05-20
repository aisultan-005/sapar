import { Compass, Map, Route, Heart, User } from "lucide-react";
import { TEAL } from "../../constants/theme";
import { useLang } from "../../i18n/LanguageContext";

const BottomNavbar = ({ activeTab, onTabChange, likedCount }) => {
    const { t } = useLang();
    const tabs = [
        { icon: Compass, label: t("navHome") },
        { icon: Map,     label: t("navMap") },
        { icon: Route,   label: t("navRoute") },
        { icon: Heart,   label: t("navFav") },
        { icon: User,    label: t("navProfile") },
    ];
    // индекс таба «Избранное» (для бейджа) — теперь 3
    const FAV_INDEX = 3;

    return (
        <nav
            className="flex items-center justify-around px-2 bg-white"
            style={{
                paddingBottom: 28,
                paddingTop: 14,
                borderTop: "1px solid #F1F0EC",
                boxShadow: "0 -4px 20px rgba(31, 41, 55, 0.04)",
            }}
            aria-label="Основная навигация"
        >
            {tabs.map((tab, i) => {
                const Icon = tab.icon;
                const active = activeTab === i;
                const badge = i === FAV_INDEX && likedCount > 0;

                return (
                    <button
                        key={i}
                        onClick={() => onTabChange(i)}
                        className="flex flex-col items-center gap-1 py-1 px-2 relative press-effect"
                        aria-label={tab.label}
                        aria-current={active ? "page" : undefined}
                    >
                        <div
                            className="flex items-center justify-center transition-all relative rounded-full"
                            style={{
                                width: active ? 52 : 34,
                                height: 34,
                                background: active ? `${TEAL}15` : "transparent",
                            }}
                        >
                            <Icon
                                size={21}
                                color={active ? TEAL : "#94a3b8"}
                                fill={active && i === FAV_INDEX ? TEAL : "none"}
                                strokeWidth={active ? 2.4 : 1.8}
                            />
                            {badge && (
                                <div
                                    className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full"
                                    style={{
                                        width: 16, height: 16,
                                        background: "#C97B5A",
                                        fontSize: 9, color: "#fff", fontWeight: 700,
                                        border: "2px solid #fff",
                                    }}
                                >
                                    {likedCount}
                                </div>
                            )}
                        </div>
                        <span
                            className="font-medium"
                            style={{ fontSize: 10, color: active ? TEAL : "#94a3b8" }}
                        >
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNavbar;

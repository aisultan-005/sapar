import { Compass, Map, Heart, User } from "lucide-react";
import { TEAL } from "../../constants/theme";
import { useLang } from "../../i18n/LanguageContext";

const BottomNavbar = ({ activeTab, onTabChange, likedCount }) => {
    const { t } = useLang();
    const tabs = [
        { icon: Compass, label: t("navHome") },
        { icon: Map,     label: t("navRoute") },
        { icon: Heart,   label: t("navFav") },
        { icon: User,    label: t("navProfile") },
    ];
    return (
    <nav
        className="flex items-center justify-around px-4"
        style={{ paddingBottom: 40
            , paddingTop: 20, background: "#fff", borderTop: "1px solid #f1f5f9" }}
        aria-label="Основная навигация"
    >
        {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const active = activeTab === i;
            const badge = i === 2 && likedCount > 0;

            return (
                <button
                    key={i}
                    onClick={() => onTabChange(i)}
                    className="flex flex-col items-center gap-1 py-1 px-3 relative"
                    aria-label={tab.label}
                    aria-current={active ? "page" : undefined}
                >
                    <div
                        className="flex items-center justify-center transition-all relative"
                        style={{
                            width: 32,
                            height: 32,
                            background: active ? `${TEAL}12` : "transparent",
                            transform: active ? "scale(1.1)" : "scale(1)",
                        }}
                    >
                        <Icon
                            size={20}
                            color={active ? TEAL : "#94a3b8"}
                            fill={active && i === 2 ? TEAL : "none"}
                            strokeWidth={active ? 2.5 : 1.8}
                        />
                        {badge && (
                            <div
                                className="absolute -top-0.5 -right-0.5 flex items-center justify-center"
                                style={{ width: 14, height: 14, background: "#f87171", fontSize: 8, color: "#fff", fontWeight: 700 }}
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

import {
    ArrowLeft, Heart, BadgeCheck, Star, Clock,
    Baby, Accessibility, Shield, Phone, Plus, Check,
} from "lucide-react";
import ScenePlaceholder from "../components/ui/ScenePlaceholder";
import { TEAL, TEAL_DARK, GOLD } from "../constants/theme";
import { allLocations } from "../data/locations";

const POIScreen = ({
                       location,
                       onBack,
                       isLiked,
                       onToggleLike,
                       isInRoute,
                       onAddToRoute,
                   }) => {
    const loc = location || allLocations[2];

    return (
        <div className="flex flex-col h-full bg-white">
            {/* ── Hero Image ── */}
            <div className="relative">
                <ScenePlaceholder
                    type={loc.img || "turkestan"}
                    className="w-full"
                    style={{ height: 208 }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)",
                    }}
                />

                {/* Back */}
                <button
                    onClick={onBack}
                    className="press-effect absolute top-4 left-4 flex items-center justify-center"
                    style={{
                        width: 36, height: 36,
                        background: "rgba(0,0,0,0.2)",
                        backdropFilter: "blur(8px)",
                    }}
                    aria-label="Назад"
                >
                    <ArrowLeft size={18} color="#fff" />
                </button>

                {/* Like */}
                <button
                    onClick={() => onToggleLike(loc.id)}
                    className="press-effect absolute top-4 right-4 flex items-center justify-center"
                    style={{
                        width: 36, height: 36,
                        background: "rgba(0,0,0,0.2)",
                        backdropFilter: "blur(8px)",
                    }}
                    aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
                >
                    <Heart
                        size={18}
                        color={isLiked ? "#f87171" : "#fff"}
                        fill={isLiked ? "#f87171" : "none"}
                    />
                </button>

                {/* Title overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                        <BadgeCheck size={16} color={TEAL} />
                        <span
                            className="font-medium uppercase"
                            style={{ fontSize: 10, color: "#a5f3fc", letterSpacing: "0.1em" }}
                        >
              Проверено Sapar
            </span>
                    </div>
                    <h1
                        className="text-white text-2xl font-bold"
                    >
                        {loc.name}
                    </h1>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {loc.subtitle}
                    </p>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto">
                {/* Rating & Status */}
                <div className="px-5 pt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Star size={14} fill={GOLD} color={GOLD} />
                        <span className="font-bold text-sm text-gray-800">
              {loc.rating}
            </span>
                        <span className="text-xs" style={{ color: "#9ca3af" }}>
              ({loc.reviews} отзывов)
            </span>
                    </div>
                    <div
                        className="flex items-center gap-1 px-2 py-1"
                        style={{ background: "#dcfce7" }}
                    >
                        <div style={{ width: 6, height: 6, background: "#22c55e" }} />
                        <span
                            className="font-medium"
                            style={{ fontSize: 10, color: "#15803d" }}
                        >
              Открыто сейчас
            </span>
                    </div>
                </div>

                {/* Hours */}
                <div className="px-5 mt-3 flex items-center gap-2">
                    <Clock size={14} color="#9ca3af" />
                    <span className="text-xs" style={{ color: "#6b7280" }}>
            09:00 – 18:00 · Ежедневно
          </span>
                </div>

                {/* Tags */}
                <div className="px-5 mt-3 flex gap-2 flex-wrap">
                    {(loc.tags || ["История", "Культура"]).map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 font-medium"
                            style={{ fontSize: 10, background: `${TEAL}10`, color: TEAL }}
                        >
              {tag}
            </span>
                    ))}
                </div>

                {/* Description */}
                <div className="px-5 mt-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
                        Одно из самых популярных мест Казахстана. Здесь вы найдёте
                        уникальное сочетание природной красоты, богатой истории и
                        гостеприимства местных жителей. Идеальное место для семейного
                        отдыха и культурного обогащения.
                    </p>
                </div>

                {/* Safety & Accessibility */}
                <div className="px-5 mt-4">
                    <h3
                        className="text-xs font-bold text-gray-700 mb-2"
                    >
                        Безопасность и доступность
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { icon: Baby,          label: "Подходит для детей",   ok: true  },
                            { icon: Accessibility, label: "Для маломобильных",    ok: true  },
                            { icon: Shield,        label: "Безопасно",             ok: true  },
                            { icon: Phone,         label: "Связь доступна",        ok: false },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-2"
                                    style={{ background: item.ok ? "#f0fdf4" : "#fef2f2" }}
                                >
                                    <Icon size={14} color={item.ok ? "#16a34a" : "#f87171"} />
                                    <span
                                        className="font-medium"
                                        style={{
                                            fontSize: 11,
                                            color: item.ok ? "#166534" : "#991b1b",
                                        }}
                                    >
                    {item.label}
                  </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div className="px-5 mt-5 pb-4">
                    <button
                        onClick={() => !isInRoute && onAddToRoute(loc)}
                        className="press-effect w-full py-3 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                        style={{
                            background: isInRoute
                                ? "#16a34a"
                                : `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                            boxShadow: `0 4px 16px ${isInRoute ? "#16a34a" : TEAL}30`,
                        }}
                        aria-label={
                            isInRoute ? "Уже в маршруте" : "Добавить в маршрут"
                        }
                    >
                        {isInRoute ? (
                            <><Check size={18} /> Добавлено в маршрут</>
                        ) : (
                            <><Plus size={18} /> Добавить в маршрут</>
                        )}
                    </button>
                </div>
                <div style={{ height: 8 }} />
            </div>
        </div>
    );
};

export default POIScreen;

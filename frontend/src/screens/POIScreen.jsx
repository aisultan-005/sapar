import {
    ArrowLeft, Heart, BadgeCheck, Star, Clock,
    Baby, Accessibility, Shield, Phone, Plus, Check,
} from "lucide-react";
import ScenePlaceholder from "../components/ui/ScenePlaceholder";
import { TEAL, TEAL_DARK, GOLD, TERRA } from "../constants/theme";
import { allLocations } from "../data/locations";
import { useLang } from "../i18n/LanguageContext";

const POIScreen = ({
                       location,
                       onBack,
                       isLiked,
                       onToggleLike,
                       isInRoute,
                       onAddToRoute,
                   }) => {
    const { t } = useLang();
    const loc = location || allLocations[2];

    return (
        <div className="flex flex-col h-full" style={{ background: "#FAFAF7" }}>
            {/* ── Hero Image ── */}
            <div className="relative">
                <ScenePlaceholder
                    type={loc.img || "turkestan"}
                    className="w-full"
                    style={{ height: 280 }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.55) 100%)",
                    }}
                />

                {/* Back */}
                <button
                    onClick={onBack}
                    className="press-effect absolute top-4 left-4 flex items-center justify-center rounded-full"
                    style={{
                        width: 40, height: 40,
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    aria-label="Back"
                >
                    <ArrowLeft size={20} color="#1F2937" />
                </button>

                {/* Like */}
                <button
                    onClick={() => onToggleLike(loc.id)}
                    className="press-effect absolute top-4 right-4 flex items-center justify-center rounded-full"
                    style={{
                        width: 40, height: 40,
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    aria-label="Toggle favorite"
                >
                    <Heart
                        size={20}
                        color={isLiked ? TERRA : "#1F2937"}
                        fill={isLiked ? TERRA : "none"}
                    />
                </button>

                {/* Title overlay */}
                <div className="absolute bottom-5 left-5 right-5">
                    <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
                        style={{ background: "rgba(0, 165, 184, 0.95)" }}
                    >
                        <BadgeCheck size={13} color="#fff" />
                        <span
                            className="font-semibold uppercase text-white"
                            style={{ fontSize: 10, letterSpacing: "0.1em" }}
                        >
                            {t("verified")}
                        </span>
                    </div>
                    <h1 className="text-white text-3xl font-bold font-display leading-tight">
                        {loc.name}
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                        {loc.subtitle}
                    </p>
                </div>
            </div>

            {/* ── Content ── */}
            <div
                className="flex-1 overflow-y-auto rounded-t-3xl bg-white"
                style={{ marginTop: -20, paddingTop: 8, boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
            >
                {/* Rating & Status */}
                <div className="px-5 pt-5 flex items-center gap-3 flex-wrap">
                    <div
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                        style={{ background: "#FAF3E3" }}
                    >
                        <Star size={14} fill={GOLD} color={GOLD} />
                        <span className="font-bold text-sm text-ink">
                            {loc.rating}
                        </span>
                        <span className="text-xs" style={{ color: "#9CA3AF" }}>
                            ({loc.reviews})
                        </span>
                    </div>
                    <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ background: "#DCFCE7" }}
                    >
                        <div className="rounded-full" style={{ width: 6, height: 6, background: "#22c55e" }} />
                        <span className="font-semibold" style={{ fontSize: 11, color: "#15803d" }}>
                            {t("openNow")}
                        </span>
                    </div>
                </div>

                {/* Hours */}
                <div className="px-5 mt-3 flex items-center gap-2">
                    <Clock size={14} color="#9CA3AF" />
                    <span className="text-xs" style={{ color: "#6B7280" }}>
                        {t("hours")}
                    </span>
                </div>

                {/* Tags */}
                <div className="px-5 mt-4 flex gap-2 flex-wrap">
                    {(loc.tags || ["История", "Культура"]).map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 font-semibold rounded-full"
                            style={{ fontSize: 11, background: `${TEAL}12`, color: TEAL_DARK }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <div className="px-5 mt-5">
                    <h3 className="text-sm font-bold text-ink mb-2 font-display">
                        {t("about")}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
                        {t("aboutText")}
                    </p>
                </div>

                {/* Safety & Accessibility */}
                <div className="px-5 mt-5">
                    <h3 className="text-sm font-bold text-ink mb-3 font-display">
                        {t("safetySection")}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { icon: Baby,          label: t("safetyKids"),       ok: true  },
                            { icon: Accessibility, label: t("safetyAccessible"), ok: true  },
                            { icon: Shield,        label: t("safetySafe"),       ok: true  },
                            { icon: Phone,         label: t("safetyConnection"), ok: false },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-3 rounded-xl"
                                    style={{ background: item.ok ? "#F0FDF4" : "#FEF2F2" }}
                                >
                                    <Icon size={16} color={item.ok ? "#16a34a" : "#f87171"} />
                                    <span
                                        className="font-semibold"
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
                <div className="px-5 mt-6 pb-6">
                    <button
                        onClick={() => !isInRoute && onAddToRoute(loc)}
                        className="press-effect w-full py-3.5 text-white font-bold text-sm flex items-center justify-center gap-2 rounded-2xl transition-all"
                        style={{
                            background: isInRoute
                                ? "#16a34a"
                                : `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                            boxShadow: `0 8px 24px ${isInRoute ? "#16a34a" : TEAL}40`,
                        }}
                        aria-label={isInRoute ? t("inRoute") : t("addToRoute")}
                    >
                        {isInRoute ? (
                            <><Check size={18} /> {t("inRoute")}</>
                        ) : (
                            <><Plus size={18} /> {t("addToRoute")}</>
                        )}
                    </button>
                </div>
                <div style={{ height: 8 }} />
            </div>
        </div>
    );
};

export default POIScreen;

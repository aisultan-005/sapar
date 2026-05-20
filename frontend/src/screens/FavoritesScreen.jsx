import { Heart, Star } from "lucide-react";
import OrnamentPattern  from "../components/ui/OrnamentPattern";
import ScenePlaceholder from "../components/ui/ScenePlaceholder";
import { TEAL, TEAL_DARK, GOLD, TERRA } from "../constants/theme";
import { allLocations, nearbyPlaces } from "../data/locations";
import { useLang } from "../i18n/LanguageContext";

const allPlaces = [...allLocations, ...nearbyPlaces];

const FavoritesScreen = ({ likedIds, onLocationTap, onToggleLike }) => {
    const { t } = useLang();
    const likedPlaces = allPlaces.filter((p) => likedIds.has(p.id));

    return (
        <div className="flex flex-col h-full" style={{ background: "#FAFAF7" }}>
            {/* ── Header ── */}
            <div
                className="relative px-5 pt-6 pb-8 rounded-b-3xl overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                }}
            >
                <OrnamentPattern opacity={0.08} color="#fff" />
                <div className="relative z-10">
                    <p
                        className="text-xs tracking-wider uppercase font-medium"
                        style={{ color: "#A5F3FC", letterSpacing: "0.18em" }}
                    >
                        {t("favEyebrow")}
                    </p>
                    <h1 className="text-white text-2xl font-bold mt-1 font-display">
                        {t("favTitle")}
                    </h1>
                    {likedPlaces.length > 0 && (
                        <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                            {likedPlaces.length} {likedPlaces.length === 1 ? t("favSavedOne") : t("favSavedMany")}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto" style={{ marginTop: -16 }}>
                {likedPlaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-8 pt-20">
                        <div
                            className="flex items-center justify-center rounded-full mb-4"
                            style={{ width: 88, height: 88, background: "#FCEFE8" }}
                        >
                            <Heart size={40} color={TERRA} strokeWidth={1.8} />
                        </div>
                        <p className="text-base font-bold text-ink mb-1.5 font-display">
                            {t("favEmpty")}
                        </p>
                        <p className="text-xs text-center leading-relaxed" style={{ color: "#9CA3AF" }}>
                            {t("favEmptyHint")}
                        </p>
                    </div>
                ) : (
                    <div className="px-5 pt-5 pb-4">
                        {likedPlaces.map((loc) => (
                            <button
                                key={loc.id}
                                onClick={() => onLocationTap(loc)}
                                className="press-effect-soft w-full flex items-center gap-3 p-3 mb-2.5 rounded-2xl bg-white transition-all"
                                style={{
                                    boxShadow: "0 2px 12px rgba(31,41,55,0.05)",
                                    border: "1px solid #F1F0EC",
                                }}
                                aria-label={`Открыть ${loc.name}`}
                            >
                                <ScenePlaceholder
                                    type={loc.img}
                                    className="flex items-center justify-center rounded-xl overflow-hidden"
                                    style={{ width: 64, height: 64, flexShrink: 0 }}
                                />
                                <div className="flex-1 text-left min-w-0">
                                    <p className="font-bold text-sm text-ink truncate">
                                        {loc.name}
                                    </p>
                                    <p style={{ fontSize: 11, color: "#9CA3AF" }} className="mt-0.5 truncate">
                                        {loc.subtitle}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <Star size={11} fill={GOLD} color={GOLD} />
                                        <span
                                            style={{ fontSize: 11 }}
                                            className="font-semibold text-gray-700"
                                        >
                                            {loc.rating}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleLike(loc.id);
                                    }}
                                    className="flex items-center justify-center rounded-full press-effect"
                                    style={{
                                        width: 36, height: 36,
                                        background: "#FCEFE8",
                                        flexShrink: 0,
                                    }}
                                    aria-label={`Убрать ${loc.name} из избранного`}
                                >
                                    <Heart size={18} fill={TERRA} color={TERRA} />
                                </button>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesScreen;

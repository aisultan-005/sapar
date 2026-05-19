import { Heart, Star } from "lucide-react";
import OrnamentPattern  from "../components/ui/OrnamentPattern";
import ScenePlaceholder from "../components/ui/ScenePlaceholder";
import { TEAL, TEAL_DARK, GOLD } from "../constants/theme";
import { allLocations, nearbyPlaces } from "../data/locations";

const allPlaces = [...allLocations, ...nearbyPlaces];

const FavoritesScreen = ({ likedIds, onLocationTap, onToggleLike }) => {
    const likedPlaces = allPlaces.filter((p) => likedIds.has(p.id));

    return (
        <div className="flex flex-col h-full bg-white">
            {/* ── Header ── */}
            <div
                className="px-5 pt-5 pb-4"
                style={{
                    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                }}
            >
                <OrnamentPattern opacity={0.06} color="#fff" />
                <div className="relative z-10">
                    <p
                        className="text-xs tracking-wider uppercase"
                        style={{ color: "#80e0eb", letterSpacing: "0.12em" }}
                    >
                        Коллекция
                    </p>
                    <h1
                        className="text-white text-lg font-bold mt-1"
                    >
                        Избранные места
                    </h1>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto">
                {likedPlaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-8 pt-16">
                        <Heart size={48} color="#e5e7eb" style={{ marginBottom: 16 }} />
                        <p
                            className="text-sm font-bold text-gray-700 mb-1"
                        >
                            Пока пусто
                        </p>
                        <p className="text-xs text-center" style={{ color: "#9ca3af" }}>
                            Нажмите ♡ на любой достопримечательности, чтобы сохранить её здесь
                        </p>
                    </div>
                ) : (
                    <div className="px-5 pt-4 pb-4">
                        {likedPlaces.map((loc) => (
                            <button
                                key={loc.id}
                                onClick={() => onLocationTap(loc)}
                                className="press-effect-soft w-full flex items-center gap-3 p-3 mb-2"
                                style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
                                aria-label={`Открыть ${loc.name}`}
                            >
                                <ScenePlaceholder
                                    type={loc.img}
                                    className="flex items-center justify-center"
                                    style={{ width: 56, height: 56, flexShrink: 0 }}
                                />
                                <div className="flex-1 text-left min-w-0">
                                    <p className="font-bold text-sm text-gray-800 truncate">
                                        {loc.name}
                                    </p>
                                    <p style={{ fontSize: 11, color: "#9ca3af" }} className="mt-1">
                                        {loc.subtitle}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star size={10} fill={GOLD} color={GOLD} />
                                        <span
                                            style={{ fontSize: 11 }}
                                            className="font-semibold text-gray-600"
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
                                    className="flex items-center justify-center"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        background: "#fef2f2",
                                        flexShrink: 0,
                                    }}
                                    aria-label={`Убрать ${loc.name} из избранного`}
                                >
                                    <Heart size={16} fill="#f87171" color="#f87171" />
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

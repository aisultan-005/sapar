import { useState } from "react";
import { Search, X, Sparkles, ChevronRight, MapPin, Star } from "lucide-react";
import OrnamentPattern from "../components/ui/OrnamentPattern";
import ShanyrakIcon    from "../components/ui/ShanyrakIcon";
import ScenePlaceholder from "../components/ui/ScenePlaceholder";
import { TEAL, TEAL_DARK, GOLD } from "../constants/theme";
import { allLocations, nearbyPlaces } from "../data/locations";
import { filterDefs } from "../data/filters";

const DiscoveryScreen = ({
                             onLocationTap,
                             onAIRoute,
                             searchQuery,
                             onSearchChange,
                             activeFilter,
                             onFilterChange,
                         }) => {
    const [searchFocused, setSearchFocused] = useState(false);

    const filteredLocations = allLocations.filter((loc) => {
        const matchesSearch =
            !searchQuery ||
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        const filterTag =
            activeFilter !== null ? filterDefs[activeFilter]?.tag : null;
        const matchesFilter = !filterTag || loc.tags.includes(filterTag);
        return matchesSearch && matchesFilter;
    });

    const filteredNearby = nearbyPlaces.filter((p) => {
        const matchesSearch =
            !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const filterTag =
            activeFilter !== null ? filterDefs[activeFilter]?.tag : null;
        const matchesFilter = !filterTag || p.tags.includes(filterTag);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex flex-col h-full bg-white">
            {/* ── Header ── */}
            <div
                className="relative px-5 pt-5 pb-3"
                style={{
                    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                }}
            >
                <OrnamentPattern opacity={0.08} color="#fff" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p
                                className="text-xs tracking-wider uppercase"
                                style={{ color: "#80e0eb", letterSpacing: "0.15em" }}
                            >
                                Сәлем!
                            </p>
                            <h1
                                className="text-white text-xl font-bold mt-1"
                            >
                                Куда отправимся?
                            </h1>
                        </div>
                        <ShanyrakIcon size={32} color="rgba(255,255,255,0.9)" />
                    </div>

                    {/* Search */}
                    <div
                        className="flex items-center gap-2 px-4 py-3 transition-all duration-300"
                        style={{
                            background: searchFocused
                                ? "rgba(255,255,255,1)"
                                : "rgba(255,255,255,0.18)",
                            backdropFilter: "blur(10px)",
                            border: searchFocused
                                ? `2px solid ${GOLD}`
                                : "2px solid rgba(255,255,255,0.15)",
                        }}
                    >
                        <Search
                            size={18}
                            color={
                                searchFocused ? "#0d9488" : "rgba(255,255,255,0.7)"
                            }
                        />
                        <input
                            className="bg-transparent outline-none text-sm flex-1"
                            placeholder="Поиск мест и достопримечательностей..."
                            style={{
                                color: searchFocused
                                    ? "#1a1a1a"
                                    : "rgba(255,255,255,0.85)",
                            }}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            aria-label="Поиск мест"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                aria-label="Очистить поиск"
                            >
                                <X
                                    size={16}
                                    color={
                                        searchFocused
                                            ? "#9ca3af"
                                            : "rgba(255,255,255,0.6)"
                                    }
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* ── Filters ── */}
                <div className="px-5 pt-4 pb-2">
                    <div
                        className="flex gap-2 overflow-x-auto pb-1"
                        style={{ scrollbarWidth: "none" }}
                    >
                        {filterDefs.map((f, i) => {
                            const Icon = f.icon;
                            const active = activeFilter === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => onFilterChange(active ? null : i)}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200"
                                    style={{
                                        flexShrink: 0,
                                        background: active ? TEAL : "#f1f5f9",
                                        color: active ? "#fff" : "#475569",
                                        boxShadow: active ? `0 2px 8px ${TEAL}40` : "none",
                                    }}
                                    aria-label={`Фильтр: ${f.label}`}
                                    aria-pressed={active}
                                >
                                    <Icon size={13} />
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── AI Route Banner ── */}
                <div className="px-5 py-3">
                    <button
                        onClick={onAIRoute}
                        className="press-effect w-full relative overflow-hidden p-4 flex items-center gap-3"
                        style={{
                            background: `linear-gradient(135deg, ${TEAL} 0%, #0891b2 50%, ${TEAL_DARK} 100%)`,
                            boxShadow: `0 4px 20px ${TEAL}35`,
                        }}
                        aria-label="Сгенерировать AI-маршрут"
                    >
                        <OrnamentPattern opacity={0.06} color="#fff" />
                        <div
                            className="relative z-10 flex items-center justify-center"
                            style={{
                                width: 44,
                                height: 44,
                                background: "rgba(255,255,255,0.2)",
                            }}
                        >
                            <Sparkles size={22} color="#fff" />
                        </div>
                        <div className="relative z-10 flex-1 text-left">
                            <p
                                className="text-white font-bold text-sm"
                            >
                                Сгенерировать AI-маршрут
                            </p>
                            <p className="text-xs mt-1" style={{ color: "#a5f3fc" }}>
                                Умный планировщик подберёт идеальный путь
                            </p>
                        </div>
                        <ChevronRight
                            size={18}
                            color="rgba(255,255,255,0.6)"
                            className="relative z-10"
                        />
                    </button>
                </div>

                {/* ── Popular Locations ── */}
                <div className="px-5 pb-3">
                    <div className="flex items-center justify-between mb-3">
                        <h2
                            className="text-sm font-bold text-gray-800"
                        >
                            Популярные направления
                        </h2>
                        <button
                            className="text-xs font-medium"
                            style={{ color: TEAL }}
                            aria-label="Показать все направления"
                        >
                            Все →
                        </button>
                    </div>

                    {filteredLocations.length === 0 ? (
                        <div className="text-center py-8">
                            <Search
                                size={32}
                                color="#d1d5db"
                                style={{ margin: "0 auto 8px" }}
                            />
                            <p className="text-xs text-gray-400">Ничего не найдено</p>
                        </div>
                    ) : (
                        <div
                            className="flex gap-3 overflow-x-auto pb-2"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {filteredLocations.map((loc) => (
                                <button
                                    key={loc.id}
                                    onClick={() => onLocationTap(loc)}
                                    className="press-effect overflow-hidden"
                                    style={{
                                        flexShrink: 0,
                                        width: 155,
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                    }}
                                    aria-label={`${loc.name} — ${loc.subtitle}, рейтинг ${loc.rating}`}
                                >
                                    <ScenePlaceholder
                                        type={loc.img}
                                        className="w-full"
                                        style={{ height: 96 }}
                                    />
                                    <div className="p-3 bg-white">
                                        <p
                                            className="font-bold text-sm text-gray-800 text-left"
                                        >
                                            {loc.name}
                                        </p>
                                        <p
                                            className="text-left mt-1"
                                            style={{ fontSize: 10, color: "#9ca3af" }}
                                        >
                                            {loc.subtitle}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <Star size={11} fill={GOLD} color={GOLD} />
                                            <span
                                                className="font-semibold text-gray-700"
                                                style={{ fontSize: 11 }}
                                            >
                        {loc.rating}
                      </span>
                                            <span style={{ fontSize: 10, color: "#9ca3af" }}>
                        ({loc.reviews})
                      </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Nearby ── */}
                <div className="px-5 pb-4">
                    <h2
                        className="text-sm font-bold text-gray-800 mb-3"
                    >
                        Рядом с вами
                    </h2>
                    {filteredNearby.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">
                            Нет результатов
                        </p>
                    )}
                    {filteredNearby.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onLocationTap(item)}
                            className="press-effect-soft w-full flex items-center gap-3 p-3 mb-2 transition-all"
                            style={{ background: "#f8fafc" }}
                            aria-label={`${item.name}, ${item.dist}`}
                        >
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: 48,
                                    height: 48,
                                    background: `${item.color}15`,
                                }}
                            >
                                <MapPin size={20} color={item.color} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-sm text-gray-800">
                                    {item.name}
                                </p>
                                <p style={{ fontSize: 11, color: "#9ca3af" }}>
                                    {item.subtitle} · {item.dist}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star size={10} fill={GOLD} color={GOLD} />
                                <span className="text-xs font-medium text-gray-600">
                  {item.rating}
                </span>
                            </div>
                        </button>
                    ))}
                </div>
                <div style={{ height: 16 }} />
            </div>
        </div>
    );
};

export default DiscoveryScreen;

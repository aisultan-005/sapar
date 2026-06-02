import { useState } from "react";
import { Search, X, Sparkles, ChevronRight, MapPin, Star } from "lucide-react";
import OrnamentPattern from "../components/ui/OrnamentPattern";
import ShanyrakIcon    from "../components/ui/ShanyrakIcon";
import ScenePlaceholder from "../components/ui/ScenePlaceholder";
import { TEAL, TEAL_DARK, GOLD, TERRA } from "../constants/theme";
import { allLocations, nearbyPlaces } from "../data/locations";
import { filterDefs } from "../data/filters";
import { useLang } from "../i18n/LanguageContext";

const DiscoveryScreen = ({
                             onLocationTap,
                             onAIRoute,
                             searchQuery,
                             onSearchChange,
                             activeFilter,
                             onFilterChange,
                         }) => {
    const [searchFocused, setSearchFocused] = useState(false);
    const { t } = useLang();

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
        <div className="flex flex-col h-full" style={{ background: "#FAFAF7" }}>
            {/* ── Header ── */}
            <div
                className="relative px-5 pt-6 pb-8 rounded-b-3xl overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                }}
            >
                <OrnamentPattern opacity={0.09} color="#fff" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p
                                className="text-xs tracking-wider uppercase font-medium"
                                style={{ color: "#A5F3FC", letterSpacing: "0.18em" }}
                            >
                                {t("hello")}
                            </p>
                            <h1 className="text-white text-2xl font-bold mt-1 font-display">
                                {t("whereTo")}
                            </h1>
                        </div>
                        <div
                            className="flex items-center justify-center rounded-full"
                            style={{
                                width: 44, height: 44,
                                background: "rgba(255,255,255,0.15)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <ShanyrakIcon size={26} color="rgba(255,255,255,0.95)" />
                        </div>
                    </div>

                    {/* Search */}
                    <div
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300"
                        style={{
                            background: searchFocused
                                ? "rgba(255,255,255,1)"
                                : "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            border: searchFocused
                                ? `2px solid ${GOLD}`
                                : "2px solid rgba(255,255,255,0.18)",
                        }}
                    >
                        <Search
                            size={18}
                            color={searchFocused ? TEAL_DARK : "rgba(255,255,255,0.85)"}
                        />
                        <input
                            className="bg-transparent outline-none text-sm flex-1"
                            placeholder={t("searchPlaceholder")}
                            style={{
                                color: searchFocused ? "#1F2937" : "rgba(255,255,255,0.95)",
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
                                className="rounded-full p-1"
                            >
                                <X
                                    size={16}
                                    color={searchFocused ? "#9ca3af" : "rgba(255,255,255,0.7)"}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ marginTop: -16 }}>
                {/* ── Filters ── */}
                <div className="px-5 pt-5 pb-3">
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
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 press-effect-soft"
                                    style={{
                                        flexShrink: 0,
                                        background: active ? TEAL : "#fff",
                                        color: active ? "#fff" : "#475569",
                                        boxShadow: active
                                            ? `0 4px 14px ${TEAL}45`
                                            : "0 2px 8px rgba(31,41,55,0.05)",
                                        border: active ? "none" : "1px solid #F1F0EC",
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
                        className="press-effect w-full relative overflow-hidden p-4 flex items-center gap-3 rounded-2xl"
                        style={{
                            background: `linear-gradient(135deg, ${TEAL} 0%, #0891b2 50%, ${TEAL_DARK} 100%)`,
                            boxShadow: `0 8px 24px ${TEAL}40`,
                        }}
                        aria-label="Сгенерировать AI-маршрут"
                    >
                        <OrnamentPattern opacity={0.08} color="#fff" />
                        <div
                            className="relative z-10 flex items-center justify-center rounded-2xl"
                            style={{
                                width: 48, height: 48,
                                background: "rgba(255,255,255,0.22)",
                            }}
                        >
                            <Sparkles size={24} color="#fff" />
                        </div>
                        <div className="relative z-10 flex-1 text-left">
                            <p className="text-white font-bold text-sm font-display">
                                {t("aiTitle")}
                            </p>
                            <p className="text-xs mt-1" style={{ color: "#A5F3FC" }}>
                                {t("aiSubtitle")}
                            </p>
                        </div>
                        <ChevronRight
                            size={20}
                            color="rgba(255,255,255,0.7)"
                            className="relative z-10"
                        />
                    </button>
                </div>

                {/* ── Popular Locations ── */}
                <div className="px-5 pt-2 pb-3">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-ink font-display">
                            {t("popular")}
                        </h2>
                        <button
                            className="text-xs font-semibold"
                            style={{ color: TEAL }}
                            aria-label="Показать все направления"
                        >
                            {t("seeAll")} →
                        </button>
                    </div>

                    {filteredLocations.length === 0 ? (
                        <div className="text-center py-10">
                            <Search size={32} color="#d1d5db" style={{ margin: "0 auto 8px" }} />
                            <p className="text-xs text-gray-400">{t("searchEmpty")}</p>
                        </div>
                    ) : (
                        <div
                            className="flex gap-3 overflow-x-auto pb-2 stagger-in"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {filteredLocations.map((loc) => (
                                <button
                                    key={loc.id}
                                    onClick={() => onLocationTap(loc)}
                                    className="press-effect overflow-hidden rounded-2xl bg-white"
                                    style={{
                                        flexShrink: 0,
                                        width: 168,
                                        boxShadow: "0 4px 20px rgba(31,41,55,0.07)",
                                    }}
                                    aria-label={`${loc.name} — ${loc.subtitle}, рейтинг ${loc.rating}`}
                                >
                                    <ScenePlaceholder
                                        type={loc.img}
                                        className="w-full"
                                        style={{ height: 110 }}
                                    />
                                    <div className="p-3 bg-white">
                                        <p className="font-bold text-sm text-ink text-left">
                                            {loc.name}
                                        </p>
                                        <p
                                            className="text-left mt-0.5"
                                            style={{ fontSize: 11, color: "#9CA3AF" }}
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
                                            <span style={{ fontSize: 10, color: "#9CA3AF" }}>
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
                    <h2 className="text-base font-bold text-ink mb-3 font-display">
                        {t("nearby")}
                    </h2>
                    {filteredNearby.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">
                            {t("noResults")}
                        </p>
                    )}
                    {filteredNearby.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onLocationTap(item)}
                            className="press-effect-soft w-full flex items-center gap-3 p-3 mb-2.5 rounded-2xl bg-white transition-all"
                            style={{
                                boxShadow: "0 2px 12px rgba(31,41,55,0.05)",
                                border: "1px solid #F1F0EC",
                            }}
                            aria-label={`${item.name}, ${item.dist}`}
                        >
                            <div
                                className="flex items-center justify-center rounded-xl"
                                style={{
                                    width: 52, height: 52,
                                    background: `${item.color}18`,
                                }}
                            >
                                <MapPin size={22} color={item.color} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-sm text-ink">
                                    {item.name}
                                </p>
                                <p style={{ fontSize: 11, color: "#9CA3AF" }} className="mt-0.5">
                                    {item.subtitle} · {item.dist}
                                </p>
                            </div>
                            <div
                                className="flex items-center gap-1 px-2 py-1 rounded-full"
                                style={{ background: "#FAF3E3" }}
                            >
                                <Star size={10} fill={GOLD} color={GOLD} />
                                <span className="text-xs font-semibold text-gray-700">
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

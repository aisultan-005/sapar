import { ChevronUp, ChevronDown, Map, Trash2, Wifi, WifiOff } from "lucide-react";
import OrnamentPattern from "../components/ui/OrnamentPattern";
import ShanyrakIcon    from "../components/ui/ShanyrakIcon";
import { TEAL, TEAL_DARK, GOLD, WARM } from "../constants/theme";

const iconMap = { food: "🍽️", nature: "🏔️", stay: "🏕️", added: "📍" };

const ItineraryScreen = ({
                             items,
                             onItemsChange,
                             offlineMode,
                             onOfflineModeChange,
                             onRemoveItem,
                         }) => {
    const moveItem = (index, dir) => {
        const newItems = [...items];
        const target = index + dir;
        if (target < 0 || target >= newItems.length) return;
        [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
        onItemsChange(newItems);
    };

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
                    <div className="flex items-center justify-between">
                        <div>
                            <p
                                className="text-xs tracking-wider uppercase font-medium"
                                style={{ color: "#A5F3FC", letterSpacing: "0.18em" }}
                            >
                                Ваш маршрут
                            </p>
                            <h1 className="text-white text-2xl font-bold mt-1 font-display">
                                Алматинская область
                            </h1>
                        </div>
                        <div
                            className="px-3 py-1.5 text-xs font-semibold rounded-full"
                            style={{ background: "rgba(255,255,255,0.22)", color: "#fff" }}
                        >
                            1 день
                        </div>
                    </div>

                    {/* Offline Toggle */}
                    <div
                        className="flex items-center justify-between mt-5 px-4 py-2.5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                        <div className="flex items-center gap-2">
                            {offlineMode ? (
                                <WifiOff size={16} color="rgba(255,255,255,0.9)" />
                            ) : (
                                <Wifi size={16} color="rgba(255,255,255,0.9)" />
                            )}
                            <span
                                className="text-xs font-semibold"
                                style={{ color: "rgba(255,255,255,0.95)" }}
                            >
                                Доступно офлайн
                            </span>
                        </div>
                        <button
                            onClick={() => onOfflineModeChange(!offlineMode)}
                            className="transition-all duration-300 relative rounded-full"
                            style={{
                                background: offlineMode ? GOLD : "rgba(255,255,255,0.28)",
                                padding: 2,
                                width: 44,
                                height: 24,
                            }}
                            role="switch"
                            aria-checked={offlineMode}
                            aria-label="Офлайн режим"
                        >
                            <div
                                className="bg-white shadow-md rounded-full transition-transform duration-300"
                                style={{
                                    width: 20,
                                    height: 20,
                                    transform: offlineMode ? "translateX(20px)" : "translateX(0)",
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Timeline ── */}
            <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4" style={{ marginTop: -16 }}>
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div
                            className="flex items-center justify-center rounded-full mb-4"
                            style={{ width: 88, height: 88, background: `${TEAL}15` }}
                        >
                            <Map size={40} color={TEAL} strokeWidth={1.8} />
                        </div>
                        <p className="text-base font-bold text-ink mb-1.5 font-display">
                            Маршрут пуст
                        </p>
                        <p className="text-xs text-center text-gray-400">
                            Добавляйте места с главного экрана
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        {items.map((item, i) => (
                            <div
                                key={item.id}
                                className="flex gap-3 mb-1"
                                style={{
                                    animation: `fadeSlideIn 0.3s ease ${i * 0.06}s both`,
                                }}
                            >
                                {/* Time + dot */}
                                <div
                                    className="flex flex-col items-center"
                                    style={{ width: 44 }}
                                >
                                    <span
                                        className="font-bold"
                                        style={{ fontSize: 11, color: TEAL_DARK }}
                                    >
                                        {item.time}
                                    </span>
                                    <div
                                        className="mt-2 rounded-full"
                                        style={{
                                            width: 12,
                                            height: 12,
                                            border: `2px solid ${TEAL}`,
                                            background: i === 0 ? TEAL : "#fff",
                                            boxShadow: i === 0 ? `0 0 0 4px ${TEAL}25` : "none",
                                        }}
                                    />
                                    {i < items.length - 1 && (
                                        <div
                                            className="flex-1 mt-1"
                                            style={{ width: 2, background: `${TEAL}25`, borderRadius: 2 }}
                                        />
                                    )}
                                </div>

                                {/* Card */}
                                <div
                                    className="flex-1 p-3 mb-2.5 flex items-center gap-3 rounded-2xl bg-white"
                                    style={{
                                        boxShadow: "0 2px 12px rgba(31,41,55,0.05)",
                                        border: "1px solid #F1F0EC",
                                    }}
                                >
                                    <div
                                        className="flex items-center justify-center rounded-xl text-2xl"
                                        style={{ width: 44, height: 44, background: "#FAF3E3" }}
                                    >
                                        {iconMap[item.icon] || "📍"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-ink truncate">
                                            {item.title}
                                        </p>
                                        <p
                                            className="mt-0.5"
                                            style={{ fontSize: 11, color: "#9CA3AF" }}
                                        >
                                            {item.subtitle} · {item.duration}
                                        </p>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveItem(i, -1)}
                                            className="flex items-center justify-center rounded-lg"
                                            style={{
                                                width: 26, height: 26,
                                                background: i > 0 ? `${TEAL}12` : "transparent",
                                            }}
                                            aria-label="Переместить вверх"
                                            disabled={i === 0}
                                        >
                                            <ChevronUp
                                                size={14}
                                                color={i > 0 ? TEAL_DARK : "#e5e7eb"}
                                            />
                                        </button>
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="flex items-center justify-center rounded-lg"
                                            style={{ width: 26, height: 26, background: "#FCEFE8" }}
                                            aria-label={`Удалить ${item.title}`}
                                        >
                                            <Trash2 size={13} color="#C97B5A" />
                                        </button>
                                        <button
                                            onClick={() => moveItem(i, 1)}
                                            className="flex items-center justify-center rounded-lg"
                                            style={{
                                                width: 26, height: 26,
                                                background:
                                                    i < items.length - 1 ? `${TEAL}12` : "transparent",
                                            }}
                                            aria-label="Переместить вниз"
                                            disabled={i === items.length - 1}
                                        >
                                            <ChevronDown
                                                size={14}
                                                color={i < items.length - 1 ? TEAL_DARK : "#e5e7eb"}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Summary ── */}
                {items.length > 0 && (
                    <div
                        className="mt-4 p-4 rounded-2xl relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${WARM}, #FAF3E3)` }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <ShanyrakIcon size={22} color={GOLD} />
                            <span className="text-sm font-bold text-ink font-display">
                                Итого по маршруту
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Расстояние", value: "280 км" },
                                { label: "Время",      value: "~4.5ч" },
                                { label: "Бюджет",     value: "~25к ₸" },
                            ].map((s, i) => (
                                <div
                                    key={i}
                                    className="text-center p-2.5 rounded-xl bg-white/60"
                                >
                                    <p className="text-base font-bold text-ink">{s.value}</p>
                                    <p style={{ fontSize: 10, color: "#9CA3AF" }} className="mt-0.5">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div style={{ height: 16 }} />
            </div>
        </div>
    );
};

export default ItineraryScreen;

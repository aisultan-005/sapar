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
                    <div className="flex items-center justify-between">
                        <div>
                            <p
                                className="text-xs tracking-wider uppercase"
                                style={{ color: "#80e0eb", letterSpacing: "0.12em" }}
                            >
                                Ваш маршрут
                            </p>
                            <h1
                                className="text-white text-lg font-bold mt-1"
                            >
                                Алматинская область
                            </h1>
                        </div>
                        <div
                            className="px-3 py-1 text-xs font-medium"
                            style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}
                        >
                            1 день
                        </div>
                    </div>

                    {/* Offline Toggle */}
                    <div
                        className="flex items-center justify-between mt-4 px-3 py-2"
                        style={{ background: "rgba(255,255,255,0.12)" }}
                    >
                        <div className="flex items-center gap-2">
                            {offlineMode ? (
                                <WifiOff size={15} color="rgba(255,255,255,0.8)" />
                            ) : (
                                <Wifi size={15} color="rgba(255,255,255,0.8)" />
                            )}
                            <span
                                className="text-xs font-medium"
                                style={{ color: "rgba(255,255,255,0.9)" }}
                            >
                Доступно офлайн
              </span>
                        </div>
                        <button
                            onClick={() => onOfflineModeChange(!offlineMode)}
                            className="transition-all duration-300 relative"
                            style={{
                                background: offlineMode ? GOLD : "rgba(255,255,255,0.25)",
                                padding: 2,
                                width: 40,
                                height: 22,
                            }}
                            role="switch"
                            aria-checked={offlineMode}
                            aria-label="Офлайн режим"
                        >
                            <div
                                className="bg-white shadow transition-transform duration-300"
                                style={{
                                    width: 18,
                                    height: 18,
                                    transform: offlineMode
                                        ? "translateX(18px)"
                                        : "translateX(0)",
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Timeline ── */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Map
                            size={48}
                            color="#e5e7eb"
                            style={{ marginBottom: 12 }}
                        />
                        <p className="text-sm font-bold text-gray-500 mb-1">
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
                      style={{ fontSize: 11, color: TEAL }}
                  >
                    {item.time}
                  </span>
                                    <div
                                        className="mt-2"
                                        style={{
                                            width: 10,
                                            height: 10,
                                            border: `2px solid ${TEAL}`,
                                            background: i === 0 ? TEAL : "#fff",
                                        }}
                                    />
                                    {i < items.length - 1 && (
                                        <div
                                            className="flex-1 mt-1"
                                            style={{ width: 2, background: `${TEAL}25` }}
                                        />
                                    )}
                                </div>

                                {/* Card */}
                                <div
                                    className="flex-1 p-3 mb-2 flex items-center gap-3"
                                    style={{
                                        background: "#f8fafc",
                                        border: "1px solid #f1f5f9",
                                    }}
                                >
                  <span className="text-xl">
                    {iconMap[item.icon] || "📍"}
                  </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-800 truncate">
                                            {item.title}
                                        </p>
                                        <p
                                            className="mt-1"
                                            style={{ fontSize: 11, color: "#9ca3af" }}
                                        >
                                            {item.subtitle} · {item.duration}
                                        </p>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveItem(i, -1)}
                                            className="flex items-center justify-center"
                                            style={{
                                                width: 24,
                                                height: 24,
                                                background: i > 0 ? `${TEAL}10` : "transparent",
                                            }}
                                            aria-label="Переместить вверх"
                                            disabled={i === 0}
                                        >
                                            <ChevronUp
                                                size={14}
                                                color={i > 0 ? "#0d9488" : "#e5e7eb"}
                                            />
                                        </button>
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="flex items-center justify-center"
                                            style={{ width: 24, height: 24, background: "#fef2f2" }}
                                            aria-label={`Удалить ${item.title}`}
                                        >
                                            <Trash2 size={12} color="#f87171" />
                                        </button>
                                        <button
                                            onClick={() => moveItem(i, 1)}
                                            className="flex items-center justify-center"
                                            style={{
                                                width: 24,
                                                height: 24,
                                                background:
                                                    i < items.length - 1 ? `${TEAL}10` : "transparent",
                                            }}
                                            aria-label="Переместить вниз"
                                            disabled={i === items.length - 1}
                                        >
                                            <ChevronDown
                                                size={14}
                                                color={
                                                    i < items.length - 1 ? "#0d9488" : "#e5e7eb"
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Summary ── */}
                <div className="mt-4 p-4" style={{ background: WARM }}>
                    <div className="flex items-center gap-2 mb-2">
                        <ShanyrakIcon size={20} color={GOLD} />
                        <span className="text-xs font-bold text-gray-700">
              Итого по маршруту
            </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Расстояние", value: "280 км" },
                            { label: "Время в пути", value: "~4.5ч" },
                            { label: "Бюджет", value: "~25 000 ₸" },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <p className="text-sm font-bold text-gray-800">{s.value}</p>
                                <p style={{ fontSize: 10, color: "#9ca3af" }} className="mt-1">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ height: 16 }} />
            </div>
        </div>
    );
};

export default ItineraryScreen;

import { useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import OrnamentPattern from "./OrnamentPattern";
import { TEAL, TEAL_DARK, GOLD, TERRA } from "../../constants/theme";
import { itineraryApi } from "../../api/itinerary.api";
import { useLang } from "../../i18n/LanguageContext";

const TAGS = ["Природа", "История", "Культура", "Еда", "Горы", "Озёра"];
const DURATIONS = [
    { value: "1д",  label: "1 день" },
    { value: "2д",  label: "2 дня" },
    { value: "3д",  label: "3 дня" },
    { value: "7д",  label: "Неделя" },
];
const BUDGETS = [
    { value: "low",    label: "До 20к ₸" },
    { value: "medium", label: "20–50к ₸" },
    { value: "high",   label: "От 50к ₸" },
];

export default function AIRouteModal({ open, onClose, onResult }) {
    const { t } = useLang();
    const [selectedTags, setSelectedTags] = useState(["Природа"]);
    const [duration, setDuration] = useState("1д");
    const [budget, setBudget] = useState("medium");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await itineraryApi.generate({
                tags: selectedTags,
                duration,
                budget,
                region: "Казахстан",
            });
            const data = res?.data;
            if (!data?.items?.length) {
                throw new Error("Backend вернул пустой маршрут");
            }
            onResult(data);
            onClose();
        } catch (e) {
            setError(
                e.message?.includes("503")
                    ? "Сервис AI временно недоступен"
                    : e.message?.includes("Failed to fetch")
                        ? "Не удалось связаться с сервером. Проверь интернет."
                        : "Ошибка генерации. Попробуй ещё раз."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
            style={{ background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden"
                style={{
                    animation: "fadeSlideIn 0.3s ease both",
                    maxHeight: "92vh",
                    boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
                }}
            >
                {/* Header */}
                <div
                    className="relative px-5 pt-5 pb-5 overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                    }}
                >
                    <OrnamentPattern opacity={0.08} color="#fff" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 flex items-center justify-center rounded-full press-effect"
                        style={{
                            width: 32, height: 32,
                            background: "rgba(255,255,255,0.2)",
                        }}
                        aria-label="Закрыть"
                    >
                        <X size={18} color="#fff" />
                    </button>
                    <div className="relative z-10 flex items-center gap-3">
                        <div
                            className="flex items-center justify-center rounded-2xl"
                            style={{ width: 44, height: 44, background: "rgba(255,255,255,0.22)" }}
                        >
                            <Sparkles size={22} color="#fff" />
                        </div>
                        <div>
                            <p
                                className="text-xs tracking-wider uppercase font-medium"
                                style={{ color: "#A5F3FC", letterSpacing: "0.15em" }}
                            >
                                AI-планировщик
                            </p>
                            <h2 className="text-white text-lg font-bold font-display">
                                Создать маршрут
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div
                    className="overflow-y-auto px-5 py-5"
                    style={{ maxHeight: "calc(92vh - 220px)" }}
                >
                    {/* Tags */}
                    <p className="text-sm font-bold text-ink mb-2 font-display">
                        Интересы
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {TAGS.map((tag) => {
                            const active = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className="px-4 py-2 rounded-full text-xs font-semibold transition-all press-effect-soft"
                                    style={{
                                        background: active ? TEAL : "#F5F5F0",
                                        color: active ? "#fff" : "#475569",
                                        border: active ? "none" : "1px solid #F1F0EC",
                                        boxShadow: active ? `0 4px 12px ${TEAL}45` : "none",
                                    }}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>

                    {/* Duration */}
                    <p className="text-sm font-bold text-ink mb-2 font-display">
                        Длительность
                    </p>
                    <div className="grid grid-cols-4 gap-2 mb-5">
                        {DURATIONS.map((d) => {
                            const active = duration === d.value;
                            return (
                                <button
                                    key={d.value}
                                    onClick={() => setDuration(d.value)}
                                    className="py-2.5 rounded-xl text-xs font-semibold transition-all press-effect-soft"
                                    style={{
                                        background: active ? TEAL : "#F5F5F0",
                                        color: active ? "#fff" : "#475569",
                                        boxShadow: active ? `0 4px 12px ${TEAL}40` : "none",
                                    }}
                                >
                                    {d.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Budget */}
                    <p className="text-sm font-bold text-ink mb-2 font-display">
                        Бюджет
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        {BUDGETS.map((b) => {
                            const active = budget === b.value;
                            return (
                                <button
                                    key={b.value}
                                    onClick={() => setBudget(b.value)}
                                    className="py-2.5 rounded-xl text-xs font-semibold transition-all press-effect-soft"
                                    style={{
                                        background: active ? GOLD : "#FAF3E3",
                                        color: active ? "#fff" : "#92400e",
                                        boxShadow: active ? `0 4px 12px ${GOLD}50` : "none",
                                    }}
                                >
                                    {b.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            className="mt-4 p-3 rounded-xl flex items-start gap-2"
                            style={{ background: "#FCEFE8", color: TERRA }}
                        >
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t" style={{ borderColor: "#F1F0EC" }}>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || selectedTags.length === 0}
                        className="press-effect w-full py-3.5 text-white font-bold text-sm flex items-center justify-center gap-2 rounded-2xl transition-all"
                        style={{
                            background:
                                loading || selectedTags.length === 0
                                    ? "#94a3b8"
                                    : `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                            boxShadow:
                                loading || selectedTags.length === 0
                                    ? "none"
                                    : `0 8px 24px ${TEAL}45`,
                            opacity: loading || selectedTags.length === 0 ? 0.7 : 1,
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Генерирую маршрут...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Сгенерировать
                            </>
                        )}
                    </button>
                    {loading && (
                        <p
                            className="text-center mt-2 text-xs"
                            style={{ color: "#9CA3AF" }}
                        >
                            Первый запрос может занять до 30 секунд
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

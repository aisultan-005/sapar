import { useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import OrnamentPattern from "./OrnamentPattern";
import { TEAL, TEAL_DARK, GOLD, TERRA } from "../../constants/theme";
import { itineraryApi } from "../../api/itinerary.api";
import { useLang } from "../../i18n/LanguageContext";

// value уходит на backend (на русском), labelKey — ключ перевода для интерфейса
const TAGS = [
    { value: "Природа",  labelKey: "tagNature" },
    { value: "История",  labelKey: "tagHistory" },
    { value: "Культура", labelKey: "tagCulture" },
    { value: "Еда",      labelKey: "tagFood" },
    { value: "Горы",     labelKey: "tagMountains" },
    { value: "Озёра",    labelKey: "tagLakes" },
];
const DURATIONS = [
    { value: "1д", days: 1, labelKey: "dur1" },
    { value: "2д", days: 2, labelKey: "dur2" },
    { value: "3д", days: 3, labelKey: "dur3" },
    { value: "7д", days: 7, labelKey: "dur7" },
];
const BUDGETS = [
    { value: "low",    labelKey: "budgetLow" },
    { value: "medium", labelKey: "budgetMid" },
    { value: "high",   labelKey: "budgetHigh" },
];

export default function AIRouteModal({ open, onClose, onResult }) {
    const { t, lang } = useLang();
    const [selectedTags, setSelectedTags] = useState(["Природа"]);
    const [duration, setDuration] = useState("1д");
    const [budget, setBudget] = useState("medium");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
        );
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await itineraryApi.generate({
                tags: selectedTags,
                duration,
                days: DURATIONS.find((d) => d.value === duration)?.days ?? 1,
                budget,
                region: "Казахстан",
                lang,
            });
            const data = res?.data;
            if (!data?.items?.length) {
                setError(t("aiErrEmpty"));
                return;
            }
            onResult(data);
            onClose();
        } catch (e) {
            const msg = e?.message || "";
            setError(
                msg.includes("503")
                    ? t("aiErrUnavailable")
                    : msg.includes("Failed to fetch") || msg.includes("NetworkError")
                        ? t("aiErrNetwork")
                        : t("aiErrGeneric")
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
                        aria-label={t("close")}
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
                                {t("aiEyebrow")}
                            </p>
                            <h2 className="text-white text-lg font-bold font-display">
                                {t("aiModalTitle")}
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
                        {t("aiInterests")}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {TAGS.map(({ value: tag, labelKey }) => {
                            const active = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    aria-pressed={active}
                                    className="px-4 py-2 rounded-full text-xs font-semibold transition-all press-effect-soft"
                                    style={{
                                        background: active ? TEAL : "#F5F5F0",
                                        color: active ? "#fff" : "#475569",
                                        border: active ? "none" : "1px solid #F1F0EC",
                                        boxShadow: active ? `0 4px 12px ${TEAL}45` : "none",
                                    }}
                                >
                                    {t(labelKey)}
                                </button>
                            );
                        })}
                    </div>

                    {/* Duration */}
                    <p className="text-sm font-bold text-ink mb-2 font-display">
                        {t("aiDuration")}
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
                                    {t(d.labelKey)}
                                </button>
                            );
                        })}
                    </div>

                    {/* Budget */}
                    <p className="text-sm font-bold text-ink mb-2 font-display">
                        {t("aiBudget")}
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
                                    {t(b.labelKey)}
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
                                {t("aiGenerating")}
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                {t("aiGenerate")}
                            </>
                        )}
                    </button>
                    {loading && (
                        <p
                            className="text-center mt-2 text-xs"
                            style={{ color: "#9CA3AF" }}
                        >
                            {t("aiSlowHint")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

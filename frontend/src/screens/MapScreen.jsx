import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Star, Navigation } from "lucide-react";
import OrnamentPattern from "../components/ui/OrnamentPattern";
import { TEAL, TEAL_DARK, GOLD } from "../constants/theme";
import { allLocations, nearbyPlaces } from "../data/locations";
import { useLang } from "../i18n/LanguageContext";
import { findLocation, isValidCoords } from "../lib/geo";
import { computeSummary, countDays, itemDay } from "../lib/route";

// Центр карты — географический центр Казахстана
const KZ_CENTER = [48.0196, 66.9237];
const KZ_ZOOM = 5;

/**
 * Создаём кастомный SVG-маркер в стиле приложения (бирюзовая капля + золотая точка).
 * Используем L.divIcon чтобы рендерить через HTML/CSS.
 */
const createMarkerIcon = (color = TEAL) =>
    L.divIcon({
        className: "sapar-marker",
        html: `
            <div style="
                position: relative;
                width: 32px;
                height: 40px;
                filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));
            ">
                <svg viewBox="0 0 32 40" width="32" height="40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0 C7.16 0, 0 7.16, 0 16 C0 28, 16 40, 16 40 C16 40, 32 28, 32 16 C32 7.16, 24.84 0, 16 0 Z"
                          fill="${color}" />
                    <circle cx="16" cy="15" r="5" fill="#fff" />
                    <circle cx="16" cy="15" r="2.5" fill="${GOLD}" />
                </svg>
            </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -38],
    });

/** Нумерованный маркер остановки маршрута. */
const createStopIcon = (n) =>
    L.divIcon({
        className: "sapar-marker",
        html: `
            <div style="
                width: 30px; height: 30px; border-radius: 50%;
                background: ${TEAL_DARK}; color: #fff;
                border: 3px solid ${GOLD};
                display: flex; align-items: center; justify-content: center;
                font: 700 13px/1 system-ui, sans-serif;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            ">${n}</div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -16],
    });

/** Подгоняет масштаб карты под переданные точки. */
const FitBounds = ({ points }) => {
    const map = useMap();
    const key = points.map((p) => p.join(",")).join("|");
    useEffect(() => {
        if (points.length === 0) return;
        if (points.length === 1) {
            map.setView(points[0], 10);
        } else {
            map.fitBounds(points, { padding: [40, 40], maxZoom: 12 });
        }
    }, [map, key]);
    return null;
};

const MapScreen = ({ onLocationTap, routeItems = [], mode = "all", onModeChange }) => {
    const { t, tn } = useLang();

    // Все места с координатами
    const allMarkers = useMemo(() => {
        const all = [...allLocations, ...nearbyPlaces];
        return all.filter((p) => isValidCoords(p.coords));
    }, []);

    // Остановки маршрута с координатами (нумерация — по порядку в маршруте)
    const routeStops = useMemo(
        () =>
            routeItems
                .map((item, i) => ({ item, n: i + 1 }))
                .filter(({ item }) => isValidCoords(item.coords)),
        [routeItems]
    );
    const routePoints = routeStops.map(({ item }) => item.coords);
    const hasRoute = routePoints.length > 0;
    const showRoute = mode === "route" && hasRoute;
    const summary = useMemo(() => computeSummary(routeItems), [routeItems]);

    return (
        <div className="flex flex-col h-full" style={{ background: "#FAFAF7" }}>
            {/* ── Header ── */}
            <div
                className="relative px-5 pt-6 pb-8 rounded-b-3xl overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                    zIndex: 500,
                }}
            >
                <OrnamentPattern opacity={0.08} color="#fff" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p
                            className="text-xs tracking-wider uppercase font-medium"
                            style={{ color: "#A5F3FC", letterSpacing: "0.18em" }}
                        >
                            {t("mapEyebrow")}
                        </p>
                        <h1 className="text-white text-2xl font-bold mt-1 font-display">
                            {t("mapTitle")}
                        </h1>
                    </div>
                    <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.18)" }}
                    >
                        <Navigation size={13} color="#fff" />
                        <span className="text-xs font-semibold text-white">
                            {showRoute ? routeStops.length : allMarkers.length}
                        </span>
                    </div>
                </div>

                {/* Переключатель: все места / маршрут */}
                {hasRoute && onModeChange && (
                    <div
                        className="relative z-10 mt-4 grid grid-cols-2 gap-1 p-1 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                        role="tablist"
                    >
                        {[
                            { value: "all",   label: t("mapAllPlaces") },
                            { value: "route", label: t("mapRoute") },
                        ].map((opt) => {
                            const active = (showRoute ? "route" : "all") === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => onModeChange(opt.value)}
                                    className="py-1.5 rounded-xl text-xs font-semibold transition-all"
                                    style={{
                                        background: active ? "#fff" : "transparent",
                                        color: active ? TEAL_DARK : "rgba(255,255,255,0.9)",
                                    }}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Map ── */}
            <div
                className="flex-1 relative overflow-hidden"
                style={{ marginTop: -16, borderRadius: "24px 24px 0 0", background: "#fff" }}
            >
                <MapContainer
                    center={KZ_CENTER}
                    zoom={KZ_ZOOM}
                    minZoom={4}
                    maxZoom={17}
                    scrollWheelZoom={true}
                    zoomControl={false}
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "24px 24px 0 0",
                    }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl position="bottomright" />

                    {showRoute && <FitBounds points={routePoints} />}

                    {showRoute && (
                        <Polyline
                            positions={routePoints}
                            pathOptions={{ color: TEAL_DARK, weight: 4, opacity: 0.85, dashArray: "8 8" }}
                        />
                    )}

                    {showRoute && routeStops.map(({ item, n }) => {
                        const loc = findLocation(item);
                        return (
                            <Marker key={item.id} position={item.coords} icon={createStopIcon(n)}>
                                <Popup closeButton={false} className="sapar-popup">
                                    <div style={{ minWidth: 180, padding: 4 }}>
                                        <p style={{ fontSize: 10, color: TEAL_DARK, margin: 0, fontWeight: 700 }}>
                                            {t("mapStop")} {n} · {t("dayN").replace("{n}", itemDay(item))} · {item.time}
                                        </p>
                                        <p className="font-bold text-sm" style={{ color: "#1F2937", margin: "4px 0" }}>
                                            {item.title}
                                        </p>
                                        {item.subtitle && (
                                            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                                                {item.subtitle}
                                            </p>
                                        )}
                                        {loc && onLocationTap && (
                                            <button
                                                onClick={() => onLocationTap(loc)}
                                                style={{
                                                    marginTop: 8, width: "100%", padding: "6px 10px",
                                                    background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
                                                    color: "#fff", fontSize: 12, fontWeight: 700,
                                                    borderRadius: 10, border: "none", cursor: "pointer",
                                                }}
                                            >
                                                {t("mapOpen")}
                                            </button>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {!showRoute && allMarkers.map((place) => (
                        <Marker
                            key={place.id}
                            position={place.coords}
                            icon={createMarkerIcon(place.color || TEAL)}
                        >
                            <Popup closeButton={false} className="sapar-popup">
                                <div style={{ minWidth: 200, padding: 4 }}>
                                    <p
                                        className="font-bold text-sm"
                                        style={{ color: "#1F2937", margin: 0, marginBottom: 4 }}
                                    >
                                        {place.name}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 11,
                                            color: "#9CA3AF",
                                            margin: 0,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {place.subtitle}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <Star size={11} fill={GOLD} color={GOLD} />
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: "#374151",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {place.rating}
                                        </span>
                                        <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                                            ({place.reviews})
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => onLocationTap && onLocationTap(place)}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: 700,
                                            borderRadius: 10,
                                            border: "none",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 6,
                                            boxShadow: `0 4px 12px ${TEAL}40`,
                                        }}
                                    >
                                        <MapPin size={13} />
                                        {t("mapOpen")}
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Легенда */}
                <div
                    className="absolute bottom-4 left-4 rounded-2xl bg-white px-3 py-2 flex items-center gap-2"
                    style={{
                        boxShadow: "0 4px 16px rgba(31,41,55,0.15)",
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="rounded-full"
                        style={{ width: 8, height: 8, background: TEAL }}
                    />
                    <span className="text-xs font-semibold text-ink">
                        {showRoute
                            ? `${tn("days", countDays(routeItems))} · ${summary.distanceKm} км`
                            : t("mapHint")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MapScreen;

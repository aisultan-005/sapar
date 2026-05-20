import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Star, Navigation } from "lucide-react";
import OrnamentPattern from "../components/ui/OrnamentPattern";
import { TEAL, TEAL_DARK, GOLD } from "../constants/theme";
import { allLocations, nearbyPlaces } from "../data/locations";
import { useLang } from "../i18n/LanguageContext";

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

const MapScreen = ({ onLocationTap }) => {
    const { t } = useLang();

    // Все места с координатами
    const allMarkers = useMemo(() => {
        const all = [...allLocations, ...nearbyPlaces];
        return all.filter((p) => Array.isArray(p.coords) && p.coords.length === 2);
    }, []);

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
                            {allMarkers.length}
                        </span>
                    </div>
                </div>
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

                    {allMarkers.map((place) => (
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
                        {t("mapHint")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MapScreen;

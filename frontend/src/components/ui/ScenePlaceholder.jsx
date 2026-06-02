import { useState, useEffect } from "react";
import { GOLD } from "../../constants/theme";

// Прямые ссылки на конкретные хорошие фото (Wikimedia, свободная лицензия)
const commons = (file) =>
    `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=640`;

const OVERRIDE = {
    kolsai:    commons("2nd_Kolsay_Lake_01.jpg"),
    sayram:    commons("Sayram-Ugam.jpg"),
    mangystau: commons("Airakty_Shomanai_Mountains_in_Mangystau_Region%2C_Kazakhstan_%28April_2024%29.jpg"),
    okzhetpes: commons("Burabay_020000%2C_Kazakhstan_-_panoramio.jpg"),
    alakol:    commons("Evening_on_Alakol_lake.jpg"),
    balkhash:  commons("Lake_Balkhash%2C_Alakol_Biosphere_Reserve%2C_Kazakhstan_-_April_29th%2C_2019_%2832796660517%29.jpg"),
};

// Остальные места -> статья Википедии (берём её главное фото)
const WIKI = {
    almaty:    "Almaty",
    astana:    "Astana",
    turkestan: "Turkistan,_Kazakhstan",
    burabay:   "Burabay_National_Park",
    charyn:    "Charyn_Canyon",
    kolsai:    "Kolsay_Lakes_National_Park",
    kaindy:    "Lake_Kaindy",
    shymkent:  "Shymkent",
    mangystau: "Bozjyra",
    okzhetpes: "Okzhetpes",
    alakol:    "Alakol",
    baikonur:  "Baikonur_Cosmodrome",
    balkhash:  "Lake_Balkhash",
    taraz:     "Aisha_Bibi",
    sayram:    "Sayram-Ugam_National_Park",
};

const cache = {}; // запоминаем найденные фото, чтобы не грузить повторно

const Scene = ({ type }) => {
    const scenes = {
        almaty: (
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a365d 0%, #2563eb 40%, #7dd3fc 70%, #f0f9ff 100%)" }}>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 200 80" className="w-full">
                        <path d="M0 80 L30 25 L50 45 L80 10 L110 35 L130 20 L160 40 L200 15 L200 80Z" fill="#1e3a5f" opacity="0.5" />
                        <path d="M0 80 L20 40 L50 55 L90 20 L120 45 L150 30 L200 50 L200 80Z" fill="#2d5a27" opacity="0.7" />
                        <path d="M0 80 L40 60 L80 50 L120 55 L160 48 L200 60 L200 80Z" fill="#38722e" />
                    </svg>
                </div>
                <div className="absolute top-3 right-4 w-8 h-8" style={{ background: "radial-gradient(circle, #fde68a, #f59e0b)" }} />
            </div>
        ),
        astana: (
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #38bdf8 100%)" }}>
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 pb-0">
                    {[
                        { w: 3, h: 40, grad: "linear-gradient(180deg, #94a3b8, #cbd5e1)" },
                        { w: 4, h: 55, grad: "linear-gradient(180deg, #60a5fa, #93c5fd)" },
                        { w: 2, h: 65, grad: `linear-gradient(180deg, ${GOLD}, #fbbf24)` },
                        { w: 5, h: 50, grad: "linear-gradient(180deg, #a5b4fc, #c7d2fe)" },
                        { w: 3, h: 35, grad: "linear-gradient(180deg, #94a3b8, #e2e8f0)" },
                        { w: 4, h: 45, grad: "linear-gradient(180deg, #67e8f9, #a5f3fc)" },
                    ].map((b, i) => (
                        <div key={i} style={{ width: b.w * 4, height: b.h, background: b.grad }} />
                    ))}
                </div>
            </div>
        ),
        turkestan: (
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #fef3c7 0%, #fcd34d 40%, #d97706 100%)" }}>
                <div className="absolute bottom-2 left-1/2" style={{ transform: "translateX(-50%)" }}>
                    <div className="border-2" style={{ width: 48, height: 64, background: "linear-gradient(180deg, #78350f, #92400e)", borderColor: "#92400e" }}>
                        <div className="mx-auto mt-1" style={{ width: 8, height: 24, background: "#92400e" }} />
                    </div>
                </div>
            </div>
        ),
        burabay: (
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #bfdbfe 0%, #60a5fa 30%, #2563eb 100%)" }}>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 200 60" className="w-full">
                        <path d="M0 60 L30 25 L60 40 L90 15 L120 35 L200 20 L200 60Z" fill="#166534" opacity="0.8" />
                        <path d="M0 60 L0 45 Q50 35 100 40 Q150 45 200 38 L200 60Z" fill="#1d4ed8" opacity="0.5" />
                    </svg>
                </div>
            </div>
        ),
    };
    return scenes[type] || scenes.almaty;
};

const ScenePlaceholder = ({ type, className = "", style = {}, image }) => {
    const [src, setSrc] = useState(image || OVERRIDE[type] || cache[type] || null);

    useEffect(() => {
        if (image || OVERRIDE[type] || cache[type] || !WIKI[type]) return;
        let alive = true;
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${WIKI[type]}`)
            .then((r) => r.json())
            .then((d) => {
                const url = d.thumbnail?.source || d.originalimage?.source;
                if (url) {
                    cache[type] = url;
                    if (alive) setSrc(url);
                }
            })
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, [type, image]);

    return (
        <div className={`relative overflow-hidden ${className}`} style={style}>
            <Scene type={type} />
            {src && (
                <img
                    src={src}
                    alt=""
                    loading="lazy"
                    onError={() => setSrc(null)}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}
        </div>
    );
};

export default ScenePlaceholder;

cat > frontend/src/components/ui/ScenePlaceholder.jsx << 'EOF'
import { useState } from "react";
import { GOLD } from "../../constants/theme";

const PHOTOS = {
    almaty:    "kazakhstan,almaty,mountains",
    astana:    "astana,kazakhstan,city",
    turkestan: "turkestan,kazakhstan,mausoleum",
    burabay:   "burabay,kazakhstan,lake",
    charyn:    "charyn,canyon,kazakhstan",
    kolsai:    "kolsai,lake,kazakhstan",
    kaindy:    "kaindy,lake,kazakhstan",
    shymkent:  "shymkent,kazakhstan",
    mangystau: "mangystau,kazakhstan,desert",
    okzhetpes: "burabay,rock,kazakhstan",
    alakol:    "alakol,lake,kazakhstan",
    baikonur:  "baikonur,rocket,space",
    balkhash:  "balkhash,lake,kazakhstan",
    taraz:     "taraz,kazakhstan,city",
    sayram:    "sayram,kazakhstan,nature",
};

const LOCK = Object.keys(PHOTOS).reduce((m, k, i) => ((m[k] = i + 1), m), {});

const photoUrl = (type, image) =>
    image ||
    (PHOTOS[type]
        ? `https://loremflickr.com/640/480/${PHOTOS[type]}?lock=${LOCK[type] || 1}`
        : null);

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
    const [failed, setFailed] = useState(false);
    const src = photoUrl(type, image);

    return (
        <div className={`relative overflow-hidden ${className}`} style={style}>
            <Scene type={type} />
            {src && !failed && (
                <img
                    src={src}
                    alt=""
                    loading="lazy"
                    onError={() => setFailed(true)}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}
        </div>
    );
};

export default ScenePlaceholder;
EOF

import { TEAL } from "../../constants/theme";

/**
 * Казахский орнаментальный паттерн «қошқар мүйіз» (бараний рог) — упрощённый, изящный.
 * Используется как фон-намёк, opacity по умолчанию очень низкая.
 */
const OrnamentPattern = ({ opacity = 0.05, color = TEAL }) => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity }}
        aria-hidden="true"
    >
        <defs>
            <pattern
                id="kz-ornament"
                x="0" y="0"
                width="80" height="80"
                patternUnits="userSpaceOnUse"
            >
                {/* Бараньи рога */}
                <path
                    d="M40 22 C32 22, 28 28, 28 34 C28 40, 32 44, 36 44 C34 42, 33 38, 34 35"
                    fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round"
                />
                <path
                    d="M40 22 C48 22, 52 28, 52 34 C52 40, 48 44, 44 44 C46 42, 47 38, 46 35"
                    fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round"
                />
                {/* Центральный ромб */}
                <path
                    d="M40 50 L46 56 L40 62 L34 56 Z"
                    fill="none" stroke={color} strokeWidth="0.7"
                />
                {/* Точки по углам */}
                <circle cx="10" cy="10" r="1.2" fill={color} />
                <circle cx="70" cy="10" r="1.2" fill={color} />
                <circle cx="10" cy="70" r="1.2" fill={color} />
                <circle cx="70" cy="70" r="1.2" fill={color} />
                {/* Соединительные линии */}
                <line x1="40" y1="14" x2="40" y2="20" stroke={color} strokeWidth="0.5" />
                <line x1="40" y1="64" x2="40" y2="72" stroke={color} strokeWidth="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kz-ornament)" />
    </svg>
);

export default OrnamentPattern;

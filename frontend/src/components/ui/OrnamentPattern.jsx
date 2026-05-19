import { TEAL } from "../../constants/theme";

const OrnamentPattern = ({ opacity = 0.04, color = TEAL }) => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity }}
    >
        <defs>
            <pattern
                id="kz-ornament"
                x="0" y="0"
                width="60" height="60"
                patternUnits="userSpaceOnUse"
            >
                <path d="M30 5 L35 15 L30 10 L25 15 Z" fill={color} />
                <path d="M30 55 L35 45 L30 50 L25 45 Z" fill={color} />
                <path d="M5 30 L15 25 L10 30 L15 35 Z" fill={color} />
                <path d="M55 30 L45 25 L50 30 L45 35 Z" fill={color} />
                <circle cx="30" cy="30" r="3" fill="none" stroke={color} strokeWidth="0.8" />
                <path
                    d="M20 20 Q30 15 40 20 Q35 30 40 40 Q30 35 20 40 Q25 30 20 20Z"
                    fill="none" stroke={color} strokeWidth="0.6"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kz-ornament)" />
    </svg>
);

export default OrnamentPattern;

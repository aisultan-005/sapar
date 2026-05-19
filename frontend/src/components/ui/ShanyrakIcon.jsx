import { GOLD } from "../../constants/theme";

const ShanyrakIcon = ({ size = 24, color = GOLD }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke={color} strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="20" r="6"  stroke={color} strokeWidth="1.2" fill="none" />
        <line x1="20" y1="6"  x2="20" y2="14" stroke={color} strokeWidth="1" />
        <line x1="20" y1="26" x2="20" y2="34" stroke={color} strokeWidth="1" />
        <line x1="6"  y1="20" x2="14" y2="20" stroke={color} strokeWidth="1" />
        <line x1="26" y1="20" x2="34" y2="20" stroke={color} strokeWidth="1" />
        <line x1="10"   y1="10"   x2="15.8" y2="15.8" stroke={color} strokeWidth="0.8" />
        <line x1="24.2" y1="24.2" x2="30"   y2="30"   stroke={color} strokeWidth="0.8" />
        <line x1="30"   y1="10"   x2="24.2" y2="15.8" stroke={color} strokeWidth="0.8" />
        <line x1="15.8" y1="24.2" x2="10"   y2="30"   stroke={color} strokeWidth="0.8" />
    </svg>
);

export default ShanyrakIcon;

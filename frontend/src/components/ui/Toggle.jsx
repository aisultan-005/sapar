import { TEAL } from "../../constants/theme";

const Toggle = ({ value, onChange, label }) => (
    <button
        onClick={() => onChange(!value)}
        className="transition-all duration-300 relative"
        style={{
            background: value ? TEAL : "#d1d5db",
            padding: 2,
            width: 40,
            height: 22,
        }}
        role="switch"
        aria-checked={value}
        aria-label={label}
    >
        <div
            className="bg-white shadow transition-transform duration-300"
            style={{
                width: 18,
                height: 18,
                transform: value ? "translateX(18px)" : "translateX(0)",
            }}
        />
    </button>
);

export default Toggle;

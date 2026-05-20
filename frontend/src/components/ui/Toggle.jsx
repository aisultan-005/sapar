import { TEAL } from "../../constants/theme";

const Toggle = ({ value, onChange, label }) => (
    <button
        onClick={() => onChange(!value)}
        className="transition-all duration-300 relative rounded-full"
        style={{
            background: value ? TEAL : "#d1d5db",
            padding: 2,
            width: 44,
            height: 24,
        }}
        role="switch"
        aria-checked={value}
        aria-label={label}
    >
        <div
            className="bg-white shadow-md rounded-full transition-transform duration-300"
            style={{
                width: 20,
                height: 20,
                transform: value ? "translateX(20px)" : "translateX(0)",
            }}
        />
    </button>
);

export default Toggle;

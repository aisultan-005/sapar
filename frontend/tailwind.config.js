/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                teal:  { DEFAULT: "#00A5B8", dark: "#007A8A", soft: "#E6F7F9" },
                gold:  { DEFAULT: "#D4A853", soft: "#FAF3E3" },
                terra: { DEFAULT: "#C97B5A", soft: "#FCEFE8" },
                sand:  "#F5E6C8",
                warm:  "#FFF8F0",
                ink:   { DEFAULT: "#1F2937", soft: "#6B7280", muted: "#9CA3AF" },
                bg:    { DEFAULT: "#FAFAF7", card: "#FFFFFF" },
                line:  "#F1F0EC",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
                display: ["'Playfair Display'", "Georgia", "serif"],
            },
            borderRadius: {
                'xl2': '1.25rem', // 20px
            },
            boxShadow: {
                card:   '0 4px 20px rgba(31, 41, 55, 0.06)',
                soft:   '0 2px 12px rgba(31, 41, 55, 0.05)',
                lift:   '0 10px 30px rgba(31, 41, 55, 0.08)',
                inset:  'inset 0 0 0 1px rgba(31, 41, 55, 0.04)',
            },
        },
    },
    plugins: [],
};

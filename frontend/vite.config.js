import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, ".", "");
    const backendPort = env.SAPAR_BACKEND_PORT || "5000";

    return {
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 3000,
            proxy: {
                "/api": {
                    target: `http://127.0.0.1:${backendPort}`,
                    changeOrigin: true,
                },
            },
        },
    };
});

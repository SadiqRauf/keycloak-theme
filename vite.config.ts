import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "none",
            themeName: "raredepot-theme",
            keycloakVersionTargets: {
                "22-to-25": "raredepot-theme-kc-22-to-25.jar",
                "all-other-versions": "raredepot-theme.jar"
            }
        })
    ]
});

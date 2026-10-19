
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, import.meta.dirname, "");

  const productionBase = env.VITE_SHARED_BASE_URL || "/";

  return {
    base: command === "build" ? productionBase : "/",

    plugins: [
      tailwindcss(),
      react(),

      federation({
        name: "vegibec_shared",
        filename: "remoteEntry.js",

        exposes: {
          "./Calendar":
            "./src/Pages/100--Calendar/Components/Calendar.tsx",

          "./CalendarProvider":
            "./src/Pages/100--Calendar/Contexts/CalendarContext.tsx",

          "./CalendarFeature":
            "./src/Pages/100--Calendar/CalendarFeature.tsx",
        },

        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
        },

        dev: {
          remoteHmr: true,
        },
      }),
    ],

    server: {
      port: 5174,
      strictPort: true,
      origin: "http://localhost:5174",
      cors: true,
    },

    preview: {
      port: 4174,
      strictPort: true,
      cors: true,
    },

    build: {
      target: "esnext",
    },
  };
});

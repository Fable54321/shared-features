
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),

    federation({
      name: "vegibec_shared",
      filename: "remoteEntry.js",

      exposes: {
        "./Calendar": "./src/Pages/100--Calendar/Components/Calendar.tsx",
        "./CalendarProvider":
          "./src/Pages/100--Calendar/Contexts/CalendarContext.tsx",
        "./CalendarFeature":
          "./src/Pages/100--Calendar/CalendarFeature.tsx",  
      },

      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
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
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom", "react-router-dom", "react-router"],

          // Ant Design (eng katta kutubxona)
          "vendor-antd": ["antd", "@ant-design/icons"],

          // Chart kutubxonalari
          "vendor-charts": ["apexcharts", "react-apexcharts", "recharts", "chart.js", "react-chartjs-2"],

          // TanStack Query
          "vendor-query": ["@tanstack/react-query"],

          // Lottie (og'ir animatsiya kutubxonasi)
          "vendor-lottie": ["lottie-react"],

          // i18n
          "vendor-i18n": ["i18next", "react-i18next"],

          // Kichik utilitylar
          "vendor-utils": ["axios", "dayjs", "sonner", "clsx", "tailwind-merge"],
        },
      },
    },
  },
});

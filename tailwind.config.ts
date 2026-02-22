import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#8B5CF6",
          "purple-dark": "#7C3AED",
          red: "#EF4444",
          "red-dark": "#DC2626",
        },
        dark: {
          800: "#1F2937",
          700: "#374151",
          600: "#4B5563",
          500: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};

export default config;

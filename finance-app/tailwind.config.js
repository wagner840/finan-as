/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        success: {
          50: "#f0fdf4",
          400: "#4ade80",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          900: "#14532d",
        },
        danger: {
          50: "#fef2f2",
          200: "#fecaca",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          900: "#7f1d1d",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
      },
    },
  },
  plugins: [],
};

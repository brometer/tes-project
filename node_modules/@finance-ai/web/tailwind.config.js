/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#6C5CE7",
        "background-light": "#f6f6f8",
        "background-dark": "#0F0F1A",
        "surface": "#1A1A2E",
        "surface-dark": "#1d1c26",
        "border-dark": "#3f3d52",
        "success": "#22c55e",
        "danger": "#ef4444"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}

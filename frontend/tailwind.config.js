/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#edfafa",
          100: "#d5f5f6",
          200: "#afeaec",
          300: "#7dd9dc",
          400: "#4dbfc4",
          500: "#01a3a8",
          600: "#01696f",
          700: "#0c4e54",
          800: "#0f3638",
          900: "#0a2224",
        }
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-in":    "fadeIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "scan-line":  "scanLine 2s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.6 } },
        scanLine:  { "0%": { top: "0%" }, "100%": { top: "100%" } },
      }
    }
  },
  plugins: []
}

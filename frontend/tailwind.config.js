/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          300: "var(--brand-300)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          800: "var(--brand-800)",
          900: "var(--brand-900)",
        },
        accent: {
          green: "var(--accent-green)",
          indigo: "var(--accent-indigo)",
          purple: "var(--accent-purple)",
          magenta: "var(--accent-magenta)",
          cyan: "var(--accent-cyan)",
          blue: "var(--accent-blue)",
          amber: "var(--accent-amber)",
        },
        surface: {
          white: "var(--surface-white)",
          dark: "var(--surface-dark)",
          50: "var(--surface-50)",
          100: "var(--surface-100)",
          200: "var(--surface-200)",
          300: "var(--surface-300)",
        },
        txt: {
          primary: "var(--txt-primary)",
          secondary: "var(--txt-secondary)",
          muted: "var(--txt-muted)",
          light: "var(--txt-light)",
          dark: "var(--txt-dark)",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(157,145,255,0.08), 0 1px 2px rgba(157,145,255,0.05)",
        "card-hover":
          "0 12px 40px rgba(157,145,255,0.22), 0 4px 12px rgba(157,145,255,0.12)",
        elevated:
          "0 20px 60px rgba(157,145,255,0.18), 0 8px 24px rgba(157,145,255,0.10)",
        nav: "0 1px 3px rgba(157,145,255,0.15)",
        "glow-brand":
          "0 0 24px rgba(157,145,255,0.4), 0 4px 24px rgba(157,145,255,0.28)",
        "glow-brand-lg":
          "0 0 48px rgba(157,145,255,0.5), 0 8px 40px rgba(157,145,255,0.38)",
        "glow-cyan": "0 0 20px rgba(34,211,238,0.38)",
        "glow-pink": "0 0 20px rgba(255,111,216,0.38)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-18px) scale(1.04)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-26px) rotate(5deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(157,145,255,0.3)" },
          "50%": {
            boxShadow:
              "0 0 55px rgba(157,145,255,0.7), 0 0 90px rgba(157,145,255,0.28)",
          },
        },
        "orb-drift": {
          "0%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(32px,-22px) scale(1.09)" },
          "66%": { transform: "translate(-22px,16px) scale(0.94)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(157,145,255,0.3)" },
          "50%": { borderColor: "rgba(157,145,255,0.8)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "orb-drift": "orb-drift 12s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0C1A2B", // deep navy — primary text / dark surfaces
          900: "#0A121C",
          800: "#101B29",
          700: "#16273a"
        },
        slate: {
          muted: "#5B6B7B" // secondary text
        },
        azure: {
          DEFAULT: "#2E5AAC", // restrained accent
          600: "#2A509B",
          400: "#5E86D6"
        },
        hair: "#E7E9EE" // hairline borders
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        eyebrow: "0.18em"
      },
      maxWidth: {
        measure: "68ch"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "draw": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both"
      }
    }
  },
  plugins: []
};
export default config;

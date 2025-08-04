import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        glass: {
          white: "rgba(255, 255, 255, 0.7)",
          light: "rgba(255, 255, 255, 0.5)",
          lighter: "rgba(255, 255, 255, 0.3)",
          blue: "rgba(59, 130, 246, 0.05)",
          purple: "rgba(147, 51, 234, 0.05)",
          pink: "rgba(236, 72, 153, 0.05)",
          green: "rgba(34, 197, 94, 0.05)",
        },
        text: {
          primary: "rgba(0, 0, 0, 0.9)",
          secondary: "rgba(0, 0, 0, 0.6)",
          tertiary: "rgba(0, 0, 0, 0.4)",
        },
        accent: {
          blue: "#007AFF",      // Apple blue
          green: "#34C759",     // Apple green
          orange: "#FF9500",    // Apple orange
          red: "#FF3B30",       // Apple red
          purple: "#AF52DE",    // Apple purple
          pink: "#FF2D55",      // Apple pink
        }
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "20px",
        xl: "30px",
        "2xl": "40px",
        "3xl": "60px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        glass: "24px",
        "glass-sm": "16px",
        "glass-lg": "32px",
      },
      boxShadow: {
        glass: "0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        "glass-sm": "0 2px 12px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        "glass-lg": "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(0, 0, 0, 0.02)",
        "glass-hover": "0 20px 40px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "gradient-shift": "gradient-shift 20s ease infinite",
        "float": "float 20s ease-in-out infinite",
        "subtle-float": "subtle-float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "ripple": "ripple 0.6s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "gradient": "gradient 8s ease infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "subtle-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.6" },
        },
        ripple: {
          to: {
            transform: "scale(4)",
            opacity: "0",
          },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

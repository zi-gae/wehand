const palette = require("./palette.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...palette.colors,
        // 테니스 테마 별칭 - 더 편한 사용을 위해
        "tennis-court": palette.colors.tennis.court,
        "tennis-ball": palette.colors.tennis.ball,
        "tennis-lime": palette.colors.tennis.lime,
        // 시맨틱 색상 별칭
        surface: {
          light: palette.semanticTokens.light.surface,
          dark: palette.semanticTokens.dark.surface,
        },
        text: {
          light: palette.semanticTokens.light.text,
          dark: palette.semanticTokens.dark.text,
        },
        border: {
          light: palette.semanticTokens.light.border,
          dark: palette.semanticTokens.dark.border,
        },
      },
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "sans-serif",
        ],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-lg": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        tennis: "0 4px 20px rgba(34, 197, 94, 0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-gentle": "bounceGentle 0.6s ease-in-out",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".8" },
        },
      },
      backgroundImage: {
        "gradient-tennis":
          "linear-gradient(135deg, rgb(34 197 94) 0%, rgb(234 179 8) 100%)",
        "gradient-tennis-soft": 
          "linear-gradient(135deg, rgb(132 204 22) 0%, rgb(250 204 21) 100%)",
        "gradient-primary":
          "linear-gradient(135deg, rgb(34 197 94) 0%, rgb(22 163 74) 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, rgb(234 179 8) 0%, rgb(202 138 4) 100%)",
        "gradient-dark-tennis":
          "linear-gradient(135deg, rgb(21 128 61) 0%, rgb(161 98 7) 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        "gradient-glass-dark":
          "linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(23,23,23,0.9) 100%)",
      },
    },
  },
  plugins: [
    // Glass morphism 유틸리티
    function ({ addUtilities }) {
      addUtilities({
        ".glass": {
          background: "rgba(255, 255, 255, 0.25)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.25)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        },
        ".glass-card": {
          background: "rgba(255, 255, 255, 0.9)",
          "backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      });
    },
  ],
};

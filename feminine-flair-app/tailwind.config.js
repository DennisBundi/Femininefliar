/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#630625",
          dark: "#4A041C",
          tint: "#FBE4E8",
        },
        blush: {
          DEFAULT: "#F5B7BD",
          soft: "#FCE3E6",
        },
        ink: "#241417",
        paper: "#FFFDFD",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Manrope", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

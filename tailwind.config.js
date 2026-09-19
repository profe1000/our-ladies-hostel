/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-800": "#2E346E",
        "stone-900": "#232624",
        "stone-400": "#f5f0f0",
        "stone-300": "#D9D9D9",
        "stone-100": "#EDEDED",
      },
    },
  },
  plugins: [],
};

import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // dark: "#202225",
        // "input-dark": "#111314",
        // "input-label": "#808489",
        // "input-value": "#d1d4d9",
        // blue: "#4091eb",
      },
    },
  },
  plugins: [forms()],
};

import forms from "@tailwindcss/forms";
import scrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [forms(), scrollbar({ nocompatible: true })],
};

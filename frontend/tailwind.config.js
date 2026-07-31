import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        zeel: {
          primary: "#F50575",
          secondary: "#2D2D2D",
          dark: "#0A0A0F",
          panel: "rgba(20, 20, 30, 0.82)",
          cyan: "#00F0FF"
        }
      },
      boxShadow: {
        neon: "0 0 32px rgba(245, 5, 117, 0.42)",
        cyan: "0 0 28px rgba(0, 240, 255, 0.28)"
      }
    }
  },
  plugins: [forms]
};

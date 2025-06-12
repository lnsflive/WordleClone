/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        flip: "flip 0.4s ease-in-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateX(-90deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
      },
    },
  },
  plugins: [],
};

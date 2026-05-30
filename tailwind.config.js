/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canopy: "#146b4d",
        leaf: "#24a148",
        lagoon: "#007c89",
        sky: "#1f9edb",
        sunshine: "#ffd73a",
        ember: "#f05a28",
        woodpink: "#c6025a",
        plum: "#8a0a49",
        berry: "#c0185a",
        ink: "#18212b",
        mist: "#f7fbfd",
      },
      boxShadow: {
        lift: "0 18px 40px rgba(24, 33, 43, 0.14)",
        button: "0 4px 0 rgba(24, 33, 43, 0.2)",
      },
      fontFamily: {
        display: ["Nunito", "Arial", "sans-serif"],
        body: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

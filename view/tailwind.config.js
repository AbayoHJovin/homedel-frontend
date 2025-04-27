/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    screens: {
      sssm: "320px",
      xsm: "386px",
      smm: "400px",
      ssm: "550px",
      sm: "640px",
      md: "768px",
      xmd: "960px",
      lg: "1024px",
      xlg: "1160px",
    },
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
        playfair: ["Playfair Display", "serif"],
        cormorant: ["Cormorant", "serif"],
        robotoSlab: ["Roboto Slab", "serif"],
        arvo: ["Arvo", "serif"],
        pacifico: ["Pacifico", "cursive"],
        dancingScript: ["Dancing Script", "cursive"],
      }
      
    },
  },
  plugins: [],
};

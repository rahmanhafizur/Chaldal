// CHALDAL/client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Correctly targets files in client/src
    "./public/index.html",         // Correctly targets public/index.html inside client
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
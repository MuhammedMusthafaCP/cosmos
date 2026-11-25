/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'extra-light': 50,
        'super-light': 50,
      },
    },
  },
  plugins: [
    require('preline/plugin'),
    require("daisyui")
  ],
}
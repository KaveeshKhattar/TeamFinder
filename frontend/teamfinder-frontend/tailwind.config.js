/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        flicker: 'flicker 1s infinite', // Define flicker animation
      },
      keyframes: {
        flicker: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'orange' }, // Change to your desired color
        },
      },
    },
  },
  plugins: [],
}
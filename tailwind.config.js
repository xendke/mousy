/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7c6fe0',
          light: '#ede9fb',
        },
        pastel: {
          lavender: '#e8e4f8',
          mint: '#d4f0e8',
          peach: '#fde8d8',
          sky: '#daeeff',
          pink: '#fde4ee',
          yellow: '#fef6d0',
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#073D42',
          light: '#96D1DC',
          white: '#FFFFFF',
        },
        secondary: {
          yellow: '#F7EA78',
          green: '#BCFBC6',
          purple: '#958EDA',
          'light-purple': '#B9ABED',
          gray: '#515151',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

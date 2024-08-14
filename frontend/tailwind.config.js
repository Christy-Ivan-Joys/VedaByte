/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        HeaderColor: '#55DED5',
        Black: '#11141a',
        DarkBlue: '#03045E',
        mediumBlue: '#0077B6',
        lightBlue: '#00B4D8',
        DarkGrey: '#2E2E2E',
        purple: '#6c34af',
        navy: '#111120',
        endgreen: '#0A291E',
        startgreen: '#264D3F',
        middlegreen: '#1A3D31',
        buttonGreen: '#25AB7C',
        myBlue: '#030727',
        coursePink: '#F4EDDF',
        Flurocent: '#2CFF05',
        // Flurocent:'#53FF33'
        ScreamingGreen: '#7EFF66',
        MintGreen: '#A9FF99',
        SnowGreen: '#D4FECC',
        cyan:'#00EDA4',
        buttonBlue:'#28C3C1',
        buttonEndBlue:'#6483EC',
        backgroundImage: {
          'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-gradient': {
          background: 'linear-gradient(to right, #2f57ef, #b966e7, #b966e7)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'text-fill-color': 'transparent',
        },
      }, ['responsive', 'hover']);
    },
  ],
}


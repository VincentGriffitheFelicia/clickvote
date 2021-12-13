module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'bp-850': '850px',

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      transparent: 'transparent',
      main: {
        1: '#1C1C27',
        2: '#28293D',
        3: '#3C3D5B',
        4: '#4B4E73',
        5: '#797DB8',
        6: '#9195DC',
        7: '#A7ABFD',
        8: '#DFDFFD',
      },
      accent: {
        1: '#AC5CD9',
        2: '#B370D9'
      },
      danger: {
        light: '#ffd8d8',
        DEFAULT: '#FF3B3B',
        dark: '#e63535',
      }
    },
    extend: {},
  },
  variants: {
    extend: {
      placeholderColor: ['hover', 'active'],
      opacity: ['disabled']
    },
  },
  plugins: [],
}
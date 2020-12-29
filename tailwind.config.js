// See default config https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
module.exports = {
  theme: {
    colors: {
      theme: '#05560D',
      theme2: '#057711',
      dark: '#333333',
      grey: '#F3F3F3',
      lgrey: '#F9F9F9',
      white: '#FFFFFF',
      red: '#da1f1f',
      red2: '#bb3434'
    },
    screens: {
      'xs': {'max': '500px'},

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }

      'md': {'max': '800px'},
      // => @media (max-width: 767px) { ... }

      'lg': {'max': '1000px'},
      // => @media (max-width: 1023px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }
      'xl2': {'max': '1400px'},
      // => @media (max-width: 1279px) { ... }
    },
    extend: {}
  },
  variants: {}
}

// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss')({

    // Specify the paths to all of the template files in your project 
    content: [
      './pages/**/*.vue',
      './layouts/**/*.vue',
      './components/**/*.vue',
      './src/**/*.html',
      './src/**/*.vue',
      './src/**/*.jsx',
      // etc.
    ],
  
    // Include any special characters you're using in this regular expression
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  })
  
  module.exports = {
    parser: 'postcss-scss',
    plugins: [
      require('precss'),
      require('tailwindcss'),
      require('autoprefixer')
      // ...process.env.NODE_ENV === 'production'
      //   ? [purgecss]
      //   : []
    ]
  }
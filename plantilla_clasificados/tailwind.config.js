const withMT = require('@material-tailwind/react/utils/withMT')
module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'

  ],
  theme: {
    extend: {
      colors: {
        paleta: {
          500: '#59AD4D',
          900: '#27275b',
          800: '#b43a34'
        }
      },
      backgroundColor: {
        dynamic: 'var(--color-dynamic)'
      },
      textColor: {
        dynamic: 'var(--color-dynamic)'
      },
      borderColor: {
        dynamic: 'var(--color-dynamic)'
      }
    }
  },
  plugins: []
})

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './public/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Define tus colores personalizados aquí
        main: '#06D7A0',
        darKmain: '#09c08f',
        secondary: '#F4D35F',
        azul_serio: '#001D3F',
        azul_serio_dark: '#001733',
        nigga: '#000916',
        gris: '#DBDBDB'
      },
      fontFamily: {
        ysobel_regular: ['Ysobel W01', 'sans-serif'],
        SpartanMedium: ['Ysobel W01', 'sans-serif']
      }
    }
  },
  plugins: []
}
export default config

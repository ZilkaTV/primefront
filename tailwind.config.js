/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#05070d',
          900: '#0a0e18',
          850: '#0e1422',
          800: '#131a2b',
          700: '#1b2438',
          600: '#28324a',
          500: '#3c4864',
        },
        accent: {
          DEFAULT: '#ff7a1a',
          light: '#ffa85c',
          dark: '#e5620a',
        },
        signal: {
          green: '#33d17a',
          red: '#ef4444',
          blue: '#3b9dff',
          gold: '#f2c14e',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at 50% 0%, rgba(255,122,26,0.12), transparent 60%)',
      },
    },
  },
  plugins: [],
}

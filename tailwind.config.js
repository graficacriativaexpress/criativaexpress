/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#ebe3d1',
          300: '#e1d5ba',
          400: '#d7c7a3',
          500: '#cdb98c',
          600: '#c3ab75',
          700: '#b99d5e',
          800: '#8b7644',
          900: '#5d502e',
        },
        accent: {
          50: '#fef9f3',
          100: '#fef3e7',
          200: '#fce7cf',
          300: '#fadbb7',
          400: '#f8cf9f',
          500: '#f6c387',
          600: '#f4b76f',
          700: '#f2ab57',
          800: '#d4933f',
          900: '#b67b27',
        },
        dark: {
          50: '#f8f7f6',
          100: '#f1efed',
          200: '#e3dfdb',
          300: '#d5cfc9',
          400: '#c7bfb7',
          500: '#b9afa5',
          600: '#9b9189',
          700: '#7d796d',
          800: '#5f5b51',
          900: '#413d35',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'elegant': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'premium': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

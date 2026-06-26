/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#1a56db',
          700: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          100: '#ede9fe',
          500: '#7c3aed',
          600: '#4f46e5',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(20px)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
        fadeUp: {
          from: { transform: 'translateY(16px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

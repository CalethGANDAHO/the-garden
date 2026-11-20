/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'oklch(17% 0.024 235)',
        foreground: 'oklch(96% 0.008 200)',
        primary: {
          DEFAULT: '#22d3ee',
          foreground: '#0b1320',
        },
        leaf: '#4ade80',
        neon: '#22d3ee',
        secondary: {
          DEFAULT: 'oklch(28% 0.03 235)',
          foreground: 'oklch(95% 0.01 200)',
        },
        muted: {
          DEFAULT: 'oklch(26% 0.025 235)',
          foreground: 'oklch(72% 0.02 220)',
        },
        accent: {
          DEFAULT: 'oklch(74% 0.14 65)',
          foreground: '#0f172a',
        },
        border: 'oklch(34% 0.03 225)',
      },
      fontFamily: {
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(26px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        rise: 'rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}

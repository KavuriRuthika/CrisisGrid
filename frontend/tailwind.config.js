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
        command: {
          bg: '#0b0f19',
          card: '#131b2e',
          border: '#1e293b',
          accent: '#06b6d4',
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          resolved: '#22c55e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

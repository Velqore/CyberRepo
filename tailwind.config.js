/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(34, 211, 238, 0.4), 0 0 8px -1px rgba(34, 211, 238, 0.2)',
        'neon-blue': '0 0 20px -3px rgba(59, 130, 246, 0.4), 0 0 8px -1px rgba(59, 130, 246, 0.2)',
        'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.4), 0 0 8px -1px rgba(16, 185, 129, 0.2)',
        'neon-purple': '0 0 20px -3px rgba(168, 85, 247, 0.4), 0 0 8px -1px rgba(168, 85, 247, 0.2)',
        'neon-amber': '0 0 20px -3px rgba(245, 158, 11, 0.4), 0 0 8px -1px rgba(245, 158, 11, 0.2)',
      },
    },
  },
  plugins: [],
};

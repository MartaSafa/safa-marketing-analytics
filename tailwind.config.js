/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sidebar:  '#0D1526',
        primary:  '#2B6BE8',
        'primary-light': '#EBF0FD',
        success:  '#0EA874',
        warning:  '#F59E0B',
        danger:   '#EF4444',
        meta:     '#1877F2',
        google:   '#EA4335',
        bg:       '#EEF2FB',
        surface:  '#FFFFFF',
        't1':     '#0F1827',
        't2':     '#5C6A82',
        't3':     '#9CA3AF',
        border:   'rgba(15, 24, 39, 0.08)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}

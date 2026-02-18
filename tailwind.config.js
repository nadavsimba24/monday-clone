/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cu: {
          bg: '#f7f8fa',
          card: '#ffffff',
          text: '#1f2328',
          muted: '#6b7280',
          border: '#e6e9ef',
          primary: '#6d5efc',
          primary2: '#8a7bff',
        },
      },
      borderRadius: {
        cu: '12px',
      },
      boxShadow: {
        cu: '0 10px 30px rgba(16, 24, 40, 0.12)',
      },
    },
  },
  plugins: [],
};

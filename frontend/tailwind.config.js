/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saasflow: {
          accent: {
            DEFAULT: '#4F46E5',
            hover: '#4338CA',
            light: '#EEF2FF',
          },
          slate: {
            canvas: '#F8FAFC',
            surface: '#FFFFFF',
            sidebar: '#0F172A',
            surfaceDark: '#1E293B',
            borderDark: '#334155',
            border: '#E2E8F0',
            textPrimary: '#0F172A',
            textSecondary: '#475569',
            textMuted: '#94A3B8',
          },
          status: {
            success: '#10B981',
            successBg: '#D1FAE5',
            danger: '#EF4444',
            dangerBg: '#FEE2E2',
            warning: '#F59E0B',
            warningBg: '#FEF3C7',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 4px 12px 0px rgba(0, 0, 0, 0.05)',
        dropdown: '0px 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        card: '12px',
        pill: '100px',
      }
    }
  },
  plugins: [],
}

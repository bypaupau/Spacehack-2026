/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // ── Deep glacier system ──────────────────────────────────────────────
        glacier: {
          50:  '#EAF5FC',
          100: '#C8E6F5',
          200: '#96CEE8',
          300: '#5AAFD9',
          400: '#2D8BC4',
          500: '#1A6FA3',
          600: '#115585',
          700: '#0B3D65',
          800: '#072947',
          900: '#041A2E',
        },
        // ── Ember / fire system (false claims, alarm) ───────────────────────
        ember: {
          50:  '#FEF2EC',
          100: '#FBDBC8',
          200: '#F6BA95',
          300: '#EE9162',
          400: '#E8572A',
          500: '#C83D14',
          600: '#A02B0C',
          700: '#7A1E07',
        },
        // ── Verified / forest green ─────────────────────────────────────────
        forest: {
          50:  '#E0F5EC',
          100: '#A8E0C5',
          400: '#2DAF78',
          500: '#1A8A5A',
          600: '#116B43',
          700: '#0A4C2F',
        },
        // ── Amber / misleading ──────────────────────────────────────────────
        amber: {
          50:  '#FEF8E0',
          300: '#E8D485',
          400: '#D4A810',
          500: '#B8900C',
        },
        // ── Semantic verdict shortcuts ──────────────────────────────────────
        false:       { DEFAULT: '#E8572A', bg: '#FEF2EC', border: '#F6BA95' },
        verified:    { DEFAULT: '#1A8A5A', bg: '#E0F5EC', border: '#A8E0C5' },
        misleading:  { DEFAULT: '#B8900C', bg: '#FEF8E0', border: '#E8D485' },
        // ── Base surface tokens ─────────────────────────────────────────────
        ink:    '#041A2E',
        body:   '#0B3D65',
        muted:  '#4A7A96',
        ghost:  '#8AAFC4',
        border: 'rgba(74,150,200,0.22)',
        glass:  'rgba(255,255,255,0.72)',
        paper:  '#F0F8FD',
        ice:    { DEFAULT: '#5AAFD9', dark: '#1A6FA3', light: '#C8E6F5' },
      },
      backgroundImage: {
        // Used for the animated gradient — class applied with JS-computed positions
        'climate-gradient': 'linear-gradient(-45deg, #C8E6F5, #DDEEF8, #F5EDE0, #F5D0B0, #DDEEF8)',
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease forwards',
        'slide-up':     'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'spin-slow':    'spin 2s linear infinite',
        'gradient-bg':  'gradientFlow 45s ease infinite',
        'snowfall':     'snowfall linear infinite',
        'pulse-soft':   'pulseSoft 3s ease-in-out infinite',
        'bounce':       'bounce 2s ease-in-out infinite',
        'glow-false':   'glowFalse 2s ease-in-out infinite',
        'glow-verified':'glowVerified 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:         { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:        { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        gradientFlow:   {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        snowfall: {
          '0%':   { transform: 'translateY(-20px) translateX(0px)',   opacity: 0   },
          '8%':   { opacity: 1 },
          '92%':  { opacity: 0.7 },
          '100%': { transform: 'translateY(110vh) translateX(var(--drift, 15px))', opacity: 0 },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(4px)' },
        },
        pulseSoft:      {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: 0.6 },
        },
        glowFalse:      {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232,87,42,0)' },
          '50%':      { boxShadow: '0 0 20px 4px rgba(232,87,42,0.18)' },
        },
        glowVerified:   {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(26,138,90,0)' },
          '50%':      { boxShadow: '0 0 20px 4px rgba(26,138,90,0.18)' },
        },
      },
      backdropBlur: { xs: '4px' },
      boxShadow: {
        glass: '0 8px 32px rgba(4, 26, 46, 0.08), 0 1px 2px rgba(4,26,46,0.04)',
        'glass-lg': '0 16px 48px rgba(4, 26, 46, 0.12), 0 2px 4px rgba(4,26,46,0.06)',
        'verdict-false': '0 4px 20px rgba(232,87,42,0.2)',
        'verdict-verified': '0 4px 20px rgba(26,138,90,0.2)',
      },
    },
  },
  plugins: [],
}

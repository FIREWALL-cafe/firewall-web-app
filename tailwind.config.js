/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // FeatureCard colors sourced dynamically from Sanity CMS
    'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-500', 'bg-red-600',
    'bg-white', 'bg-black',
    'text-white', 'text-black', 'text-red-600',
    'border-transparent', 'border-red-500', 'border-red-600', 'border-black',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'newsletter': "url('assets/images/subscribe-text_background.jpg')", // Path relative to tailwind.config.js
      },
      screens: {
        'macbook': '1280px',    // MacBook Air 3
        'ipad-landscape': '962px', // iPad Mini 8.3 landscape
        'ipad-portrait': '744px',   // iPad Mini portrait
        'iphone': '320px',      // iPhone 14
      },
      colors: {
        // Neutral colors
        neutral: {
          50: '#fbfbfc',
          100: '#f5f7f9',
          200: '#eff2f5',
          300: '#e8edf1',
          400: '#dde3e8',
          500: '#b9c0c7',
          600: '#8d969e',
          700: '#484e55',
          800: '#2e3238',
          900: '#1f2124',
          1000: '#000000',
        },
        // Brand colors
        red: {
          100: '#fff6f8',
          200: '#ffe6e6',
          300: '#ffc8c8',
          400: '#ffa4a4',
          500: '#f55b5b',
          600: '#e81717',
          650: '#d70000',
          700: '#ad1a1a',
          800: '#971920',
          900: '#750a11',
        },
        blue: {
          100: '#eefbfd',
          200: '#d3f1f8',
          300: '#afe3f0',
          400: '#7ecde4',
          500: '#3aaed7',
          600: '#3486ab',
          700: '#2a5a75',
          800: '#233d50',
          900: '#162936',
        },
        green: {
          100: '#e1fff2',
          200: '#baf2db',
          300: '#a3e1c8',
          400: '#8bceb1',
          500: '#5ea580',
          600: '#26603e',
          700: '#1e472e',
          800: '#162f22',
          900: '#0d1915',
        },
        yellow: {
          100: '#fff0d0',
          200: '#ffe29e',
          300: '#ffd670',
          400: '#ffc84b',
          500: '#ffbc35',
          600: '#c79122',
          700: '#92691a',
          800: '#5f4313',
          900: '#31220a',
        },
        orange: {
          100: '#ffe0d2',
          200: '#ffc5a1',
          300: '#fdaa70',
          400: '#fb8f40',
          500: '#f77623',
          600: '#c05b1d',
          700: '#8d4317',
          800: '#5c2a11',
          900: '#30150a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'sc-sans': ['Noto Sans SC', 'system-ui', 'sans-serif'],
        'bitmap-song': ['WenQuanYi', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display
        'display-01': ['72px', { lineHeight: '120%', letterSpacing: '3%', fontWeight: '500' }],
        'display-02': ['64px', { lineHeight: '110%', letterSpacing: '0%', fontWeight: '500' }],
        'display-03': ['56px', { lineHeight: '100%', letterSpacing: '0%', fontWeight: '500' }],
        'display-04': ['48px', { lineHeight: '120%', letterSpacing: '0%', fontWeight: '500' }],
        // Header
        'header-01': ['40px', { lineHeight: '110%', letterSpacing: '0%', fontWeight: '500' }],
        'header-02': ['36px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '500' }],
        'header-03': ['28px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '500' }],
        'header-04': ['36px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '400' }],
        // Body
        'body-01': ['24px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '400' }],
        'body-02': ['20px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '400' }],
        'body-02-bold': ['20px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '600' }],
        'body-02-bold-sm': ['20px', { lineHeight: '120%', letterSpacing: '0%', fontWeight: '600' }],
        'body-03': ['17px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '400' }],
        'body-03-medium': ['17px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '500' }],
        'body-03-bold': ['17px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '600' }],
        'body-04': ['15px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '400' }],
        'body-04-medium': ['15px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '500' }],
        'body-04-bold': ['15px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '600' }],
      },
      boxShadow: {
        'elevation-1': '0px 2px 6px 0px rgba(0, 0, 0, 0.1)',
        'section-rounded': '0px -1px 11px 0px rgba(0, 0, 0, 0.2)',
        'voting-active': 'inset 1px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        'button-hover': '3px 3px 0px 0px rgba(0, 0, 0, 1)',
        'tag-default': '1px 1px 6px 0px rgba(0, 1, 35, 0.4)',
        'popover': '2px 2px 6px 0px rgba(0, 17, 42, 0.06)',
        'active-photo': [
          '2px 2px 3px 0px rgba(6, 14, 34, 0.2)',
          '1px 1px 1px 0px rgba(8, 16, 36, 0.2)'
        ],
        'search-results': '1px 1px 8px 0px rgba(0, 0, 0, 0.05)',
        'text-on-image': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        'focus-ring': '0px 0px 0px 3px rgba(0, 0, 0, 0.15)',
        'bottom-bar': '-1px -1px 8px 3px rgba(0, 0, 0, 0.05)',
        'bottom-sheet': '0px -2px 10px 0px rgba(0, 0, 0, 0.3)',
        'event-thumb': '3px 3px 2px 0px rgba(0, 0, 0, 0.24)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.font-display-01': {
          fontSize: '72px',
          lineHeight: '120%',
          letterSpacing: '3%',
          fontWeight: '500'
        },
        '.font-display-02': {
          fontSize: '64px',
          lineHeight: '110%',
          letterSpacing: '0%',
          fontWeight: '500'
        },
        '.font-display-03': {
          fontSize: '56px',
          lineHeight: '100%',
          letterSpacing: '0%',
          fontWeight: '500'
        },
        '.font-display-04': {
          fontSize: '48px',
          lineHeight: '120%',
          letterSpacing: '0%',
          fontWeight: '500'
        },
        '.font-header-01': {
          fontSize: '40px',
          lineHeight: '110%',
          letterSpacing: '0%',
          fontWeight: '500'
        },
        '.font-header-02': {
          fontSize: '36px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '500'
        },
        '.font-header-03': {
          fontSize: '28px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '500'
        },
        '.font-header-04': {
          fontSize: '36px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '400'
        },
        '.font-body-01': {
          fontSize: '24px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '400',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-02': {
          fontSize: '20px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '400',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-02-bold': {
          fontSize: '20px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '600',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-02-bold-sm': {
          fontSize: '20px',
          lineHeight: '120%',
          letterSpacing: '0%',
          fontWeight: '600',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-03': {
          fontSize: '17px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '400',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-03-medium': {
          fontSize: '17px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-03-bold': {
          fontSize: '17px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '600',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-04': {
          fontSize: '15px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '400',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-04-medium': {
          fontSize: '15px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        '.font-body-04-bold': {
          fontSize: '15px',
          lineHeight: '150%',
          letterSpacing: '0%',
          fontWeight: '600',
          fontFamily: 'Inter, system-ui, sans-serif'
        }
      }
      addUtilities(newUtilities)
    }
  ],
  variants: {
    position: ['responsive'],
    inset: ['responsive'],
  }
}


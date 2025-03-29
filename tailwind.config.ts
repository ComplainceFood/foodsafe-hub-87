import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Updated color definitions for better contrast and visibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: {
          light: '#FAFAFA', // Light background for tables and sections
          dark: '#1F2937', // Dark background for headers or sidebars
          DEFAULT: 'hsl(var(--background))',
        },
        foreground: {
          light: '#374151', // Dark gray text for light backgrounds
          dark: '#E5E7EB', // Light gray text for dark backgrounds
          DEFAULT: 'hsl(var(--foreground))',
        },
        primary: {
          DEFAULT: '#2563EB', // Vibrant blue for primary elements
          dark: '#1E40AF',    // Deep navy blue for headers or CTAs
          light: '#93C5FD',   // Soft sky blue for hover states
          foreground: '#FFFFFF', // White text on primary buttons
        },
        secondary: {
          DEFAULT: '#F3F4F6', // Neutral gray for secondary elements
          foreground: '#374151', // Dark gray text for secondary buttons
        },
        destructive: {
          DEFAULT: '#EF4444', // Red for destructive actions or alerts
          foreground: '#FFFFFF', // White text on destructive buttons
        },
        accent: {
          DEFAULT: '#F59E0B',  // Bright amber for highlights or warnings
          light: '#FCD34D',    // Soft yellow for hover states
          dark: '#B45309',     // Deep amber for badges or emphasis
          foreground: '#FFFFFF', // White text on accent elements
        },
        success: {
          DEFAULT: '#10B981', // Vibrant green for success badges or statuses
          foreground: '#FFFFFF', // White text on success badges
        },
        warning: {
          DEFAULT: '#F97316', // Orange for warnings or caution badges
          foreground: '#FFFFFF', // White text on warning badges
        },
        info: {
          DEFAULT: '#0EA5E9', // Blue for informational badges or links
          foreground: '#FFFFFF', // White text on info badges
        },
        charcoal: {
          DEFAULT: '#4A4A4A', // Main charcoal color for headings and labels
          light: '#6C757D',   // Lighter charcoal for secondary text or muted descriptions
          muted: '#8F9498',   // Muted charcoal for less emphasis elements
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Clean and modern sans-serif font for body text
        display: ['Poppins', 'system-ui', 'sans-serif'], // Elegant display font for headings and titles
        mono: ['JetBrains Mono', 'monospace'], // Monospaced font for code or technical sections
      },
      borderColor(theme) {
        return {
          ...theme('colors'),
          DEFAULT: theme('colors.border', 'currentColor'),
        };
      },
      borderOpacity: {
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
      },
      backgroundImage(theme) {
        return {
          ...theme('backgroundImage'),
          gradientPrimary:
            'linear-gradient(90deg, #2563EB 0%, #93C5FD 100%)',
          gradientAccent:
            'linear-gradient(90deg, #F59E0B 0%, #FCD34D 100%)',
        };
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;


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
        // All your existing color definitions...
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#1E4D8C', // Professional blue
          dark: '#15325E',    
          light: '#4799FF',   
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#F0F4F8',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#D5A021',  // Refined gold
          light: '#F3CF71',    
          dark: '#B2851C',     
          foreground: 'hsl(var(--accent-foreground))',
        },
        // Adding the missing color definitions
        warning: {
          DEFAULT: '#FFC107', // Yellow for warnings
          foreground: '#4A4A4A', // Dark text for contrast
        },
        success: {
          DEFAULT: '#2E8B57', // Teal for success
          foreground: '#FFFFFF', // White text
        },
        info: {
          DEFAULT: '#0EA5E9', // Blue for info
          foreground: '#FFFFFF', // White text
        },
        // Adding charcoal colors for backward compatibility
        charcoal: {
          DEFAULT: '#4A4A4A', // Main charcoal color
          light: '#6C757D',   // Lighter charcoal
          muted: '#8F9498',   // Muted charcoal for less emphasis
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
        secondary: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Rest of your theme configurations...
      borderColor: theme => ({
        ...theme('colors'),
        DEFAULT: theme('colors.border', 'currentColor'),
      }),
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
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
} satisfies Config;

export default config;

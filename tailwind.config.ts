import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

export default {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: 'hsl(var(--background))',
                    light: 'hsl(var(--background-light))',
                },
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
            },
            fontSize: {
                // Typography System - Mobile First, Progressive Enhancement
                // Display Sizes (Hero Titles)
                'display-sm': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],      // 48px
                'display-md': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],    // 56px
                'display-lg': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],    // 72px
                'display-xl': ['5.625rem', { lineHeight: '1', letterSpacing: '-0.02em' }],  // 90px

                // Heading Sizes
                'heading-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],  // 30px
                'heading-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],   // 36px
                'heading-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],      // 48px

                // Body Sizes
                'body-sm': ['0.875rem', { lineHeight: '1.5' }],   // 14px
                'body-base': ['1rem', { lineHeight: '1.5' }],     // 16px
                'body-lg': ['1.125rem', { lineHeight: '1.5' }],   // 18px
                'body-xl': ['1.25rem', { lineHeight: '1.5' }],    // 20px

                // UI Elements
                'ui-xs': ['0.625rem', { lineHeight: '1.4' }],     // 10px
                'ui-sm': ['0.75rem', { lineHeight: '1.4' }],      // 12px
                'ui-base': ['0.875rem', { lineHeight: '1.4' }],   // 14px
                'ui-lg': ['1rem', { lineHeight: '1.4' }],         // 16px
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            fontFamily: {
                anton: ['var(--font-anton)'],
                'roboto-flex': ['var(--font-roboto-flex)'],
            },
            padding: {
                section: '60px',
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '0.75rem',
                    xs: '1rem',
                    sm: '1.5rem',
                    md: '2rem',
                    lg: '2rem',
                    xl: '2rem',
                },
                screens: {
                    xs: '100%',
                    sm: '640px',
                    md: '768px',
                    lg: '1024px',
                    xl: '1148px',
                    '2xl': '1148px',
                },
            },
            transitionDuration: {
                '7000': '7s',
            },
            transitionTimingFunction: {
                'menu': 'cubic-bezier(0.65, 0, 0.35, 1)',
                'slide': 'cubic-bezier(0.77, 0, 0.175, 1)',
            },
            screens: {
                xs: '420px',
            },
        },
    },
    plugins: [tailwindAnimate],
} satisfies Config;

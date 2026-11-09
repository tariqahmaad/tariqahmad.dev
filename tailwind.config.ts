import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
    darkMode: ['class'],
    future: {
        // `hover:` / `group-hover:` only apply on devices that really hover.
        // Without it a tap leaves the element "hovered" until the next tap
        // elsewhere (stuck wipes, glows and brackets on phones).
        hoverOnlyWhenSupported: true,
    },
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx}',
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
                    // Referenced by the error fallbacks (app/error.tsx,
                    // ErrorBoundary, GlobalErrorFallback). Without this key the
                    // class was silently purged and the hover state did nothing.
                    hover: 'hsl(var(--primary) / 0.85)',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                subtle: 'hsl(var(--subtle))',
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
                'display-sm': [
                    '3rem',
                    { lineHeight: '1', letterSpacing: '-0.02em' },
                ], // 48px — must stay below display-md: `text-display-sm
                // sm:text-display-md` (app/not-found.tsx) shrank on larger
                // screens while sm was 64px > md's 56px.
                'display-md': [
                    '3.5rem',
                    { lineHeight: '1', letterSpacing: '-0.02em' },
                ], // 56px
                'display-lg': [
                    '4.5rem',
                    { lineHeight: '1', letterSpacing: '-0.02em' },
                ], // 72px
                'display-xl': [
                    '5.625rem',
                    { lineHeight: '1', letterSpacing: '-0.02em' },
                ], // 90px

                // Heading Sizes
                'heading-sm': [
                    '1.875rem',
                    { lineHeight: '1.2', letterSpacing: '-0.01em' },
                ], // 30px
                'heading-md': [
                    '2.25rem',
                    { lineHeight: '1.2', letterSpacing: '-0.01em' },
                ], // 36px
                'heading-lg': [
                    '3rem',
                    { lineHeight: '1.2', letterSpacing: '-0.01em' },
                ], // 48px

                // Body Sizes
                'body-sm': ['0.875rem', { lineHeight: '1.5' }], // 14px
                'body-base': ['1rem', { lineHeight: '1.5' }], // 16px
                'body-lg': ['1.125rem', { lineHeight: '1.5' }], // 18px
                'body-xl': ['1.25rem', { lineHeight: '1.5' }], // 20px

                // UI Elements
                'ui-xs': ['0.625rem', { lineHeight: '1.4' }], // 10px
                'ui-sm': ['0.75rem', { lineHeight: '1.4' }], // 12px
                'ui-base': ['0.875rem', { lineHeight: '1.4' }], // 14px
                'ui-lg': ['1rem', { lineHeight: '1.4' }], // 16px
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
            transitionTimingFunction: {
                // Menu panel / rows: a decelerating curve on the way in and a
                // quicker accelerating one on the way out. Tuned for phones,
                // where the panel covers the full viewport width.
                'menu-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
                'menu-close': 'cubic-bezier(0.4, 0, 0.6, 1)',
            },
            keyframes: {
                // NOT dead code: app/(site)/loading.tsx runs it through an
                // arbitrary value (`animate-[scan_1.6s_ease-in-out_infinite]`),
                // which a search for `animate-scan` or a word-boundary `scan`
                // never finds. Tailwind emits a keyframe for any name it spots
                // in an animation value, so this definition is what animates
                // the loading bar.
                scan: {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' },
                },
                // Console trigger: one bright band crosses the button as it
                // locks. Runs once per click, so it is not `infinite`.
                'search-scan': {
                    '0%': {
                        transform: 'translateX(-160%) skewX(-12deg)',
                        opacity: '0',
                    },
                    '12%': { opacity: '1' },
                    '100%': {
                        transform: 'translateX(320%) skewX(-12deg)',
                        opacity: '0',
                    },
                },
                'check-pop': {
                    '0%': { transform: 'scale(0)', opacity: '0' },
                    '70%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'tray-pulse': {
                    '0%': { transform: 'scaleY(1)', opacity: '0.6' },
                    '30%': { transform: 'scaleY(1)', opacity: '0.6' },
                    '35%': { transform: 'scaleY(0.8)', opacity: '1' },
                    '45%': { transform: 'scaleY(1)', opacity: '0.6' },
                    '100%': { transform: 'scaleY(1)', opacity: '0.6' },
                },
                // CV button hover: arrow drops into the tray and fades,
                // then resets — loops while hovered.
                'download-drop': {
                    '0%': { transform: 'translateY(-5px)', opacity: '0' },
                    '30%': { transform: 'translateY(0)', opacity: '1' },
                    '70%': {
                        transform: 'translateY(5px)',
                        opacity: '1',
                    },
                    '100%': {
                        transform: 'translateY(10px)',
                        opacity: '0',
                    },
                },
                // ProjectCard hover arrow glitch. One 2.4s cycle shared by the
                // main glyph and both RGB echoes so they read as a single
                // event: a ~290ms burst right at touchdown (the animation is
                // delayed until the glide lands, see below), then stillness
                // until the next burst. Same rhythm as the hero — bursts, not
                // constant jitter — and `steps(1, end)` keeps each frame
                // digital: a keyframe's value holds until the next one.
                'arrow-glitch': {
                    '0%': { transform: 'translate(-2px, 1px) skewX(-8deg)' },
                    '3%': { transform: 'translate(2px, -1px) skewX(4deg)' },
                    '6%': { transform: 'translate(-1px, -1px) skewX(-3deg)' },
                    '9%': { transform: 'translate(1.5px, 1px)' },
                    '12%, 100%': { transform: 'translate(0, 0) skewX(0deg)' },
                },
                // Echoes: during the burst they shove outward and are cut into
                // clip-path slices (the hero's `glitch-anim` language); between
                // bursts they settle back to a faint, whole, offset fringe —
                // the hero's always-on chromatic edge. Rest values equal the
                // classes on the elements, so the hand-off is seamless.
                'arrow-ghost-cyan': {
                    '0%': {
                        opacity: '0.9',
                        transform: 'translate(6px, -3px)',
                        clipPath: 'inset(8% 0 60% 0)',
                    },
                    '3%': {
                        opacity: '0.9',
                        transform: 'translate(4px, -1px)',
                        clipPath: 'inset(56% 0 8% 0)',
                    },
                    '6%': {
                        opacity: '0.9',
                        transform: 'translate(7px, -4px)',
                        clipPath: 'inset(18% 0 46% 0)',
                    },
                    '9%': {
                        opacity: '0.9',
                        transform: 'translate(3px, -2px)',
                        clipPath: 'inset(66% 0 4% 0)',
                    },
                    '12%, 100%': {
                        opacity: '0.4',
                        transform: 'translate(2.5px, -2.5px)',
                        clipPath: 'inset(0 0 0 0)',
                    },
                },
                'arrow-ghost-red': {
                    '0%': {
                        opacity: '0.8',
                        transform: 'translate(-6px, 3px)',
                        clipPath: 'inset(40% 0 30% 0)',
                    },
                    '3%': {
                        opacity: '0.8',
                        transform: 'translate(-4px, 1px)',
                        clipPath: 'inset(4% 0 70% 0)',
                    },
                    '6%': {
                        opacity: '0.8',
                        transform: 'translate(-7px, 4px)',
                        clipPath: 'inset(62% 0 10% 0)',
                    },
                    '9%': {
                        opacity: '0.8',
                        transform: 'translate(-3px, 2px)',
                        clipPath: 'inset(24% 0 50% 0)',
                    },
                    '12%, 100%': {
                        opacity: '0.3',
                        transform: 'translate(-2px, 2px)',
                        clipPath: 'inset(0 0 0 0)',
                    },
                },
                // Lite LaunchArrow: the glyph sits fully drawn at rest and
                // re-draws itself once when its group is engaged.
                'arrow-redraw': {
                    from: { strokeDashoffset: '1' },
                    to: { strokeDashoffset: '0' },
                },
                // ProjectCard hover prompt cursor (the banner's blinking `_`
                // motif): a block blinks twice at the end of the title as if
                // awaiting input, then flashes wide as the command "executes"
                // and hands off to the arrow launch. 440ms, stepped so every
                // frame is a hard digital state; `forwards` leaves it gone.
                'arrow-cursor': {
                    '0%': { opacity: '1', transform: 'scale(1, 1)' },
                    '20%': { opacity: '0', transform: 'scale(1, 1)' },
                    '35%': { opacity: '1', transform: 'scale(1, 1)' },
                    '88%': { opacity: '1', transform: 'scale(2.4, 1.3)' },
                    '100%': { opacity: '0', transform: 'scale(2.4, 1.3)' },
                },
            },
            animation: {
                'search-scan':
                    'search-scan 360ms cubic-bezier(0.22, 1, 0.36, 1)',
                'check-pop': 'check-pop 0.4s ease-out forwards',
                'tray-pulse': 'tray-pulse 2.5s linear infinite',
                'download-drop':
                    'download-drop 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                // Hover timeline of the ProjectCard arrow (ms from hover-in):
                // 0 cursor blinks -> 300 arrow launches (flight, in the
                // component) -> ~950 touchdown, first glitch burst. The 950ms
                // in each glitch shorthand is the animation-delay; it sits in
                // the shorthand (not a separate utility) so it can never lose
                // a cascade tie.
                'arrow-redraw':
                    'arrow-redraw 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
                'arrow-cursor': 'arrow-cursor 440ms steps(1, end) forwards',
                'arrow-glitch': 'arrow-glitch 2.4s steps(1, end) 950ms infinite',
                'arrow-ghost-cyan':
                    'arrow-ghost-cyan 2.4s steps(1, end) 950ms infinite',
                'arrow-ghost-red':
                    'arrow-ghost-red 2.4s steps(1, end) 950ms infinite',
            },
            screens: {
                xs: '420px',
            },
        },
    },
    plugins: [
        plugin(({ addVariant }) => {
            // `group-engaged:` = an ancestor `.group` is hovered (on devices
            // that hover — the same media query `hoverOnlyWhenSupported` uses)
            // OR keyboard-focused. Hover-only effects never reached keyboard
            // users; this is the one switch that gives both the same reveal.
            addVariant('group-engaged', [
                '@media (hover: hover) and (pointer: fine) { .group:hover & }',
                '.group:focus-visible &',
            ]);
            // `no-hover:` = the primary input cannot hover (touch). Used for
            // resting states that desktop only gets on hover.
            addVariant('no-hover', '@media (hover: none)');
        }),
    ],
    safelist: [
        // Background position classes for gradient reveal animations
        'bg-left',
        'bg-right',
    ],
} satisfies Config;

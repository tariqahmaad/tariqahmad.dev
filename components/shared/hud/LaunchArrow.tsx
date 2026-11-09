import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';
import BracketFrame from './BracketFrame';

/**
 * The site's "launch" arrow: lucide-sized 24-unit geometry whose strokes draw
 * themselves in (each path carries `pathLength={1}` so CSS can animate the dash
 * in viewBox units — the trick from ArrowAnimation).
 *
 * Both exports key off the nearest-or-any ancestor `.group` through the
 * `group-engaged:` variant (tailwind.config.ts): hover on devices that hover,
 * OR keyboard focus-visible. The parent link/button must carry `group`.
 *
 * Never mirror an arrow with a CSS transform: the glitch/echo keyframes own
 * `transform`. Pick a `direction` instead.
 */

export type ArrowDirection = 'up-right' | 'left' | 'right';

const PATHS: Record<ArrowDirection, readonly [string, string]> = {
    'up-right': ['M7 7h10v10', 'M7 17 17 7'],
    left: ['M19 12H5', 'M12 19l-7-7 7-7'],
    right: ['M5 12h14', 'M12 5l7 7-7 7'],
};

interface LaunchArrowProps {
    className?: string;
    direction?: ArrowDirection;
    /**
     * `hidden` (default): undrawn until engaged, then strokes in. On touch
     * (`no-hover`) it rests fully drawn.
     * `drawn`: visible at rest and re-draws itself once when engaged — for
     * arrows that are always on screen (buttons, back links).
     */
    rest?: 'hidden' | 'drawn';
    /**
     * `drawn` only: the classes that replay the draw. Defaults to the plain
     * `group` trigger. Pass named-group classes (`group-hover/x:animate-arrow-redraw
     * group-focus-visible/x:animate-arrow-redraw`) when the arrow sits inside
     * ANOTHER `group` (a hoverable card): unnamed group variants match any
     * hovered ancestor group, so the arrow would replay whenever the whole card
     * is hovered instead of only its own button.
     */
    redrawClassName?: string;
    /**
     * Stagger for the stroke draw and the fade. It travels as a CSS variable and
     * is applied only when engaged, so the delay holds the arrow back on the way
     * in but never slows the exit. (A `delay-*` class is not an option for odd
     * values: the scale has no `delay-250`, and a missing class silently emits
     * no CSS.)
     */
    delayMs?: number;
}

export const LaunchArrow = ({
    className,
    direction = 'up-right',
    rest = 'hidden',
    redrawClassName = 'group-engaged:animate-arrow-redraw',
    delayMs = 0,
}: LaunchArrowProps) => {
    const delay = { '--arrow-delay': `${delayMs}ms` } as CSSProperties;

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={cn(
                className,
                'group-engaged:[transition-delay:var(--arrow-delay)]',
            )}
            style={delay}
        >
            {PATHS[direction].map((d) => (
                <path
                    key={d}
                    d={d}
                    pathLength={1}
                    className={
                        rest === 'drawn'
                            ? cn(
                                  '[stroke-dasharray:1] [stroke-dashoffset:0] motion-reduce:animate-none',
                                  redrawClassName,
                              )
                            : '[stroke-dasharray:1] [stroke-dashoffset:1] no-hover:[stroke-dashoffset:0] group-engaged:[stroke-dashoffset:0] group-engaged:[transition-delay:var(--arrow-delay)] transition-[stroke-dashoffset] duration-500 ease-out'
                    }
                />
            ))}
        </svg>
    );
};

// Which end of the title the arrow lives on, and so which way it is parked
// (over the title's edge) before it launches. Written out as whole literal
// strings so Tailwind's scanner sees every class.
const SIDE = {
    end: {
        cursor: 'left-0',
        parked: '-translate-x-[45%] -rotate-[30deg]',
    },
    start: {
        cursor: 'right-0',
        parked: 'translate-x-[45%] rotate-[30deg]',
    },
} as const;

const DEFAULT_SIZE = 'w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8';

interface ArrowLaunchSlotProps {
    /** `end`: arrow after the title (default). `start`: before it. */
    side?: keyof typeof SIDE;
    direction?: ArrowDirection;
    /** Width/height classes for the glyph (default scales 20 -> 32px). */
    size?: string;
    className?: string;
}

/**
 * The full launch sequence, as one slot to drop next to a title.
 *
 * The slot is the only in-flow box, so everything inside can move freely
 * without ever shifting the layout. Timeline (ms from engage):
 *   0    the prompt cursor (the banner's blinking `_`) blinks at the title's edge
 *   300  the arrow launches out of it: glide, blur/rotate/scale settle
 *   ~950 touchdown: strokes finished, brackets closed, first glitch burst
 * then a ~290ms burst every 2.4s (see `arrow-glitch` / `arrow-ghost-*` in
 * tailwind.config.ts). On touch it rests visible and still.
 */
export const ArrowLaunchSlot = ({
    side = 'end',
    direction = 'up-right',
    size = DEFAULT_SIZE,
    className,
}: ArrowLaunchSlotProps) => (
    <span
        aria-hidden="true"
        className={cn('relative inline-flex flex-shrink-0', className)}
    >
        {/* Prompt cursor: a hard square block that blinks twice as if awaiting
            input, then flashes wide as the command "executes". The keyframe
            owns `transform`, so it is placed with insets. */}
        <span
            className={cn(
                'pointer-events-none absolute inset-y-[18%] w-1.5 md:w-2 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.9)] opacity-0 group-engaged:animate-arrow-cursor motion-reduce:hidden',
                SIDE[side].cursor,
            )}
        />
        {/* The flight: parked over the title's edge, it glides to its slot
            after the cursor's blink. The 300ms hold is engage-only, so the exit
            stays instant. */}
        <span
            className={cn(
                'relative inline-flex items-center justify-center opacity-0 translate-y-[45%] scale-[0.4] blur-[3px]',
                SIDE[side].parked,
                'group-engaged:opacity-100 group-engaged:translate-x-0 group-engaged:translate-y-0 group-engaged:scale-100 group-engaged:rotate-0 group-engaged:blur-0',
                'no-hover:opacity-70 no-hover:translate-x-0 no-hover:translate-y-0 no-hover:scale-100 no-hover:rotate-0 no-hover:blur-0',
                'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-engaged:[transition-delay:300ms]',
            )}
        >
            {/* Lock-on reticle: the signature diagonal brackets closing around
                the glyph. */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1"
            >
                <BracketFrame radius={8} />
            </span>
            {/* RGB echoes: cyan + glitch-red copies, the banner's split
                miniaturized. They draw in after the main glyph so the split
                forks out of it mid-flight, rest as a faint whole fringe, and
                tear into slices with each burst. */}
            <LaunchArrow
                direction={direction}
                delayMs={440}
                className={cn(
                    'absolute inset-0 text-secondary opacity-0 group-engaged:opacity-40 group-engaged:animate-arrow-ghost-cyan motion-reduce:hidden translate-x-[2.5px] translate-y-[-2.5px] transition-opacity duration-500 ease-out',
                    size,
                )}
            />
            <LaunchArrow
                direction={direction}
                delayMs={540}
                className={cn(
                    'absolute inset-0 text-[hsl(0_100%_50%)] opacity-0 group-engaged:opacity-30 group-engaged:animate-arrow-ghost-red motion-reduce:hidden translate-x-[-2px] translate-y-[2px] transition-opacity duration-500 ease-out',
                    size,
                )}
            />
            <LaunchArrow
                direction={direction}
                delayMs={340}
                className={cn(
                    'relative text-primary group-engaged:animate-arrow-glitch motion-reduce:animate-none drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]',
                    size,
                )}
            />
        </span>
    </span>
);

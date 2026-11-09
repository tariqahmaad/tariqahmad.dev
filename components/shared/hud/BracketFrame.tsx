import { cn } from '@/lib/utils';

const RADIUS_TOP_LEFT = {
    8: 'rounded-tl-[8px]',
    10: 'rounded-tl-[10px]',
    12: 'rounded-tl-[12px]',
} as const;

const RADIUS_BOTTOM_RIGHT = {
    8: 'rounded-br-[8px]',
    10: 'rounded-br-[10px]',
    12: 'rounded-br-[12px]',
} as const;

const BASE_TONE = {
    primary: 'border-primary/60',
    foreground: 'border-foreground/60',
} as const;

interface Props {
    /** Pinned open (hovered/selected card) instead of revealed by group hover. */
    active?: boolean;
    /**
     * What opens the brackets when they are not pinned. `group` (default) is the
     * nearest-or-any ancestor `.group` being hovered or keyboard-focused.
     * `none` makes `active` the only control: unnamed groups match ANY hovered
     * ancestor, so a bracket inside a `group` card (e.g. a screenshot inside
     * the spotlight card) would otherwise open whenever the whole card is hovered.
     */
    hoverScope?: 'group' | 'none';
    tone?: keyof typeof BASE_TONE;
    radius?: keyof typeof RADIUS_TOP_LEFT;
    /** Extra classes for stacking/positioning, e.g. `z-20`. */
    className?: string;
}

/**
 * The site's signature corner brackets: two L-shaped arms that draw inward on
 * hover (or sit pinned when `active`). Extracted from the five components that
 * had grown their own copy of the same clip-path recipe, so the reveal timing
 * — top-left first, bottom-right 75ms later — stays identical everywhere.
 *
 * The parent group supplies the state through the `group-engaged:` variant
 * (tailwind.config.ts): hover on devices that hover, or keyboard focus-visible.
 * Parents with a named group must also carry a plain `group` class.
 */
export default function BracketFrame({
    active = false,
    hoverScope = 'group',
    tone = 'primary',
    radius = 10,
    className,
}: Props) {
    const opensOnEngage = hoverScope === 'group';

    return (
        <>
            <span
                aria-hidden="true"
                className={cn(
                    'bracket-arm pointer-events-none absolute inset-0 border-t-2 border-l-2',
                    RADIUS_TOP_LEFT[radius],
                    'transition-[clip-path,border-color] duration-300 ease-out',
                    active
                        ? 'border-primary [clip-path:inset(0)]'
                        : cn(
                              BASE_TONE[tone],
                              '[clip-path:inset(0_80%_60%_0)]',
                              opensOnEngage &&
                                  'group-engaged:border-primary group-engaged:[clip-path:inset(0)]',
                          ),
                    className,
                )}
            />
            <span
                aria-hidden="true"
                className={cn(
                    'bracket-arm pointer-events-none absolute inset-0 border-b-2 border-r-2',
                    RADIUS_BOTTOM_RIGHT[radius],
                    'transition-[clip-path,border-color] duration-300 delay-75 ease-out',
                    active
                        ? 'border-primary [clip-path:inset(0)]'
                        : cn(
                              BASE_TONE[tone],
                              '[clip-path:inset(60%_0_0_80%)]',
                              opensOnEngage &&
                                  'group-engaged:border-primary group-engaged:[clip-path:inset(0)]',
                          ),
                    className,
                )}
            />
        </>
    );
}

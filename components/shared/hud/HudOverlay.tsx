import { cn } from '@/lib/utils';

interface Props {
    open?: boolean;
    onClick?: () => void;
    className?: string;
    /** Stacking order; the menu uses 30, the console 70. */
    zIndex?: number;
}

/**
 * Shared modal backdrop: dim + blur + vignette + a faint primary wash.
 * Purely visual — the click handler is the dismiss affordance, so it is
 * deliberately not a button (no keyboard stop of its own; Escape owns that).
 */
export default function HudOverlay({
    open = true,
    onClick,
    className,
    zIndex = 30,
}: Props) {
    return (
        <div
            aria-hidden="true"
            onClick={onClick}
            style={{ zIndex }}
            className={cn(
                'fixed inset-0 bg-black/90 backdrop-blur-md touch-none overscroll-contain',
                'transition-[opacity,visibility] duration-300 ease-menu-out',
                'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]',
                'after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.03)_0%,transparent_60%)]',
                open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
                className,
            )}
        />
    );
}

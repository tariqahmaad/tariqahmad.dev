'use client';

import { cn } from '@/lib/utils';

interface DurationBarProps {
    startDate: string;
    endDate: string;
    startISO?: string;
    endISO?: string | null;
    isHighlighted?: boolean;
    className?: string;
    /** Inclusive months of tenure — renders one tick per month. */
    totalMonths: number;
}

const DurationBar = ({
    startDate,
    endDate,
    startISO,
    endISO,
    isHighlighted,
    className,
    totalMonths,
}: DurationBarProps) => {
    const isPresent = endISO === null || endDate.toLowerCase() === 'present';
    // `isHighlighted` deliberately does NOT feed `isLive`. The
    // `.duration-ticks--live` sheen sweeps the meter like a running gauge, so
    // pairing it with the featured-but-finished role implied that role was
    // still ongoing — the same implication the (correctly `isPresent`-gated)
    // "Present" pill and dot exist to avoid. The featured role keeps its own
    // treatment via `.duration-track--active` below.
    const isLive = isPresent;
    const ticks = Math.max(1, Math.round(totalMonths));

    return (
        <div
            className={cn(
                'duration-bar flex items-center gap-2 sm:gap-3',
                className
            )}
        >
            {/* Start date — dimmer (the past) */}
            {startISO ? (
                <time
                    dateTime={startISO}
                    className="text-body-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums"
                >
                    {startDate}
                </time>
            ) : (
                <span className="text-body-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums">
                    {startDate}
                </span>
            )}

            {/* Month-tick meter — GSAP ignites ticks left-to-right */}
            <div
                role="img"
                aria-label={`Duration: ${ticks} month${ticks === 1 ? '' : 's'}`}
                title={`${startDate} → ${endDate} · ${ticks} mo`}
                className={cn(
                    'duration-track duration-ticks relative flex flex-1 items-stretch gap-[3px] h-[10px] min-w-[44px] sm:min-w-[64px] p-[2px]',
                    isHighlighted && 'duration-track--active',
                    isLive && 'duration-ticks--live'
                )}
            >
                {Array.from({ length: ticks }).map((_, i) => (
                    <span key={i} className="duration-tick" />
                ))}
            </div>

            {/* End date or Present indicator */}
            <div className="flex items-center gap-1.5">
                {isPresent ? (
                    <>
                        <span className="text-body-sm font-semibold text-primary whitespace-nowrap tabular-nums">
                            Present
                        </span>
                        {/* Pulsing dot for current roles */}
                        <span
                            className={cn(
                                'w-2 h-2 rounded-full bg-primary',
                                isHighlighted
                                    ? 'present-dot-active'
                                    : 'present-dot'
                            )}
                        />
                    </>
                ) : endISO ? (
                    <time
                        dateTime={endISO}
                        className="text-body-sm font-medium text-foreground whitespace-nowrap tabular-nums"
                    >
                        {endDate}
                    </time>
                ) : (
                    <span className="text-body-sm font-medium text-foreground whitespace-nowrap tabular-nums">
                        {endDate}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DurationBar;

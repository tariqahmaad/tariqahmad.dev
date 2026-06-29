'use client';

import { cn } from '@/lib/utils';

interface DurationBarProps {
    startDate: string;
    endDate: string;
    isHighlighted?: boolean;
    className?: string;
}

const DurationBar = ({
    startDate,
    endDate,
    isHighlighted,
    className,
}: DurationBarProps) => {
    const isPresent = endDate.toLowerCase() === 'present';

    return (
        <div
            className={cn(
                'duration-bar flex items-center gap-2 sm:gap-3',
                className
            )}
        >
            {/* Start date — dimmer (the past) */}
            <span className="text-body-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums">
                {startDate}
            </span>

            {/* Segmented signal meter — fill width is animated by GSAP (0 → 100%) */}
            <div
                className={cn(
                    'duration-track relative flex-1 h-[7px] min-w-[44px] sm:min-w-[64px]',
                    isHighlighted && 'duration-track--active'
                )}
            >
                {/* Lit segments, revealed left-to-right */}
                <div
                    className={cn(
                        'duration-bar-fill absolute inset-y-0 left-0',
                        isHighlighted && 'duration-bar-fill--active'
                    )}
                />
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

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
            {/* Start date */}
            <span className="text-[10px] sm:text-body-xs font-medium text-muted-foreground whitespace-nowrap">
                {startDate}
            </span>

            {/* Animated progress bar */}
            <div className="flex-1 relative h-1.5 bg-muted/40 rounded-full overflow-hidden min-w-[40px] sm:min-w-[60px]">
                {/* Gradient fill */}
                <div
                    className={cn(
                        'duration-bar-fill absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary',
                        isHighlighted && 'animate-pulse-subtle'
                    )}
                />
            </div>

            {/* End date or Present indicator */}
            <div className="flex items-center gap-1.5">
                {isPresent ? (
                    <>
                        <span className="text-[10px] sm:text-body-xs font-medium text-primary whitespace-nowrap">
                            Present
                        </span>
                        {/* Pulsing dot for current roles */}
                        <span
                            className={cn(
                                'w-2 h-2 rounded-full bg-primary',
                                isHighlighted ? 'present-dot-active' : 'present-dot'
                            )}
                        />
                    </>
                ) : (
                    <span className="text-[10px] sm:text-body-xs font-medium text-muted-foreground whitespace-nowrap">
                        {endDate}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DurationBar;
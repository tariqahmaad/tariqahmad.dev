'use client';

import Link from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';

import TransitionLink from '@/components/shared/TransitionLink';
import { cn } from '@/lib/utils';

type Variant = 'solid' | 'outline';
type Size = 'lg' | 'md' | 'sm';

const RADIUS = {
    8: 'rounded-tl-[8px] rounded-br-[8px]',
    10: 'rounded-tl-[10px] rounded-br-[10px]',
    12: 'rounded-tl-[12px] rounded-br-[12px]',
} as const;

const SIZE: Record<Size, string> = {
    lg: 'h-14 px-10 text-body-lg sm:text-body-xl',
    md: 'h-12 px-8 text-body-lg',
    sm: 'h-10 px-4 text-ui-sm font-mono tracking-wider',
};

interface Props {
    children: ReactNode;
    /** Renders an anchor (and, for internal links, the page-transition wipe). */
    href?: string;
    external?: boolean;
    onClick?: MouseEventHandler<HTMLAnchorElement & HTMLButtonElement>;
    variant?: Variant;
    size?: Size;
    radius?: keyof typeof RADIUS;
    icon?: ReactNode;
    className?: string;
    ariaLabel?: string;
    type?: 'button' | 'submit';
}

/**
 * The site's primary/outline link-button.
 *
 * Both variants share the same geometry (asymmetric TL/BR radius, Anton
 * tracking) and each keeps its own hover signature: solid wipes a foreground
 * panel up from below, outline sweeps a diagonal scan line. Extracted from the
 * product page, the spotlight and the project detail links — which had drifted
 * to two different radii and three copies of the same markup.
 */
export default function HudButton({
    children,
    href,
    external = false,
    onClick,
    variant = 'solid',
    size = 'md',
    radius = 10,
    icon,
    className,
    ariaLabel,
    type = 'button',
}: Props) {
    const classes = cn(
        'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden',
        'uppercase font-anton tracking-widest outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        RADIUS[radius],
        SIZE[size],
        variant === 'solid'
            ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
            : size === 'sm'
              ? 'border border-primary/40 bg-primary/[0.04] text-primary/80 hover:border-primary hover:bg-primary/[0.1] hover:text-primary'
              : 'border border-primary text-primary hover:bg-primary/10',
        className,
    );

    const content = (
        <>
            {variant === 'solid' ? (
                <span
                    aria-hidden="true"
                    className="absolute top-[200%] left-0 right-0 h-full bg-foreground/90 transition-all duration-500 ease-out group-hover/btn:top-0"
                />
            ) : (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-primary/25 to-transparent transition-all duration-700 ease-out group-hover/btn:left-[150%]"
                />
            )}
            {icon ? (
                <span aria-hidden="true" className="relative z-[1] shrink-0">
                    {icon}
                </span>
            ) : null}
            <span className="relative z-[1]">{children}</span>
        </>
    );

    if (href) {
        if (external) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    className={classes}
                    onClick={onClick}
                >
                    {content}
                </a>
            );
        }

        const linkProps = {
            href,
            className: classes,
            onClick: onClick as MouseEventHandler<HTMLAnchorElement>,
            'aria-label': ariaLabel,
        };

        return size === 'sm' ? (
            <Link {...linkProps}>{content}</Link>
        ) : (
            <TransitionLink {...linkProps}>{content}</TransitionLink>
        );
    }

    return (
        <button
            type={type}
            aria-label={ariaLabel}
            className={classes}
            onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        >
            {content}
        </button>
    );
}

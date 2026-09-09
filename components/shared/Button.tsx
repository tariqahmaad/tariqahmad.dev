import Link from 'next/link';
import React, { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { Variant } from '@/types';
import { cn } from '@/lib/utils';

interface ChildProps {
    icon?: boolean;
}

const Child = ({ icon }: ChildProps) => (
    <span className="flex items-center justify-center gap-3">
        {/* No text-white: the spinner inherits currentColor from the variant. */}
        <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        {!icon && 'Processing...'}
    </span>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type LinkHref = ComponentProps<typeof Link>['href'];

// Next's Link also accepts a UrlObject; a raw <a href> needs a real string,
// otherwise href.toString() emits "[object Object]".
const toHrefString = (href: LinkHref | undefined): string => {
    if (!href) return '#';
    if (typeof href === 'string') return href;

    const { pathname = '', query, hash = '' } = href;
    const search = typeof query === 'string'
        ? `?${query.replace(/^\?/, '')}`
        : query
            ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
            : '';
    const fragment = hash && !hash.startsWith('#') ? `#${hash}` : hash;

    return `${pathname}${search}${fragment}`;
};

type Props = {
    as?: 'link' | 'button';
    loading?: boolean;
    icon?: boolean;
    children: ReactNode | ReactNode[];
    className?: string;
    variant?: Variant;
} & (ComponentProps<typeof Link> | ButtonProps);

const Button = ({
    loading,
    variant,
    className,
    children,
    as = 'link',
    icon = false,
    ...rest
}: Props) => {
    const variantClasses = {
        primary: `bg-primary text-primary-foreground  hover:bg-primary-hover`,
        secondary: `bg-secondary text-secondary-foreground hover:bg-secondary-hover`,
        success: `bg-primary text-primary-foreground hover:bg-primary-hover`,
        warning: `bg-amber-400 text-background hover:bg-amber-300`,
        danger: `bg-destructive text-destructive-foreground hover:bg-destructive/70`,
        info: `bg-secondary text-secondary-foreground hover:bg-secondary-hover`,
        light: `bg-background-active text-foreground hover:bg-background-active`,
        dark: `bg-foreground text-background hover:bg-foreground/80`,
        link: `text-foreground hover:text-primary`,
        'no-color': '',
        outline: `border border-primary text-primary hover:bg-primary/10`,
    }[variant || 'primary'];

    const iconClasses = cn(
        'min-w-9 aspect-square text-xl p-0 inline-flex items-center justify-center rounded-tl-[10px] rounded-br-[10px] rounded-tr-none rounded-bl-none',
        variantClasses,
    );

    const buttonClasses = cn(
        `group h-12 px-8 inline-flex justify-center items-center gap-2 text-body-lg uppercase font-anton tracking-widest outline-none transition-colors relative overflow-hidden disabled:opacity-70`,
        variantClasses,
        { [iconClasses]: icon },
        className,
    );

    // While loading the element must not be activatable twice and assistive tech
    // has to be told it is busy.
    const busyProps = {
        'aria-busy': loading || undefined,
        'aria-disabled': loading || undefined,
    };

    const blockWhileLoading = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
    };

    if (as === 'link') {
        const props = rest as ComponentProps<typeof Link>;

        if (props.target === '_blank') {
            // Next-only Link props must not be spread onto a raw <a> element.
            const {
                as: _as,
                replace: _replace,
                scroll: _scroll,
                shallow: _shallow,
                passHref: _passHref,
                prefetch: _prefetch,
                locale: _locale,
                legacyBehavior: _legacyBehavior,
                href: linkHref,
                ...anchorProps
            } = props;

            return (
                <a
                    className={cn(
                        buttonClasses,
                        loading && 'pointer-events-none',
                    )}
                    {...anchorProps}
                    href={toHrefString(linkHref)}
                    {...busyProps}
                    onClick={loading ? blockWhileLoading : anchorProps.onClick}
                >
                    {variant !== 'link' && (
                        <span className="absolute top-[200%] left-0 right-0 h-full bg-foreground/90 group-hover:top-0 transition-all duration-500 ease-out"></span>
                    )}
                    <span className="z-[1]">
                        {loading ? <Child icon={icon} /> : children}
                    </span>
                </a>
            );
        }

        return (
            <Link
                className={cn(buttonClasses, loading && 'pointer-events-none')}
                {...props}
                href={props.href || '#'}
                {...busyProps}
                onClick={loading ? blockWhileLoading : props.onClick}
            >
                {variant !== 'link' && (
                    <span className="absolute top-[200%] left-0 right-0 h-full bg-foreground/90 group-hover:top-0 transition-all duration-500 ease-out"></span>
                )}
                <span className="z-[1]">
                    {loading ? <Child icon={icon} /> : children}
                </span>
            </Link>
        );
    } else if (as === 'button') {
        const props = rest as ButtonProps;

        return (
            <button
                className={buttonClasses}
                {...props}
                disabled={loading || props.disabled}
                {...busyProps}
            >
                {variant !== 'link' && (
                    <span className="absolute top-[200%] left-0 right-0 h-full bg-foreground/90 group-hover:top-0 transition-all duration-500 ease-out"></span>
                )}
                <span className="z-[1]">
                    {loading ? <Child icon={icon} /> : children}
                </span>
            </button>
        );
    }
};

export default Button;

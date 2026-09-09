'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ComponentProps, useRef } from 'react';

interface Props extends ComponentProps<typeof Link> {
    back?: boolean;
}

const TransitionLink = ({
    href,
    onClick,
    children,
    back = false,
    ...rest
}: Props) => {
    const router = useRouter();
    const isTransitioningRef = useRef(false);

    // The handler's timeline must belong to a context so it is reverted if the
    // link unmounts mid-transition, hence the (otherwise empty) useGSAP call.
    const { contextSafe } = useGSAP();

    const handleLinkClick = contextSafe(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            // Let the browser handle modified, middle and new-tab clicks so
            // "open in new tab" isn't hijacked into a client-side push.
            if (
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey ||
                e.button !== 0 ||
                e.currentTarget.target === '_blank'
            ) {
                return;
            }

            // The caller's handler always runs; if it prevents the default we
            // hand control over to it and skip the page transition.
            if (onClick) {
                onClick(e);
                if (e.defaultPrevented) return;
            }

            e.preventDefault();

            // app/template.tsx owns the .page-transition nodes; ignore re-entry so
            // rapid clicks can't stack timelines on the same elements.
            if (isTransitioningRef.current) return;
            isTransitioningRef.current = true;

            gsap.set('.page-transition', { yPercent: 100 });
            gsap.set('.page-transition--inner', { yPercent: 100 });

            const tl = gsap.timeline({
                onComplete: () => {
                    if (back) {
                        router.back();
                    } else if (href) {
                        router.push(href.toString());
                    }

                    isTransitioningRef.current = false;
                },
            });

            tl.to('.page-transition', {
                yPercent: 0,
                duration: 0.3,
            });
        },
    );

    return (
        <Link href={href} {...rest} onClick={handleLinkClick}>
            {children}
        </Link>
    );
};

export default TransitionLink;

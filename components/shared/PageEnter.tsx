'use client';

import { useRef } from 'react';
import { usePageEnter } from '@/hooks/usePageEnter';

/**
 * Client wrapper for server-rendered pages (like `/product`, which exports
 * metadata and so cannot be a client component): everything inside marked
 * `data-enter` rises in after the page transition, the same entrance project
 * pages use.
 */
export default function PageEnter({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    usePageEnter(ref, '[data-enter]');

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

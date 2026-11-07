'use client';

import { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { useScrollDetection } from '@/hooks/useScrollDetection';
import { SITE_SECTIONS } from '@/lib/navigation';

const ActiveSectionContext = createContext<string | null>(null);

/**
 * One scroll-spy for the whole shell.
 *
 * Before this, only the navbar measured section offsets; the console's status
 * line would have been a second observer doing the same layout reads. The
 * provider runs the existing hook once and both consumers subscribe.
 */
export function ActiveSectionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const links = useMemo(
        () => SITE_SECTIONS.map((section) => ({ sectionId: section.id })),
        [],
    );

    // Only the portfolio page has these sections; on /product and project
    // pages the measurement would find nothing.
    const activeSection = useScrollDetection({
        links,
        offset: 100,
        enabled: pathname === '/',
    });

    return (
        <ActiveSectionContext.Provider value={activeSection}>
            {children}
        </ActiveSectionContext.Provider>
    );
}

export const useActiveSection = () => useContext(ActiveSectionContext);

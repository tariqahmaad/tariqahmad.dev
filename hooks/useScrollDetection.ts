import { useState, useEffect } from 'react';

interface UseScrollDetectionOptions {
    links: readonly { sectionId: string | null }[];
    offset?: number;
}

/**
 * Hook to detect which section is currently active based on scroll position
 */
export const useScrollDetection = ({
    links,
    offset = 100,
}: UseScrollDetectionOptions) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + offset;

            for (let i = links.length - 1; i >= 0; i--) {
                const link = links[i];
                if (link.sectionId) {
                    const element = document.getElementById(link.sectionId);
                    if (element && element.offsetTop <= scrollPosition) {
                        setActiveSection(link.sectionId);
                        return;
                    }
                }
            }
            setActiveSection(null);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [links, offset]);

    return activeSection;
};

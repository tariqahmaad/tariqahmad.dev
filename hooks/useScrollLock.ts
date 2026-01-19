import { useEffect, useRef } from 'react';

/**
 * Hook to lock/unlock body scroll when menu is open
 * Prevents background scrolling while preserving scroll position
 */
export const useScrollLock = (isLocked: boolean) => {
    const scrollYRef = useRef(0);

    useEffect(() => {
        if (isLocked) {
            // Store scroll position before locking
            scrollYRef.current = window.scrollY;

            const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth;

            // Apply scroll lock styles
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;

            // Mobile scroll lock - use touch-action for better mobile support
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.left = '0';
            document.body.style.top = `-${scrollYRef.current}px`;
            document.body.style.touchAction = 'none';
        } else {
            // Restore scroll position
            const savedScrollY = scrollYRef.current;

            // Reset all styles
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.paddingRight = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.left = '';
            document.body.style.top = '';
            document.body.style.touchAction = '';

            // Restore scroll position
            if (savedScrollY > 0) {
                window.scrollTo(0, savedScrollY);
            }
        }

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.paddingRight = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.left = '';
            document.body.style.top = '';
            document.body.style.touchAction = '';
        };
    }, [isLocked]);
};

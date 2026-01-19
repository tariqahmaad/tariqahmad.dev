import { useEffect, useState, useRef } from 'react';

interface UseMenuKeyboardNavigationOptions {
    isOpen: boolean;
    itemCount: number;
    onClose: () => void;
}

/**
 * Hook to handle keyboard navigation within the menu
 * Supports Tab, Shift+Tab, and Escape keys
 */
export const useMenuKeyboardNavigation = ({
    isOpen,
    itemCount,
    onClose,
}: UseMenuKeyboardNavigationOptions) => {
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                setFocusedIndex((prev) => {
                    const next = e.shiftKey
                        ? prev <= 0
                            ? itemCount - 1
                            : prev - 1
                        : prev >= itemCount - 1
                          ? 0
                          : prev + 1;
                    return next;
                });
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, itemCount, onClose]);

    return { focusedIndex, setFocusedIndex };
};

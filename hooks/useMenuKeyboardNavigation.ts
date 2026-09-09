import { useEffect, useState } from 'react';

interface UseMenuKeyboardNavigationOptions {
    isOpen: boolean;
    itemCount: number;
    onClose: () => void;
}

/**
 * Hook to handle keyboard navigation within the menu
 * Escape closes the menu; ArrowUp/ArrowDown/Home/End move the roving focus
 * index. Tab is deliberately left to the browser so every focusable element in
 * the panel stays reachable (the panel itself is `inert` while closed).
 */
export const useMenuKeyboardNavigation = ({
    isOpen,
    itemCount,
    onClose,
}: UseMenuKeyboardNavigationOptions) => {
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    useEffect(() => {
        if (!isOpen) {
            // Reset so reopening never starts from a stale index (which would
            // make the consumer focus an undefined ref).
            setFocusedIndex(-1);
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setFocusedIndex((prev) =>
                        prev >= itemCount - 1 ? 0 : prev + 1,
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setFocusedIndex((prev) =>
                        prev <= 0 ? itemCount - 1 : prev - 1,
                    );
                    break;
                case 'Home':
                    e.preventDefault();
                    setFocusedIndex(0);
                    break;
                case 'End':
                    e.preventDefault();
                    setFocusedIndex(itemCount - 1);
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, itemCount, onClose]);

    return { focusedIndex, setFocusedIndex };
};

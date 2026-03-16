declare module 'lenis/dist/lenis-snap.mjs' {
    import Lenis from 'lenis';

    type SnapOptions = {
        type?: 'mandatory' | 'proximity' | 'lock';
        lerp?: number;
        easing?: (t: number) => number;
        duration?: number;
        distanceThreshold?: number | `${number}%`;
        debounce?: number;
        onSnapStart?: (item: { value: number; index?: number }) => void;
        onSnapComplete?: (item: { value: number; index?: number }) => void;
    };

    interface Snap {
        options: SnapOptions;
        elements: Map<number, unknown>;
        snaps: Map<number, { value: number }>;
        isStopped: boolean;
        destroy(): void;
        start(): void;
        stop(): void;
        add(value: number): () => void;
        addElement(element: HTMLElement, options?: { align?: string | string[]; ignoreSticky?: boolean; ignoreTransform?: boolean }): () => void;
        addElements(elements: HTMLElement[], options?: { align?: string | string[]; ignoreSticky?: boolean; ignoreTransform?: boolean }): void;
        previous(): void;
        next(): void;
        goTo(index: number): void;
        resize(): void;
    }

    const Snap: {
        new (lenis: Lenis, options?: SnapOptions): Snap;
    };

    export default Snap;
}
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
// Import the plugin entry directly instead of the `gsap/all` barrel, which
// pulls ~25 plugins (ScrollSmoother, Draggable, …) into the client bundle.
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register only actual GSAP plugins (not hooks)
gsap.registerPlugin(ScrollTrigger);

// Don't auto-refresh on tab visibility change. Returning to a backgrounded tab
// triggers a refresh that momentarily resets scrubbed animations (e.g. the
// scroll-exit opacity fade) to their start state, flashing the content. We keep
// resize/load refreshes so layout changes still recalc correctly. Browser-only:
// ScrollTrigger's internal event list isn't initialized during SSR.
if (typeof window !== 'undefined') {
    ScrollTrigger.config({ autoRefreshEvents: 'resize,load,domcontentloaded' });
}

// Export useGSAP separately as it's a hook, not a plugin
export { gsap, ScrollTrigger, useGSAP };

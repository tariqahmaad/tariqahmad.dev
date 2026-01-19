import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register only actual GSAP plugins (not hooks)
gsap.registerPlugin(ScrollTrigger);

// Export useGSAP separately as it's a hook, not a plugin
export { gsap, ScrollTrigger, useGSAP };

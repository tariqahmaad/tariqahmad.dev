import { LinkedInIcon } from '@/components/shared/icons';
import { GENERAL_INFO } from '@/lib/data';

// Primary "connect" CTA for the banner. Shares the site's visual language
// with the ProjectCard / CvDownloadButton buttons: asymmetric TL/BR corners,
// clip-revealed corner brackets, a diagonal scan-line sweep, and the original
// LinkedIn-button slide-up fill wipe — all on hover.
//
// Kept bright-green (bg-primary) so it stays the hero CTA; the brackets are
// near-white (foreground) so they read clearly against the green fill instead
// of vanishing into the dark page. Every hover effect is transform / color /
// shadow / clip-path — the button never changes size, so there's no shake.
const ConnectButton = () => {
    return (
        <a
            href={GENERAL_INFO.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect with Tariq Ahmad on LinkedIn (opens in a new tab)"
            className="banner-button slide-up-and-fade group relative mt-9 inline-flex h-12 items-center gap-3 overflow-hidden rounded-tl-[12px] rounded-br-[12px] rounded-tr-none rounded-bl-none bg-primary px-6 text-primary-foreground shadow-[0_0_18px_rgba(0,255,0,0.22)] transition-[box-shadow,transform] duration-300 ease-out hover:shadow-[0_0_34px_rgba(0,255,0,0.5)] active:translate-y-px sm:gap-4 sm:px-7"
        >
            {/* Diagonal scan-line sweep on hover (translate only — no resize) */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-foreground/25 to-transparent transition-all duration-700 ease-in-out group-hover:left-[150%]"
            />

            {/* Corner brackets — near-white at rest so they read on the green
                fill, flipping to green on hover so they stay visible against
                the white slide-up wipe. Clip-revealed motif shared with
                ProjectCard (.bracket-arm). */}
            <span
                aria-hidden="true"
                className="bracket-arm pointer-events-none absolute inset-0 z-[1] rounded-tl-[12px] border-t-2 border-l-2 border-foreground/60 [clip-path:inset(0_80%_60%_0)] transition-[clip-path,border-color] duration-300 ease-out group-hover:border-primary group-hover:[clip-path:inset(0)]"
            />
            <span
                aria-hidden="true"
                className="bracket-arm pointer-events-none absolute inset-0 z-[1] rounded-br-[12px] border-b-2 border-r-2 border-foreground/60 [clip-path:inset(60%_0_0_80%)] transition-[clip-path,border-color] duration-300 delay-75 ease-out group-hover:border-primary group-hover:[clip-path:inset(0)]"
            />

            {/* Slide-up fill wipe — the original LinkedIn-button hover effect.
                A near-white panel parks just below (top-[200%], hidden by the
                button's overflow-hidden) and wipes up to top-0 on hover. Sits
                below the brackets/content (those are on z-[1]) so the green
                corner borders and near-black label stay visible over the white
                wash; covers only the green fill and scan-line. */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-[200%] h-full bg-foreground/90 transition-all duration-500 ease-out group-hover:top-0"
            />

            {/* LinkedIn glyph */}
            <LinkedInIcon className="relative z-[1] h-[18px] w-[18px] drop-shadow-[0_0_5px_rgba(0,0,0,0.4)]" />

            {/* Static, non-wrapping label — fixed content width so hover never
                resizes the button (the earlier per-char scramble caused jitter). */}
            <span className="relative z-[1] whitespace-nowrap font-anton text-body-lg uppercase leading-none tracking-widest transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_12px_rgba(255,255,255,0.45)]">
                {'LET’S CONNECT'}
            </span>

            {/* Arrow nudges right on hover (transform only) */}
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-[1] h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
                <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
        </a>
    );
};

export default ConnectButton;

'use client';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
    MoveUpRight,
    Terminal,
    Shield,
    Code,
    Briefcase,
    Award,
    FolderGit2,
    Mail,
    MessageSquareQuote,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { scrollToSection, isProjectDetailPage } from '@/lib/utils';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useMenuKeyboardNavigation } from '@/hooks/useMenuKeyboardNavigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useScrollDirection } from '@/hooks/useScrollDirection';

const MENU_LINKS = [
    {
        name: 'Home',
        url: '/',
        icon: Terminal,
        prefix: '~/',
        sectionId: null,
    },
    {
        name: 'About Me',
        url: '/#about-me',
        icon: Shield,
        prefix: './whoami',
        sectionId: 'about-me',
    },
    {
        name: 'Skills',
        url: '/#my-stack',
        icon: Code,
        prefix: './tech',
        sectionId: 'my-stack',
    },
    {
        name: 'Experience',
        url: '/#my-experience',
        icon: Briefcase,
        prefix: './work',
        sectionId: 'my-experience',
    },
    {
        name: 'Certifications',
        url: '/#certifications',
        icon: Award,
        prefix: './certs',
        sectionId: 'certifications',
    },
    {
        name: 'Projects',
        url: '/#selected-projects',
        icon: FolderGit2,
        prefix: './projects',
        sectionId: 'selected-projects',
    },
    {
        name: 'Testimonials',
        url: '/#testimonials',
        icon: MessageSquareQuote,
        prefix: './reviews',
        sectionId: 'testimonials',
    },
] as const;

// Motion timings. The whole cascade has to land within roughly one panel slide
// (~460ms) or the menu feels sluggish on a phone, so the stagger is small and
// the last element (the contact card) is capped by CONTACT_DELAY_MS.
const ANIMATION = {
    BASE_DELAY_MS: 50,
    SOCIAL_DELAY_MS: 90,
    CONTACT_DELAY_MS: 110,
    ITEM_STAGGER_MS: 35,
} as const;

// Panel slide: enters on a decelerating curve, leaves on a quicker accelerating
// one, and is shorter on phones where a full-width slide reads as more motion.
const PANEL_MOTION = {
    open: 'translate-x-0 duration-[420ms] sm:duration-[520ms] ease-menu-out',
    closed: 'translate-x-full duration-[300ms] ease-menu-close',
} as const;

// Menu rows fade/slide in with a stagger; on close they clear out fast and
// without delay so the panel never slides away with half-visible content.
const ROW_MOTION = {
    open: 'opacity-100 translate-y-0 duration-[380ms] ease-menu-out',
    closed: 'opacity-0 translate-y-3 duration-[180ms] ease-menu-close',
} as const;

const MENU_PANEL_ID = 'site-menu';

// Phones only: the toggle is a floating control that overlaps content, so it
// recedes while the page is being scrolled down.
const PHONE_QUERY = '(max-width: 767px)';

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const CORNER_POSITIONS: Record<CornerPosition, string> = {
    'top-left': 'top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8',
    'top-right': 'top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8',
    'bottom-left':
        'bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8',
    'bottom-right':
        'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8',
};

const CornerBracket = ({ position }: { position: CornerPosition }) => {
    const isTop = position.startsWith('top');
    const isLeft = position.endsWith('left');

    const horizontalGradient = isLeft
        ? 'bg-gradient-to-r from-primary/40 to-transparent'
        : 'bg-gradient-to-l from-primary/40 to-transparent';
    const verticalGradient = isTop
        ? 'bg-gradient-to-b from-primary/40 to-transparent'
        : 'bg-gradient-to-t from-primary/40 to-transparent';

    return (
        <div
            className={`absolute ${CORNER_POSITIONS[position]} w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 pointer-events-none`}
        >
            <div
                className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-full h-[1px] ${horizontalGradient}`}
            />
            <div
                className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} h-full w-[1px] ${verticalGradient}`}
            />
        </div>
    );
};

const Navbar = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    // Pending focus timer, tracked so it is cleared on close/unmount instead of
    // firing against a stale ref.
    const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close menu handler
    const closeMenu = useCallback(() => {
        // Hand focus back to the hamburger, but only when focus is still inside
        // the panel - otherwise we'd steal it from wherever the user moved it.
        if (menuRef.current?.contains(document.activeElement)) {
            hamburgerRef.current?.focus();
        }
        setIsMenuOpen(false);
    }, []);

    // Hide navbar on project details pages
    const isProjectDetail = isProjectDetailPage(pathname ?? '');

    // Scroll detection for active section. The navbar renders nothing on
    // project detail pages, so disable the hook there entirely.
    const activeSection = useScrollDetection({
        links: MENU_LINKS,
        offset: 100,
        enabled: !isProjectDetail,
    });

    // Keyboard navigation
    const { focusedIndex, setFocusedIndex } = useMenuKeyboardNavigation({
        isOpen: isMenuOpen,
        itemCount: MENU_LINKS.length + SOCIAL_LINKS.length,
        onClose: closeMenu,
    });

    // Body scroll lock
    useScrollLock(isMenuOpen);

    // Dim the toggle on phones while the page scrolls down, so the bars stop
    // competing with the content. Any upward scroll, the top of the page, an
    // open menu, or a tap/focus brings it straight back to full strength.
    const isPhone = useMediaQuery(PHONE_QUERY);
    const isScrollingDown = useScrollDirection({
        enabled: isPhone && !isProjectDetail,
    });
    const isToggleDimmed = isPhone && isScrollingDown && !isMenuOpen;

    // Contain focus inside the open menu. The panel is a modal dialog, so the
    // rest of the page must not be reachable with Tab. `main`/`footer` cover
    // the page shell; fixed widgets opt in with `data-menu-inert`.
    useEffect(() => {
        if (!isMenuOpen) return;

        const targets = Array.from(
            document.querySelectorAll<HTMLElement>(
                'main, footer, [data-menu-inert]',
            ),
        );
        targets.forEach((element) => element.setAttribute('inert', ''));

        return () => {
            targets.forEach((element) => element.removeAttribute('inert'));
        };
    }, [isMenuOpen]);

    // Move focus into the panel once it is open. The panel is `inert` while
    // closed, so it can only receive focus after the open state is committed;
    // driving the index keeps the roving state in sync with the real focus.
    useEffect(() => {
        if (!isMenuOpen) return;

        setFocusedIndex(0);
    }, [isMenuOpen, setFocusedIndex]);

    // Focus the appropriate element when focusedIndex changes
    useEffect(() => {
        if (focusedIndex < 0) return;

        focusTimerRef.current = setTimeout(() => {
            focusTimerRef.current = null;
            if (focusedIndex < MENU_LINKS.length) {
                buttonRefs.current[focusedIndex]?.focus();
            } else {
                socialRefs.current[focusedIndex - MENU_LINKS.length]?.focus();
            }
        }, 0);

        return () => {
            if (focusTimerRef.current !== null) {
                clearTimeout(focusTimerRef.current);
                focusTimerRef.current = null;
            }
        };
    }, [focusedIndex]);

    if (isProjectDetail) return null;

    return (
        <>
            {/* Hamburger / close button.
                Deliberately `fixed` rather than `sticky`: `useScrollLock`
                freezes <body> with `position: fixed` + `overflow: hidden` while
                the menu is open, which turns body into a scroll container and
                un-anchors any in-flow element from the viewport. A sticky
                wrapper then sits at the document top - i.e. off-screen once the
                user has scrolled - so the close button vanished on phones. A
                viewport-anchored button is immune to the lock. */}
            <button
                className={cn(
                    'group',
                    'fixed z-[41]',
                    // Underscores become spaces in arbitrary values - the `+`
                    // inside max() must be surrounded by whitespace or the
                    // declaration is invalid and dropped by the browser.
                    'top-[max(1rem,env(safe-area-inset-top)_+_0.5rem)] right-[max(1rem,env(safe-area-inset-right)_+_0.5rem)]',
                    'sm:top-5 sm:right-6 md:top-6 md:right-8',
                    // Original sizing: 44px on phones, 48px at sm, 56px at md.
                    'w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14',
                    'flex items-center justify-center',
                    'bg-background/50 backdrop-blur-sm',
                    'border border-white/5',
                    'cursor-pointer touch-manipulation',
                    'transition-[background-color,border-color,box-shadow,opacity,transform] duration-300 ease-menu-out',
                    'hover:bg-background/80 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,255,0,0.15)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    // Interaction always wins over the scroll-dim state. No
                    // `hover:` here on purpose - the dim is phone-only, and a
                    // tap can leave a sticky :hover that would pin the button
                    // at full opacity for the rest of the session.
                    'focus-visible:opacity-100 active:opacity-100',
                    'will-change-transform',
                    // While open the button is the only way out of the overlay,
                    // so it stays fully visible and picks up a primary accent.
                    // `md:translate-y-2` is the original open-state offset that
                    // lines the button up with the panel's first row.
                    isMenuOpen
                        ? 'scale-90 md:translate-y-2 opacity-100 border-primary/40 bg-background/80 shadow-[0_0_20px_rgba(0,255,0,0.18)]'
                        : 'scale-100 active:scale-95',
                    !isMenuOpen &&
                        (isToggleDimmed ? 'opacity-60' : 'opacity-100'),
                )}
                ref={hamburgerRef}
                onClick={() => (isMenuOpen ? closeMenu() : setIsMenuOpen(true))}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                aria-controls={MENU_PANEL_ID}
            >
                <div className="relative w-6 h-5 sm:w-7 sm:h-5">
                    {/* Top line */}
                    <span
                        className={cn(
                            'absolute left-1/2 -translate-x-1/2',
                            'w-6 sm:w-7 h-[2.5px]',
                            'transition-[transform,top,background-color,box-shadow] duration-[400ms] ease-menu-out',
                            'will-change-transform',
                            isMenuOpen
                                ? 'top-1/2 -translate-y-1/2 rotate-45 bg-primary shadow-[0_0_8px_rgba(0,255,0,0.4)]'
                                : 'top-[2px] bg-foreground',
                        )}
                    />
                    {/* Bottom line - trails the top line slightly on open so the
                        X forms rather than snapping into place. */}
                    <span
                        className={cn(
                            'absolute left-1/2 -translate-x-1/2',
                            'w-6 sm:w-7 h-[2.5px]',
                            'transition-[transform,bottom,background-color,box-shadow] duration-[400ms] ease-menu-out',
                            'will-change-transform',
                            isMenuOpen
                                ? 'bottom-1/2 translate-y-1/2 -rotate-45 bg-primary shadow-[0_0_8px_rgba(0,255,0,0.4)] delay-[60ms]'
                                : 'bottom-[2px] bg-foreground delay-0',
                        )}
                    />
                </div>
            </button>

            {/* Backdrop with vignette. `visibility` is transitioned alongside
                opacity so the fade-out is actually seen (a plain `invisible`
                would drop the layer on the first frame of the close). */}
            <div
                className={cn(
                    'fixed inset-0 z-[30] bg-black/90 backdrop-blur-md',
                    'transition-[opacity,visibility] duration-[300ms] ease-menu-out',
                    // Contain touch gestures on the overlay itself instead of
                    // disabling touch-action on the body, which would kill
                    // pinch-zoom for the whole document (WCAG 1.4.4).
                    'touch-none overscroll-contain',
                    'before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]',
                    'after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.03)_0%,transparent_60%)]',
                    isMenuOpen
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible pointer-events-none',
                )}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* Menu Panel */}
            <div
                ref={menuRef}
                id={MENU_PANEL_ID}
                className={cn(
                    'fixed top-0 right-0 h-[100dvh] overflow-y-auto',
                    'w-full sm:w-[85vw] md:w-[550px] lg:w-[580px] xl:w-[620px]',
                    'z-[31]',
                    // Original top padding: it leaves the toggle (44px at 16px
                    // from the top) sitting just above the first menu row.
                    'py-12 sm:py-14 md:py-14 lg:py-14',
                    'px-5 sm:px-6 md:px-6 lg:px-8 xl:px-10',
                    'pt-[max(2.5rem,env(safe-area-inset-top)_+_0.75rem)] sm:pt-[max(3.5rem,env(safe-area-inset-top)_+_1rem)]',
                    'pb-[max(1rem,env(safe-area-inset-bottom)_+_0.5rem)] sm:pb-[max(1.25rem,env(safe-area-inset-bottom)_+_0.5rem)] md:pb-[max(1.25rem,env(safe-area-inset-bottom)_+_0.5rem)]',
                    'overflow-y-auto overflow-x-hidden flex flex-col',
                    // Keep the panel's own scrolling from chaining to the page.
                    'overscroll-contain',
                    // Transitions instead of keyframes: open and close are the
                    // same property change, so a fast re-tap mid-animation
                    // retargets smoothly instead of snapping.
                    'transform-gpu transition-transform will-change-transform',
                    isMenuOpen ? PANEL_MOTION.open : PANEL_MOTION.closed,
                )}
                aria-label="Main navigation"
                role="dialog"
                aria-modal="true"
                // While closed the panel is only shifted off-screen, so keep it
                // out of the tab order and the accessibility tree entirely.
                inert={!isMenuOpen}
                aria-hidden={!isMenuOpen}
            >
                {/* Background layer */}
                <div
                    className={cn(
                        'absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95',
                        'border-l border-primary/20',
                        'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,0,0.04),transparent_50%)]',
                        'after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_0%,rgba(0,255,0,0.02)_50%,transparent_100%)]',
                    )}
                />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-menu-grid" />

                {/* Scanline overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.015]"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.05) 2px, rgba(0,255,0,0.05) 4px)',
                    }}
                />

                {/* Corner brackets */}
                <CornerBracket position="top-left" />
                <CornerBracket position="top-right" />
                <CornerBracket position="bottom-left" />
                <CornerBracket position="bottom-right" />

                <nav
                    aria-label="Main navigation"
                    className="relative z-10 w-full mx-auto flex-1 flex flex-col mt-6 sm:mt-6 md:mt-12 lg:mt-16"
                >
                    {/* Navigation Section */}
                    <div className="mb-4 sm:mb-7 md:mb-8 lg:mb-8">
                        <div className="flex items-center gap-2 mb-2.5 sm:mb-4 md:mb-4 lg:mb-5">
                            <span className="text-primary text-ui-sm md:text-ui-base lg:text-ui-lg font-mono">
                                $
                            </span>
                            <p className="text-ui-sm md:text-ui-base lg:text-ui-lg font-mono tracking-widest text-primary/80 uppercase">
                                Navigation
                            </p>
                            <span className="ml-auto text-[11px] xs:text-ui-sm sm:text-ui-sm font-mono text-muted-foreground/40">
                                {String(MENU_LINKS.length).padStart(2, '0')}{' '}
                                items
                            </span>
                        </div>
                        <ul className="space-y-1 sm:space-y-2 md:space-y-2.5 lg:space-y-2.5">
                            {MENU_LINKS.map((link, idx) => {
                                const Icon = link.icon;
                                const isActive =
                                    link.sectionId === activeSection;
                                return (
                                    <li
                                        key={link.name}
                                        className={cn(
                                            'transform-gpu transition-[opacity,transform]',
                                            isMenuOpen
                                                ? ROW_MOTION.open
                                                : ROW_MOTION.closed,
                                        )}
                                        style={{
                                            // Delay only on the way in; on the
                                            // way out every row clears at once.
                                            transitionDelay: isMenuOpen
                                                ? `${ANIMATION.BASE_DELAY_MS + idx * ANIMATION.ITEM_STAGGER_MS}ms`
                                                : '0ms',
                                        }}
                                    >
                                        <button
                                            ref={(el) => {
                                                buttonRefs.current[idx] = el;
                                            }}
                                            aria-current={
                                                isActive ? 'page' : undefined
                                            }
                                            onClick={() => {
                                                closeMenu();

                                                if (link.url.startsWith('/#')) {
                                                    scrollToSection(
                                                        link.url.substring(2),
                                                    );
                                                } else {
                                                    router.push(link.url);
                                                }
                                            }}
                                            className={cn(
                                                'group w-full flex items-center',
                                                'gap-2.5 xs:gap-3 sm:gap-3 md:gap-3.5 lg:gap-4',
                                                'px-3 xs:px-3.5 sm:px-3.5 md:px-4 lg:px-5',
                                                'py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4',
                                                'border border-white/5 transition-all duration-200 cursor-pointer',
                                                'relative overflow-hidden rounded-sm',
                                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                                                'active:scale-[0.98]',
                                                'will-change-transform',
                                                // Shimmer effect
                                                'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent',
                                                'before:translate-x-[-200%] before:transition-transform before:duration-[400ms]',
                                                'hover:before:translate-x-[200%]',
                                                // Hover and Active state
                                                isActive
                                                    ? 'border-primary/50 bg-primary/[0.08]'
                                                    : 'hover:border-primary/30 hover:bg-primary/[0.05]',
                                            )}
                                        >
                                            {/* Active left accent border */}
                                            <div
                                                className={cn(
                                                    'absolute left-0 top-1/4 h-1/2 w-[2px] transition-all duration-300',
                                                    isActive
                                                        ? 'bg-primary shadow-[0_0_6px_rgba(0,255,0,0.5)]'
                                                        : 'bg-transparent group-hover:bg-primary/40',
                                                )}
                                            />

                                            {/* Numbered prefix */}
                                            <span
                                                className={cn(
                                                    'text-[11px] font-mono flex-shrink-0 w-5 sm:w-5 text-right transition-colors',
                                                    isActive
                                                        ? 'text-primary/60'
                                                        : 'text-muted-foreground/30 group-hover:text-primary/40',
                                                )}
                                            >
                                                {String(idx + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>

                                            <Icon
                                                className={cn(
                                                    'w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-colors flex-shrink-0',
                                                    isActive
                                                        ? 'text-primary'
                                                        : 'text-primary/60 group-hover:text-primary',
                                                )}
                                            />
                                            <div className="flex-1 text-left min-w-0">
                                                <div
                                                    className={cn(
                                                        'text-[11px] sm:text-[11px] md:text-ui-sm lg:text-ui-base font-mono transition-colors mb-0.5 truncate',
                                                        isActive
                                                            ? 'text-primary/70'
                                                            : 'text-muted-foreground/60 group-hover:text-primary/60',
                                                    )}
                                                >
                                                    {link.prefix}
                                                </div>
                                                <div
                                                    className={cn(
                                                        'text-body-sm sm:text-body-base md:text-body-lg lg:text-body-lg font-light tracking-wide transition-colors truncate',
                                                        isActive
                                                            ? 'text-foreground font-normal'
                                                            : 'text-foreground/90 group-hover:text-foreground',
                                                    )}
                                                >
                                                    {link.name}
                                                </div>
                                            </div>

                                            {/* Status dot with enhanced glow */}
                                            <div
                                                className={cn(
                                                    'w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 rounded-none transition-all flex-shrink-0',
                                                    isActive
                                                        ? 'bg-primary shadow-[0_0_6px_rgba(0,255,0,0.5)] animate-pulse-subtle'
                                                        : 'bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_4px_rgba(0,255,0,0.3)]',
                                                )}
                                            />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Separator */}
                    <div className="mb-4 sm:mb-6 md:mb-7 lg:mb-7 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                    {/* Social Links Section */}
                    <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-8">
                        <div className="flex items-center gap-2 mb-2.5 sm:mb-4 md:mb-4 lg:mb-5">
                            <span className="text-primary text-ui-sm md:text-ui-base lg:text-ui-lg font-mono">
                                $
                            </span>
                            <p className="text-ui-sm md:text-ui-base lg:text-ui-lg font-mono tracking-widest text-primary/80 uppercase">
                                Connect
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-2.5">
                            {SOCIAL_LINKS.map((link, idx) => {
                                const SocialIcon = link.icon;
                                return (
                                    // The wrapper carries the staggered entrance
                                    // so the link below keeps its own hover and
                                    // active transitions untouched.
                                    <div
                                        key={link.name}
                                        className={cn(
                                            'transform-gpu transition-[opacity,transform]',
                                            isMenuOpen
                                                ? ROW_MOTION.open
                                                : ROW_MOTION.closed,
                                        )}
                                        style={{
                                            transitionDelay: isMenuOpen
                                                ? `${ANIMATION.SOCIAL_DELAY_MS + (idx + MENU_LINKS.length) * ANIMATION.ITEM_STAGGER_MS}ms`
                                                : '0ms',
                                        }}
                                    >
                                        <a
                                            ref={(el) => {
                                                socialRefs.current[idx] = el;
                                            }}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={cn(
                                                'group cursor-pointer block',
                                                'px-3 xs:px-3.5 sm:px-3.5 md:px-4 lg:px-5',
                                                'py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-3.5',
                                                'border border-white/5 hover:border-primary/40',
                                                'bg-foreground/[0.02] hover:bg-primary/[0.06]',
                                                'transition-all duration-200 rounded-sm',
                                                'hover:shadow-[0_0_20px_rgba(0,255,0,0.15)]',
                                                'relative overflow-hidden',
                                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                                                'active:scale-95',
                                                'touch-manipulation',
                                                'will-change-transform',
                                                // Top border glow effect
                                                'before:absolute before:top-0 before:left-0 before:w-full before:h-[1px]',
                                                'before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent',
                                                'before:opacity-0 before:group-hover:opacity-100 before:transition-opacity',
                                                // Shimmer on hover
                                                'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-primary/5 after:to-transparent',
                                                'after:translate-x-[-200%] after:transition-transform after:duration-500',
                                                'group-hover:after:translate-x-[200%]',
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5 xs:gap-2.5 sm:gap-2.5 min-w-0">
                                                <SocialIcon
                                                    className={cn(
                                                        'w-[18px] h-[18px] sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 transition-all duration-300',
                                                        'text-primary/50 group-hover:text-primary',
                                                    )}
                                                />
                                                <span className="text-body-sm sm:text-body-base md:text-body-lg lg:text-body-lg font-light tracking-wide truncate text-foreground/85 group-hover:text-foreground transition-colors">
                                                    {link.name}
                                                </span>
                                                <MoveUpRight className="hidden xs:block w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0 ml-auto" />
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Get In Touch Section */}
                    <div
                        className={cn(
                            'mt-auto relative px-3 sm:px-4 md:px-5 lg:px-5 py-3 sm:py-4 md:py-5 lg:py-5 overflow-hidden group rounded-sm',
                            'border border-white/5 hover:border-primary/20',
                            'transform-gpu transition-[opacity,transform]',
                            isMenuOpen ? ROW_MOTION.open : ROW_MOTION.closed,
                        )}
                        style={{
                            transitionDelay: isMenuOpen
                                ? `${ANIMATION.CONTACT_DELAY_MS + (MENU_LINKS.length + SOCIAL_LINKS.length) * ANIMATION.ITEM_STAGGER_MS}ms`
                                : '0ms',
                        }}
                    >
                        {/* Animated border glow */}
                        <div
                            className="absolute inset-0 border border-primary/15 animate-pulse pointer-events-none"
                            style={{ animationDuration: '3s' }}
                        />

                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                        <div
                            className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 blur-3xl rounded-full animate-pulse"
                            style={{ animationDuration: '4s' }}
                        />

                        {/* Corner accents for this section */}
                        <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/30 to-transparent" />
                            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-primary/30 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none">
                            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/30 to-transparent" />
                            <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-primary/30 to-transparent" />
                        </div>

                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3 sm:mb-3 md:mb-4 lg:mb-4">
                                <Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary/60 animate-bounce" />
                                <p className="text-ui-base md:text-ui-base lg:text-ui-lg font-mono tracking-widest text-primary/80 uppercase">
                                    Get In Touch
                                </p>
                            </div>
                            <a
                                href={`mailto:${GENERAL_INFO.email}`}
                                className="group/email text-body-sm sm:text-body-base md:text-body-lg lg:text-body-lg font-mono tracking-wide text-foreground/90 hover:text-primary transition-colors duration-300 block break-all mb-2.5 sm:mb-3 md:mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                            >
                                <span className="group-hover/email:text-primary/60 transition-colors">
                                    &gt;{' '}
                                </span>
                                {GENERAL_INFO.email}
                            </a>
                            <div className="flex items-center gap-2 sm:gap-2 text-[11px] xs:text-ui-sm sm:text-ui-sm md:text-ui-base lg:text-ui-base text-muted-foreground/80">
                                <span className="h-2 w-2 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 flex-shrink-0 bg-primary shadow-[0_0_6px_rgba(0,255,0,0.7)] animate-pulse-subtle" />
                                <span className="font-mono text-primary/70">
                                    STATUS:
                                </span>
                                <span className="truncate font-mono text-foreground/70">
                                    AVAILABLE FOR WORK
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Navbar;

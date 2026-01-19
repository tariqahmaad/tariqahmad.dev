'use client';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    MoveUpRight,
    Terminal,
    Shield,
    Code,
    Briefcase,
    Award,
    FolderGit2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';

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
] as const;

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    // Close menu handler
    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
        setFocusedIndex(-1);
    }, []);

    // Scroll detection for active section
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100; // Offset for better detection

            for (let i = MENU_LINKS.length - 1; i >= 0; i--) {
                const link = MENU_LINKS[i];
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
    }, []);

    // Keyboard navigation
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const totalItems = MENU_LINKS.length + SOCIAL_LINKS.length;

            if (e.key === 'Escape') {
                closeMenu();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                setFocusedIndex((prev) => {
                    const next = e.shiftKey
                        ? prev <= 0
                            ? totalItems - 1
                            : prev - 1
                        : prev >= totalItems - 1
                          ? 0
                          : prev + 1;

                    // Focus the appropriate element
                    setTimeout(() => {
                        if (next < MENU_LINKS.length) {
                            buttonRefs.current[next]?.focus();
                        } else {
                            socialRefs.current[
                                next - MENU_LINKS.length
                            ]?.focus();
                        }
                    }, 0);

                    return next;
                });
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen, closeMenu]);

    // Body scroll lock - using ref to persist scroll position across re-renders
    const scrollYRef = useRef(0);

    useEffect(() => {
        if (isMenuOpen) {
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
    }, [isMenuOpen]);

    return (
        <>
            {/* Hamburger Button - Optimized Touch Targets */}
            <div className="sticky top-0 z-[4]">
                <button
                    className={cn(
                        'group',
                        // Minimum 44x44px touch target for accessibility
                        'w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14',
                        'absolute top-4 sm:top-5 right-4 sm:right-6 md:right-8',
                        'z-[2]',
                        'flex items-center justify-center',
                        'bg-background/50 backdrop-blur-sm',
                        'hover:bg-background/80 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,255,0,0.15)]',
                        'transition-all duration-300 cursor-pointer',
                        'border border-white/5',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        // GPU acceleration
                        'will-change-transform',
                        isMenuOpen && 'scale-90',
                    )}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                >
                    <div className="relative w-6 h-5 sm:w-7 sm:h-5">
                        {/* Top line */}
                        <span
                            className={cn(
                                'absolute left-1/2 -translate-x-1/2',
                                'w-6 sm:w-7 h-[2.5px] rounded-full',
                                'bg-foreground transition-all duration-400 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;',
                                'will-change-transform',
                                isMenuOpen
                                    ? 'top-1/2 -translate-y-1/2 rotate-45 bg-primary'
                                    : 'top-[2px]',
                            )}
                        />
                        {/* Bottom line */}
                        <span
                            className={cn(
                                'absolute left-1/2 -translate-x-1/2',
                                'w-6 sm:w-7 h-[2.5px] rounded-full',
                                'bg-foreground transition-all duration-400 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb; delay-75',
                                'will-change-transform',
                                isMenuOpen
                                    ? 'bottom-1/2 translate-y-1/2 -rotate-45 bg-primary'
                                    : 'bottom-[2px]',
                            )}
                        />
                    </div>
                </button>
            </div>

            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 z-[2] bg-black/90 backdrop-blur-md',
                    'transition-all duration-300 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;',
                    'will-change-transform',
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
                className={cn(
                    'fixed top-0 right-0 h-[100dvh] overflow-y-auto',
                    // Progressive width enhancement for better desktop experience
                    'w-full sm:w-[85vw] md:w-[550px] lg:w-[580px] xl:w-[620px]',
                    'transform transition-all duration-400 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb; z-[3]',
                    // Mobile-optimized spacing - reduced on mobile only
                    'py-14 sm:py-16 md:py-20 lg:py-20',
                    'px-4 sm:px-6 md:px-10 lg:px-12 xl:px-14',
                    'will-change-transform',
                    // Safe area support for notched devices - mobile optimized
                    'pt-[max(3.5rem,env(safe-area-inset-top)+0.75rem)] sm:pt-[max(4rem,env(safe-area-inset-top)+1rem)]',
                    'pb-[max(3.5rem,env(safe-area-inset-bottom)+0.75rem)] sm:pb-[max(4rem,env(safe-area-inset-bottom)+1rem)]',
                    'overflow-y-auto overflow-x-hidden',
                    isMenuOpen ? 'animate-menu-enter' : 'translate-x-[120%]',
                )}
                aria-label="Main navigation"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className={cn(
                        'absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95',
                        'border-l border-primary/20',
                        'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,0,0.04),transparent_50%)]',
                        'after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_0%,rgba(0,255,0,0.02)_50%,transparent_100%)]',
                    )}
                ></div>

                <div className="relative z-10 w-full mx-auto">
                    {/* Navigation Section */}
                    <div className="mb-5 sm:mb-7 md:mb-8 lg:mb-8">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-4 lg:mb-5">
                            <span className="text-primary text-ui-sm md:text-ui-base lg:text-ui-lg font-mono">
                                $
                            </span>
                            <p className="text-ui-sm md:text-ui-base lg:text-ui-lg font-mono tracking-widest text-primary/80 uppercase">
                                Navigation
                            </p>
                        </div>
                        <ul className="space-y-1.5 sm:space-y-2 md:space-y-2.5 lg:space-y-2.5">
                            {MENU_LINKS.map((link, idx) => {
                                const Icon = link.icon;
                                const isActive =
                                    link.sectionId === activeSection;
                                return (
                                    <li
                                        key={link.name}
                                        className={cn(
                                            'opacity-0', // Initial opacity 0 for animation
                                            isMenuOpen && 'animate-item-enter',
                                        )}
                                        style={{
                                            animationDelay: `${idx * 50}ms`,
                                        }}
                                    >
                                        <button
                                            ref={(el) => {
                                                buttonRefs.current[idx] = el;
                                            }}
                                            onClick={() => {
                                                closeMenu();

                                                // Handle hash navigation with scroll offset
                                                if (link.url.startsWith('/#')) {
                                                    const id =
                                                        link.url.substring(2);
                                                    setTimeout(() => {
                                                        const element =
                                                            document.getElementById(
                                                                id,
                                                            );
                                                        if (element) {
                                                            const offset = 80; // Account for any fixed headers
                                                            const elementPosition =
                                                                element.getBoundingClientRect()
                                                                    .top +
                                                                window.scrollY;
                                                            window.scrollTo({
                                                                top:
                                                                    elementPosition -
                                                                    offset,
                                                                behavior:
                                                                    'smooth',
                                                            });
                                                        }
                                                    }, 300);
                                                } else {
                                                    router.push(link.url);
                                                }
                                            }}
                                            className={cn(
                                                'group w-full flex items-center',
                                                'gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4',
                                                'px-3 sm:px-3.5 md:px-4 lg:px-5',
                                                'py-2.5 sm:py-3 md:py-3.5 lg:py-4',
                                                'border border-white/5 transition-all duration-200 cursor-pointer',
                                                'relative overflow-hidden rounded-sm',
                                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                                                'active:scale-[0.98]',
                                                'will-change-transform',
                                                // Shimmer effect - faster 400ms
                                                'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent',
                                                'before:translate-x-[-200%] before:transition-transform before:duration-400',
                                                'hover:before:translate-x-[200%]',
                                                // Hover and Active state styling - consistent border
                                                isActive
                                                    ? 'border-primary/50 bg-primary/[0.08]'
                                                    : 'hover:border-primary/30 hover:bg-primary/[0.05]',
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    'w-[18px] h-[18px] sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-colors flex-shrink-0',
                                                    isActive
                                                        ? 'text-primary'
                                                        : 'text-primary/60 group-hover:text-primary',
                                                )}
                                            />
                                            <div className="flex-1 text-left min-w-0">
                                                <div
                                                    className={cn(
                                                        'text-[10px] sm:text-[11px] md:text-ui-sm lg:text-ui-base font-mono transition-colors mb-0.5 truncate',
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
                                            <div
                                                className={cn(
                                                    'w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 rounded-full transition-all flex-shrink-0',
                                                    isActive
                                                        ? 'bg-primary shadow-[0_0_6px_rgba(0,255,0,0.5)]'
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
                    <div className="mb-5 sm:mb-6 md:mb-7 lg:mb-7 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                    {/* Social Links Section */}
                    <div className="mb-5 sm:mb-6 md:mb-8 lg:mb-8">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-4 lg:mb-5">
                            <span className="text-primary text-ui-sm md:text-ui-base lg:text-ui-lg font-mono">
                                $
                            </span>
                            <p className="text-ui-sm md:text-ui-base lg:text-ui-lg font-mono tracking-widest text-primary/80 uppercase">
                                Connect
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-2.5">
                            {SOCIAL_LINKS.map((link, idx) => (
                                <a
                                    key={link.name}
                                    ref={(el) => {
                                        socialRefs.current[idx] = el;
                                    }}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                        'group cursor-pointer',
                                        'px-2.5 sm:px-3.5 md:px-4 lg:px-5',
                                        'py-2.5 sm:py-3 md:py-3.5 lg:py-3.5',
                                        'border border-white/5 hover:border-primary/40',
                                        'bg-white/[0.02] hover:bg-primary/8',
                                        'transition-all duration-200 rounded-sm',
                                        'hover:shadow-[0_0_20px_rgba(0,255,0,0.15)]',
                                        'opacity-0', // Initial opacity
                                        isMenuOpen && 'animate-item-enter',
                                        'relative overflow-hidden',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                                        'active:scale-95',
                                        'will-change-transform',
                                        // Top border glow effect
                                        'before:absolute before:top-0 before:left-0 before:w-full before:h-[1px]',
                                        'before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent',
                                        'before:opacity-0 before:group-hover:opacity-100 before:transition-opacity',
                                    )}
                                    style={{
                                        animationDelay: `${(idx + MENU_LINKS.length) * 50}ms`,
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
                                        <span className="text-body-sm sm:text-body-base md:text-body-lg lg:text-body-lg font-light tracking-wide truncate text-foreground/85 group-hover:text-foreground transition-colors">
                                            {link.name}
                                        </span>
                                        <MoveUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Get In Touch Section */}
                    <div
                        className={cn(
                            'relative px-3 sm:px-4 md:px-5 lg:px-5 py-3 sm:py-4 md:py-5 lg:py-5 border overflow-hidden group rounded-sm opacity-0',
                            isMenuOpen && 'animate-item-enter',
                        )}
                        style={{
                            animationDelay: `${(MENU_LINKS.length + SOCIAL_LINKS.length) * 50}ms`,
                        }}
                    >
                        {/* Animated border */}
                        <div
                            className="absolute inset-0 border border-primary/20 animate-pulse"
                            style={{ animationDuration: '3s' }}
                        />

                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                        <div
                            className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 blur-3xl rounded-full animate-pulse"
                            style={{ animationDuration: '4s' }}
                        />

                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2.5 sm:mb-3 md:mb-4 lg:mb-4">
                                <span className="text-primary text-ui-sm md:text-ui-base lg:text-ui-lg font-mono">
                                    $
                                </span>
                                <p className="text-ui-sm md:text-ui-base lg:text-ui-lg font-mono tracking-widest text-primary/80 uppercase">
                                    Get In Touch
                                </p>
                            </div>
                            <a
                                href={`mailto:${GENERAL_INFO.email}`}
                                className="text-body-sm sm:text-body-base md:text-body-lg lg:text-body-lg font-mono tracking-wide text-foreground/90 hover:text-primary transition-colors duration-300 block break-all mb-2.5 sm:mb-3 md:mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                            >
                                {GENERAL_INFO.email}
                            </a>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-ui-sm md:text-ui-base lg:text-ui-base text-muted-foreground/80">
                                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 flex-shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-full w-full bg-primary" />
                                </span>
                                <span className="font-mono text-primary/70">
                                    STATUS:
                                </span>
                                <span className="truncate font-mono text-foreground/70">
                                    AVAILABLE FOR WORK
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;

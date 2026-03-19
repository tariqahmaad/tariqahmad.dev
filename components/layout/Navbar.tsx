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
} from 'lucide-react';
import {
    GitHubIcon,
    LinkedInIcon,
} from '@/components/shared/icons';
import { useRouter, usePathname } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useMenuKeyboardNavigation } from '@/hooks/useMenuKeyboardNavigation';

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

const ANIMATION = {
    BASE_DELAY_MS: 80,
    SOCIAL_DELAY_MS: 160,
    CONTACT_DELAY_MS: 200,
    ITEM_STAGGER_MS: 60,
} as const;

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const CORNER_POSITIONS: Record<CornerPosition, string> = {
    'top-left': 'top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8',
    'top-right': 'top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8',
    'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8',
    'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8',
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
        <div className={`absolute ${CORNER_POSITIONS[position]} w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 pointer-events-none`}>
            <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-full h-[1px] ${horizontalGradient}`} />
            <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} h-full w-[1px] ${verticalGradient}`} />
        </div>
    );
};

const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    GitHub: GitHubIcon,
    LinkedIn: LinkedInIcon,
};

const Navbar = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    // Close menu handler
    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    // Scroll detection for active section
    const activeSection = useScrollDetection({ links: MENU_LINKS, offset: 100 });

    // Keyboard navigation
    const { focusedIndex, setFocusedIndex } = useMenuKeyboardNavigation({
        isOpen: isMenuOpen,
        itemCount: MENU_LINKS.length + SOCIAL_LINKS.length,
        onClose: closeMenu,
    });

    // Body scroll lock
    useScrollLock(isMenuOpen);

    // Focus the appropriate element when focusedIndex changes
    useEffect(() => {
        if (focusedIndex >= 0) {
            setTimeout(() => {
                if (focusedIndex < MENU_LINKS.length) {
                    buttonRefs.current[focusedIndex]?.focus();
                } else {
                    socialRefs.current[focusedIndex - MENU_LINKS.length]?.focus();
                }
            }, 0);
        }
    }, [focusedIndex]);

    // Hide navbar on project details pages
    if (pathname?.startsWith('/projects/')) return null;

    return (
        <>
            {/* Hamburger Button */}
            <div className="sticky top-0 z-[40]">
                <button
                    className={cn(
                        'group',
                        'w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14',
                        'absolute top-4 sm:top-5 right-4 sm:right-6 md:right-8',
                        'z-[2]',
                        'flex items-center justify-center',
                        'bg-background/50 backdrop-blur-sm',
                        'hover:bg-background/80 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,255,0,0.15)]',
                        'transition-all duration-300 cursor-pointer',
                        'border border-white/5',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        'will-change-transform',
                        isMenuOpen && 'scale-90 md:translate-y-4',
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
                                'bg-foreground transition-all duration-500 ease-&lsqb;cubic-bezier(0.68,-0.6,0.32,1.6)&rsqb;',
                                'will-change-transform',
                                isMenuOpen
                                    ? 'top-1/2 -translate-y-1/2 rotate-45 bg-primary shadow-[0_0_8px_rgba(0,255,0,0.4)]'
                                    : 'top-[2px]',
                            )}
                        />
                        {/* Bottom line */}
                        <span
                            className={cn(
                                'absolute left-1/2 -translate-x-1/2',
                                'w-6 sm:w-7 h-[2.5px] rounded-full',
                                'bg-foreground transition-all duration-500 ease-&lsqb;cubic-bezier(0.68,-0.6,0.32,1.6)&rsqb; delay-75',
                                'will-change-transform',
                                isMenuOpen
                                    ? 'bottom-1/2 translate-y-1/2 -rotate-45 bg-primary shadow-[0_0_8px_rgba(0,255,0,0.4)]'
                                    : 'bottom-[2px]',
                            )}
                        />
                    </div>
                </button>
            </div>

            {/* Backdrop with vignette */}
            <div
                className={cn(
                    'fixed inset-0 z-[30] bg-black/90 backdrop-blur-md',
                    'transition-all duration-300 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;',
                    'will-change-transform',
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
                className={cn(
                    'fixed top-0 right-0 h-[100dvh] overflow-y-auto',
                    'w-full sm:w-[85vw] md:w-[550px] lg:w-[580px] xl:w-[620px]',
                    'transform transition-all duration-500 ease-&lsqb;cubic-bezier(0.65,0,0.35,1)&rsqb; z-[31]',
                    'py-12 sm:py-14 md:py-14 lg:py-14',
                    'px-5 sm:px-6 md:px-6 lg:px-8 xl:px-10',
                    'will-change-transform',
                    'pt-[max(2.5rem,env(safe-area-inset-top)+0.75rem)] sm:pt-[max(3.5rem,env(safe-area-inset-top)+1rem)]',
                    'pb-[max(3rem,env(safe-area-inset-bottom)+0.75rem)] sm:pb-[max(3.5rem,env(safe-area-inset-bottom)+1rem)]',
                    'overflow-y-auto overflow-x-hidden',
                    isMenuOpen ? 'animate-menu-enter' : 'translate-x-[120%]',
                )}
                aria-label="Main navigation"
                role="dialog"
                aria-modal="true"
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

                <div className="relative z-10 w-full mx-auto mt-8 sm:mt-6 md:mt-12 lg:mt-16">
                    {/* Navigation Section */}
                    <div className="mb-5 sm:mb-7 md:mb-8 lg:mb-8">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-4 lg:mb-5">
                            <span className="text-primary text-ui-sm md:text-ui-base lg:text-ui-lg font-mono">
                                $
                            </span>
                            <p className="text-ui-sm md:text-ui-base lg:text-ui-lg font-mono tracking-widest text-primary/80 uppercase">
                                Navigation
                            </p>
                            <span className="ml-auto text-[11px] xs:text-ui-sm sm:text-ui-sm font-mono text-muted-foreground/40">
                                {String(MENU_LINKS.length).padStart(2, '0')} items
                            </span>
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
                                            'opacity-0',
                                            isMenuOpen && 'animate-item-enter',
                                        )}
                                        style={{
                                            animationDelay: `${ANIMATION.BASE_DELAY_MS + idx * ANIMATION.ITEM_STAGGER_MS}ms`,
                                        }}
                                    >
                                        <button
                                            ref={(el) => {
                                                buttonRefs.current[idx] = el;
                                            }}
                                            onClick={() => {
                                                closeMenu();

                                                if (link.url.startsWith('/#')) {
                                                    const id =
                                                        link.url.substring(2);
                                                    setTimeout(() => {
                                                        const element =
                                                            document.getElementById(
                                                                id,
                                                            );
                                                        if (element) {
                                                            const offset = 80;
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
                                                'gap-2.5 xs:gap-3 sm:gap-3 md:gap-3.5 lg:gap-4',
                                                'px-3 xs:px-3.5 sm:px-3.5 md:px-4 lg:px-5',
                                                'py-3 xs:py-3 sm:py-3 md:py-3.5 lg:py-4',
                                                'border border-white/5 transition-all duration-200 cursor-pointer',
                                                'relative overflow-hidden rounded-sm',
                                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                                                'active:scale-[0.98]',
                                                'will-change-transform',
                                                // Shimmer effect
                                                'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent',
                                                'before:translate-x-[-200%] before:transition-transform before:duration-400',
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
                                                    'w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 rounded-full transition-all flex-shrink-0',
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
                            {SOCIAL_LINKS.map((link, idx) => {
                                const SocialIcon =
                                    SOCIAL_ICON_MAP[link.name] || MoveUpRight;
                                return (
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
                                            'px-3 xs:px-3.5 sm:px-3.5 md:px-4 lg:px-5',
                                            'py-3 xs:py-3 sm:py-3 md:py-3.5 lg:py-3.5',
                                            'border border-white/5 hover:border-primary/40',
                                            'bg-white/[0.02] hover:bg-primary/[0.06]',
                                            'transition-all duration-200 rounded-sm',
                                            'hover:shadow-[0_0_20px_rgba(0,255,0,0.15)]',
                                            'opacity-0',
                                            isMenuOpen && 'animate-item-enter',
                                            'relative overflow-hidden',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                                            'active:scale-95',
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
                                        style={{
                                            animationDelay: `${ANIMATION.SOCIAL_DELAY_MS + (idx + MENU_LINKS.length) * ANIMATION.ITEM_STAGGER_MS}ms`,
                                        }}
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
                                );
                            })}
                        </div>
                    </div>

                    {/* Get In Touch Section */}
                    <div
                        className={cn(
                            'relative px-3 sm:px-4 md:px-5 lg:px-5 py-3 sm:py-4 md:py-5 lg:py-5 overflow-hidden group rounded-sm opacity-0',
                            'border border-white/5 hover:border-primary/20',
                            isMenuOpen && 'animate-item-enter',
                        )}
                        style={{
                            animationDelay: `${ANIMATION.CONTACT_DELAY_MS + (MENU_LINKS.length + SOCIAL_LINKS.length) * ANIMATION.ITEM_STAGGER_MS}ms`,
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
                                <span className="group-hover/email:text-primary/60 transition-colors">&gt; </span>
                                {GENERAL_INFO.email}
                            </a>
                            <div className="flex items-center gap-2 sm:gap-2 text-[11px] xs:text-ui-sm sm:text-ui-sm md:text-ui-base lg:text-ui-base text-muted-foreground/80">
                                <span className="relative flex h-2 w-2 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 flex-shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-full w-full bg-primary shadow-[0_0_4px_rgba(0,255,0,0.6)]" />
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

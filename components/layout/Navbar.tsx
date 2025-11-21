'use client';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { MoveUpRight, Terminal, Shield, Code, Briefcase, Award, FolderGit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';

const MENU_LINKS = [
    {
        name: 'Home',
        url: '/',
        icon: Terminal,
        prefix: '~/',
    },
    {
        name: 'About Me',
        url: '/#about-me',
        icon: Shield,
        prefix: './whoami',
    },
    {
        name: 'Skills',
        url: '/#my-stack',
        icon: Code,
        prefix: './tech',
    },
    {
        name: 'Experience',
        url: '/#my-experience',
        icon: Briefcase,
        prefix: './work',
    },
    {
        name: 'Certifications',
        url: '/#certifications',
        icon: Award,
        prefix: './certs',
    },
    {
        name: 'Projects',
        url: '/#selected-projects',
        icon: FolderGit2,
        prefix: './projects',
    },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isMenuOpen) {
            // Prevent scrolling on both body and html
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            // Prevent touch scrolling on mobile
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isMenuOpen]);

    return (
        <>
            <div className="sticky top-0 z-[4]">
                <button
                    className={cn(
                        'group',
                        'w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14',
                        'absolute top-3 xs:top-4 sm:top-5 right-3 xs:right-4 sm:right-5 md:right-8 lg:right-10',
                        'z-[2]',
                        'flex items-center justify-center',
                        'bg-background/50 backdrop-blur-sm',
                        'hover:bg-background/80 transition-all duration-300',
                        'border border-white/5 hover:border-primary/20',
                    )}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className="relative w-5 h-4 xs:w-6 xs:h-[18px] sm:w-7 sm:h-5">
                        <span
                            className={cn(
                                'absolute left-1/2 -translate-x-1/2 top-0',
                                'w-5 xs:w-6 sm:w-7 h-[2px] xs:h-[2.5px]',
                                'bg-foreground transition-all duration-500 ease-menu',
                                {
                                    'rotate-45 top-1/2 -translate-y-1/2 bg-primary w-4 xs:w-5 sm:w-6': isMenuOpen,
                                },
                            )}
                        ></span>
                        <span
                            className={cn(
                                'absolute left-1/2 -translate-x-1/2 bottom-0',
                                'w-5 xs:w-6 sm:w-7 h-[2px] xs:h-[2.5px]',
                                'bg-foreground transition-all duration-500 ease-menu',
                                {
                                    '-rotate-45 bottom-1/2 translate-y-1/2 bg-primary w-4 xs:w-5 sm:w-6': isMenuOpen,
                                },
                            )}
                        ></span>
                    </div>
                </button>
            </div>

            <div
                className={cn(
                    'fixed inset-0 z-[2] bg-black/90 backdrop-blur-md transition-all duration-500',
                    {
                        'opacity-0 invisible pointer-events-none': !isMenuOpen,
                    },
                )}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            <div
                className={cn(
                    'fixed top-0 right-0 h-[100dvh] overflow-y-auto',
                    'w-full xs:w-[90vw] sm:w-[80vw] md:w-[min(520px,65vw)] lg:w-[min(480px,45vw)] xl:w-[420px]',
                    'transform translate-x-full transition-all duration-700 ease-slide z-[3]',
                    'py-20 xs:py-24 sm:py-20 md:py-24 lg:py-28',
                    'px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8',
                    { 'translate-x-0': isMenuOpen },
                )}
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
                    <div className="mb-6 xs:mb-7 sm:mb-8 md:mb-10 lg:mb-12">
                        <div className="flex items-center gap-1.5 xs:gap-2 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                            <span className="text-primary text-[10px] xs:text-ui-xs sm:text-ui-sm font-mono">$</span>
                            <p className="text-[10px] xs:text-ui-xs sm:text-ui-sm font-mono tracking-[0.15em] xs:tracking-widest text-primary/80 uppercase">
                                Navigation
                            </p>
                        </div>
                        <ul className="space-y-1.5 xs:space-y-2 sm:space-y-2.5">
                            {MENU_LINKS.map((link, idx) => {
                                const Icon = link.icon;
                                return (
                                    <li
                                        key={link.name}
                                        className={cn(
                                            'overflow-hidden',
                                            isMenuOpen
                                                ? 'animate-in slide-in-from-right-6 fade-in'
                                                : '',
                                        )}
                                        style={{
                                            animationDelay: `${idx * 50}ms`,
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);

                                                // Handle hash navigation
                                                if (link.url.startsWith('/#')) {
                                                    const id = link.url.substring(2);
                                                    setTimeout(() => {
                                                        const element = document.getElementById(id);
                                                        if (element) {
                                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                        }
                                                    }, 300);
                                                } else {
                                                    router.push(link.url);
                                                }
                                            }}
                                            className={cn(
                                                'group w-full flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5',
                                                'px-2.5 xs:px-3 sm:px-3.5 md:px-4',
                                                'py-2 xs:py-2.5 sm:py-3 md:py-3.5',
                                                'border border-white/5 hover:border-primary/30',
                                                'bg-white/[0.02] hover:bg-primary/5',
                                                'transition-all duration-300',
                                                'hover:shadow-[0_0_15px_rgba(0,255,0,0.08)]',
                                                'relative overflow-hidden',
                                                'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent',
                                                'before:translate-x-[-200%] before:transition-transform before:duration-700',
                                                'hover:before:translate-x-[200%]',
                                            )}
                                        >
                                            <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0" />
                                            <div className="flex-1 text-left min-w-0">
                                                <div className="text-[9px] xs:text-[10px] sm:text-ui-xs md:text-ui-sm font-mono text-muted-foreground/60 group-hover:text-primary/60 transition-colors mb-0.5 truncate">
                                                    {link.prefix}
                                                </div>
                                                <div className="text-[13px] xs:text-body-sm sm:text-body-base md:text-body-lg font-light tracking-wide text-foreground/90 group-hover:text-foreground transition-colors truncate">
                                                    {link.name}
                                                </div>
                                            </div>
                                            <div className="w-1.5 h-1.5 xs:w-[7px] xs:h-[7px] sm:w-2 sm:h-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(0,255,0,0.6)] transition-all flex-shrink-0"></div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="mb-6 xs:mb-7 sm:mb-8 md:mb-10 lg:mb-12">
                        <div className="flex items-center gap-1.5 xs:gap-2 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                            <span className="text-primary text-[10px] xs:text-ui-xs sm:text-ui-sm font-mono">$</span>
                            <p className="text-[10px] xs:text-ui-xs sm:text-ui-sm font-mono tracking-[0.15em] xs:tracking-widest text-primary/80 uppercase">
                                Connect
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-2.5">
                            {SOCIAL_LINKS.map((link, idx) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                        'group',
                                        'px-2.5 xs:px-3 sm:px-3.5 md:px-4',
                                        'py-2 xs:py-2.5 sm:py-3 md:py-3.5',
                                        'border border-white/5 hover:border-primary/30',
                                        'bg-white/[0.02] hover:bg-primary/5',
                                        'transition-all duration-300',
                                        'hover:shadow-[0_0_15px_rgba(0,255,0,0.1)]',
                                        'animate-in fade-in',
                                        'relative overflow-hidden',
                                        'before:absolute before:top-0 before:left-0 before:w-full before:h-[1px]',
                                        'before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent',
                                        'before:opacity-0 before:group-hover:opacity-100 before:transition-opacity',
                                    )}
                                    style={{
                                        animationDelay: `${(idx + 6) * 50}ms`,
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-1.5 xs:gap-2 min-w-0">
                                        <span className="text-[11px] xs:text-[12px] sm:text-body-sm md:text-body-base font-light tracking-wide truncate text-foreground/80 group-hover:text-foreground transition-colors">
                                            {link.name}
                                        </span>
                                        <MoveUpRight
                                            className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0"
                                        />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="relative px-2.5 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-4 md:py-5 lg:py-6 border border-primary/20 bg-primary/[0.03] overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
                        <div className="absolute top-0 right-0 w-16 h-16 xs:w-20 xs:h-20 bg-primary/10 blur-3xl rounded-full"></div>
                        <div className="relative">
                            <div className="flex items-center gap-1.5 xs:gap-2 mb-2 xs:mb-2.5 sm:mb-3">
                                <span className="text-primary text-[10px] xs:text-ui-xs sm:text-ui-sm font-mono">$</span>
                                <p className="text-[10px] xs:text-ui-xs sm:text-ui-sm font-mono tracking-[0.15em] xs:tracking-widest text-primary/80 uppercase">
                                    Get In Touch
                                </p>
                            </div>
                            <a
                                href={`mailto:${GENERAL_INFO.email}`}
                                className="text-[11px] xs:text-[12px] sm:text-body-sm md:text-body-base font-mono tracking-wide text-foreground/90 hover:text-primary transition-colors duration-300 block break-all mb-2 xs:mb-2.5 sm:mb-3"
                            >
                                {GENERAL_INFO.email}
                            </a>
                            <div className="flex items-center gap-1.5 xs:gap-2 text-[9px] xs:text-[10px] sm:text-ui-xs md:text-ui-sm text-muted-foreground/80">
                                <span className="relative flex h-1.5 w-1.5 xs:h-2 xs:w-2 flex-shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-full w-full bg-primary"></span>
                                </span>
                                <span className="font-mono text-primary/60">STATUS:</span>
                                <span className="truncate font-mono">AVAILABLE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;

'use client';

import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { isProjectDetailPage } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
    const pathname = usePathname();

    if (isProjectDetailPage(pathname)) return null;

    return (
        <footer className="relative pb-5 pt-8" id="contact">
            {/* Top separator */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container">
                {/* CTA + bottom bar in one tight block */}
                <div className="text-center mb-4">
                    <p className="text-body-sm text-foreground/60 mb-2">
                        Have a project in mind?
                    </p>
                    <a
                        href={`mailto:${GENERAL_INFO.email}`}
                        className="group relative inline-block"
                    >
                        <span className="font-anton text-heading-sm sm:text-heading-md text-foreground transition-colors duration-300 group-hover:text-primary">
                            {GENERAL_INFO.email}
                        </span>
                        <span className="footer-email-underline absolute -bottom-0.5 inset-x-0 h-[2px] bg-primary/60 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                    </a>
                </div>

                {/* Social + copyright */}
                <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                        {SOCIAL_LINKS.map((link) => {
                            const SocialIcon = link.icon;
                            return (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${link.name} (opens in new tab)`}
                                    className="group/social flex items-center gap-1.5 px-2.5 py-1.5 border border-white/5 rounded-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.04]"
                                >
                                    <SocialIcon className="w-3.5 h-3.5 text-primary/50 group-hover/social:text-primary transition-colors" />
                                    <span className="text-ui-sm text-foreground/60 group-hover/social:text-foreground transition-colors">
                                        {link.name}
                                    </span>
                                    <ArrowUpRight className="w-3 h-3 text-primary/30 group-hover/social:text-primary group-hover/social:translate-x-0.5 group-hover/social:-translate-y-0.5 transition-all" />
                                </a>
                            );
                        })}
                    </div>

                    <p className="text-ui-sm text-muted-foreground/50 font-mono">
                        &copy; {new Date().getFullYear()} tariqahmad.dev
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

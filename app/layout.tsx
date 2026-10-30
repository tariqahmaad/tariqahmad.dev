import type { Metadata, Viewport } from 'next';
import { Anton, Roboto_Flex } from 'next/font/google';
import { ReactLenis } from 'lenis/react';

import 'lenis/dist/lenis.css';
import './globals.css';
import Footer from '@/components/layout/Footer';
import ScrollProgressIndicator from '@/components/layout/ScrollProgressIndicator';
import ParticleBackground from '@/components/layout/ParticleBackground';
import Navbar from '@/components/layout/Navbar';
import CustomCursor from '@/components/layout/CustomCursor';
import Preloader from '@/components/layout/Preloader';
import StickyEmail from '@/components/layout/StickyEmail';
import StructuredData from '@/components/layout/StructuredData';
import ScrollSnap from '@/components/layout/ScrollSnap';
import ScrollToTop from '@/components/layout/ScrollToTop';
import LenisBridge from '@/components/layout/LenisBridge';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

const antonFont = Anton({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-anton',
});

const robotoFlex = Roboto_Flex({
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-roboto-flex',
});

export const viewport: Viewport = {
    themeColor: '#050505',
    colorScheme: 'dark',
};

export const metadata: Metadata = {
    metadataBase: new URL('https://www.tariqahmad.dev'),
    // NOTE: `alternates.canonical` deliberately lives on app/page.tsx, not
    // here. A root-level canonical is inherited by every route that does not
    // override it, which made /404 and error pages declare themselves
    // duplicates of the homepage.
    // The site is a personal portfolio; the CV Builder product carries its own
    // metadata in app/product/page.tsx. Product copy here was inherited by
    // every route that did not override it, including the homepage — which is
    // how the portfolio got indexed as a resume-builder landing page.
    title: {
        default: 'Tariq Ahmad — Software Developer & Computer Engineer',
        template: '%s | Tariq Ahmad',
    },
    description:
        'Portfolio of Tariq Ahmad, a Computer Engineering graduate from Istanbul Aydin University building full-stack web apps with React, Next.js and Node.js.',
    keywords: [
        'Tariq Ahmad',
        'Software Developer',
        'Full Stack Developer',
        'Computer Engineering',
        'Istanbul Aydin University',
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
        'CCNA',
        'MCSE',
        'React Native',
        'Web Development',
        'Portfolio',
    ],
    authors: [{ name: 'Tariq Ahmad', url: 'https://www.tariqahmad.dev' }],
    creator: 'Tariq Ahmad',
    publisher: 'Tariq Ahmad',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://www.tariqahmad.dev',
        siteName: 'Tariq Ahmad',
        title: 'Tariq Ahmad — Software Developer & Computer Engineer',
        description:
            'Portfolio of Tariq Ahmad, a Computer Engineering graduate from Istanbul Aydin University building full-stack web apps with React, Next.js and Node.js.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1376,
                height: 768,
                alt: 'Tariq Ahmad — Full-Stack Developer',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tariq Ahmad — Software Developer & Computer Engineer',
        description:
            'Portfolio of Tariq Ahmad, a Computer Engineering graduate from Istanbul Aydin University building full-stack web apps with React, Next.js and Node.js.',
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.png',
    },
    // verification: {
    //     google: 'your-google-verification-code',
    // },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <StructuredData />
                {/* The preloader and the page-transition wipe are both
                    server-rendered full-screen overlays that only GSAP
                    removes. Without JS they would cover the page forever, so
                    this hides them when scripting is unavailable. */}
                <noscript>
                    <style>{`.preloader-shell,.page-transition{display:none!important}`}</style>
                </noscript>
            </head>
            <body
                className={`${antonFont.variable} ${robotoFlex.variable} antialiased`}
            >
                {/* First focusable element on the page — the nav is a
                    full-screen overlay, so keyboard users need this escape. */}
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:rounded-md focus:bg-primary focus:px-5 focus:py-3 focus:font-mono focus:text-ui-sm focus:text-primary-foreground"
                >
                    Skip to content
                </a>
                <ErrorBoundary>
                    <ReactLenis
                        root
                        options={{
                            lerp: 0.1,
                            duration: 1.4,
                        }}
                    >
                        <LenisBridge />
                        <Navbar />
                        <main id="main">{children}</main>
                        <Footer />

                        <CustomCursor />
                        <Preloader />
                        <ScrollProgressIndicator />
                        <ParticleBackground />
                        <StickyEmail />
                        <ScrollSnap />
                        <ScrollToTop />
                    </ReactLenis>
                </ErrorBoundary>
            </body>
        </html>
    );
}

import type { Metadata } from 'next';
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

const antonFont = Anton({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-anton',
});

const robotoFlex = Roboto_Flex({
    weight: ['100', '400', '500', '600', '700', '800'],
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-roboto-flex',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://tariqahmad.dev'),
    title: 'Tariq Ahmad - Software Developer | Computer Engineering Graduate',
    description:
        'Computer Engineering graduate from Istanbul Aydin University with expertise in full-stack development, networking, and AI. CGPA 3.36/4.0. CCNA, MCSE, React Native certified.',
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
    authors: [{ name: 'Tariq Ahmad', url: 'https://tariqahmad.dev' }],
    creator: 'Tariq Ahmad',
    publisher: 'Tariq Ahmad',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://tariqahmad.dev',
        siteName: 'Tariq Ahmad Portfolio',
        title: 'Tariq Ahmad - Software Developer | Computer Engineering Graduate',
        description:
            'Computer Engineering graduate from Istanbul Aydin University with expertise in full-stack development, networking, and AI. CCNA, MCSE, React Native certified.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Tariq Ahmad - Software Developer Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tariq Ahmad - Software Developer | Computer Engineering Graduate',
        description:
            'Computer Engineering graduate with expertise in full-stack development, networking, and AI.',
        images: ['/og-image.png'],
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
            </head>
            <body
                className={`${antonFont.variable} ${robotoFlex.variable} antialiased`}
            >
                <ReactLenis
                    root
                    options={{
                        lerp: 0.1,
                        duration: 1.4,
                    }}
                >
                    <Navbar />
                    <main>{children}</main>
                    <Footer />

                    <CustomCursor />
                    <Preloader />
                    <ScrollProgressIndicator />
                    <ParticleBackground />
                    <StickyEmail />
                </ReactLenis>
            </body>
        </html>
    );
}

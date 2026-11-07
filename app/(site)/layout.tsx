import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/layout/Preloader';
import ParticleBackground from '@/components/layout/ParticleBackground';
import StickyEmail from '@/components/layout/StickyEmail';
import ScrollSnap from '@/components/layout/ScrollSnap';

/**
 * Marketing shell: the portfolio homepage and the CV Builder case study.
 *
 * Project detail pages live outside this group on purpose — they deliberately
 * drop the menu/footer/preloader for an immersive case-file layout, and before
 * the split every one of these components was still mounted (and still shipped
 * its JavaScript) on those routes just to return null.
 */
export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />

            <Preloader />
            <ParticleBackground />
            <StickyEmail />
            <ScrollSnap />
        </>
    );
}

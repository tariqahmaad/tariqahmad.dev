'use client';

import { GENERAL_INFO } from '@/lib/data';
import { isProjectDetailPage } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();

    if (isProjectDetailPage(pathname)) return null;

    return (
        <footer className="text-center pb-5" id="contact">
            <div className="container">
                <p className="text-body-lg">Have a project in mind?</p>
                <a
                    href={`mailto:${GENERAL_INFO.email}`}
                    className="text-heading-sm sm:text-heading-md font-anton inline-block mt-5 mb-10 hover:text-primary hover:underline"
                >
                    {GENERAL_INFO.email}
                </a>
            </div>
        </footer>
    );
};

export default Footer;

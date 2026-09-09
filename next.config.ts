import type { NextConfig } from 'next';

// Security headers applied to every route. Kept conservative so the site's
// inline GSAP styles, Next's inline bootstrap script and the JSON-LD block all
// keep working (a strict CSP would need nonces — see the comment below).
const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
];

const nextConfig: NextConfig = {
    // Don't advertise the framework version.
    poweredByHeader: false,
    images: {
        formats: ['image/avif', 'image/webp'],
    },
    // lucide-react is a barrel file; this keeps tree-shaking cheap in dev and
    // avoids pulling the whole icon set into shared chunks.
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;

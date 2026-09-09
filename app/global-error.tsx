'use client';

import GlobalError from '@/components/error/GlobalErrorFallback';

// Next.js only invokes `app/global-error.tsx` when the ROOT layout itself
// throws or a fatal render error occurs — `app/error.tsx` cannot catch those.
// The fallback in components/error/ was written for exactly this slot but was
// never wired up, so root/SSR failures fell through to Next's default page.
export default GlobalError;

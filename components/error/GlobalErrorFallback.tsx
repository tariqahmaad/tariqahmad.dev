'use client';

import { useEffect } from 'react';

import HudErrorScreen from '@/components/error/HudErrorScreen';
import HudButton from '@/components/shared/hud/HudButton';

/**
 * Fatal fallback: Next renders this instead of the root layout when the layout
 * itself throws, so it must provide its own <html>/<body>.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Global error:', error);
        }
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-background text-foreground antialiased">
                <HudErrorScreen
                    command="systemctl restart portfolio"
                    output="fatal: root layout failed to render"
                    title="SYSTEM ERROR"
                    description="A critical error stopped the site shell from rendering. Reloading usually clears it; if not, the build needs attention."
                    digest={error.digest}
                    actions={
                        <>
                            <HudButton
                                variant="solid"
                                size="md"
                                onClick={() => reset()}
                            >
                                Reload
                            </HudButton>
                            <HudButton
                                variant="outline"
                                size="md"
                                onClick={() => {
                                    window.location.href = '/';
                                }}
                            >
                                Go home
                            </HudButton>
                        </>
                    }
                />
            </body>
        </html>
    );
}

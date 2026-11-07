'use client';

import { useEffect } from 'react';

import HudErrorScreen from '@/components/error/HudErrorScreen';
import HudButton from '@/components/shared/hud/HudButton';

/**
 * Next.js 15 App Router error boundary. Catches render/lifecycle failures in
 * the page tree and offers a reset; the shell (menu, console) stays mounted.
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Application error:', error);
        }
    }, [error]);

    return (
        <HudErrorScreen
            command="tail -f /var/log/portfolio.log"
            output="signal lost — renderer crashed"
            title="SIGNAL LOST"
            description="Something threw while rendering this page. Retrying re-renders the segment; the rest of the site is unaffected."
            digest={error.digest}
            actions={
                <>
                    <HudButton
                        variant="solid"
                        size="md"
                        onClick={() => reset()}
                    >
                        Retry
                    </HudButton>
                    <HudButton href="/" variant="outline" size="md">
                        Go home
                    </HudButton>
                </>
            }
            extra={
                process.env.NODE_ENV === 'development' ? (
                    <details className="border border-white/10 bg-background/60 p-4">
                        <summary className="cursor-pointer font-mono text-ui-sm text-primary">
                            stack trace
                        </summary>
                        {/* `stack` already begins with the message. */}
                        <pre className="mt-2 max-h-40 overflow-auto font-mono text-ui-xs text-muted-foreground">
                            {error.stack ?? error.message}
                        </pre>
                    </details>
                ) : null
            }
        />
    );
}

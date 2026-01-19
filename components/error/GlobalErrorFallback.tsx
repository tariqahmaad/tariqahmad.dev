'use client';
import { useEffect } from 'react';

/**
 * Global error fallback component for Next.js 15 app router
 * This component is displayed when a fatal error occurs in the app
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Global error:', error);
        }
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-background text-foreground antialiased">
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-anton text-primary">
                                System Error
                            </h1>
                            <p className="text-muted-foreground">
                                A critical error has occurred. Please refresh the
                                page or try again later.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="text-left bg-card border border-border rounded-lg p-4">
                                <summary className="cursor-pointer text-sm font-mono text-primary mb-2">
                                    Error Details
                                </summary>
                                <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
                                    {error.message}
                                    {error.stack}
                                </pre>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={reset}
                                className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground hover:bg-primary-hover rounded-md transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-primary text-primary hover:bg-primary/10 rounded-md transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}

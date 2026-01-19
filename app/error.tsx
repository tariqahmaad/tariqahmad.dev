'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Next.js 15 App Router Error Boundary
 * Catches errors in the application and displays a user-friendly error page
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Application error:', error);
        }
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-anton text-primary">
                        Something Went Wrong
                    </h1>
                    <p className="text-muted-foreground">
                        An unexpected error occurred. Please try again or contact
                        support if the problem persists.
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
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-primary text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

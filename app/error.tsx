'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center px-4">
                <h1 className="text-6xl font-anton text-primary mb-4">Oops!</h1>
                <h2 className="text-2xl font-anton mb-4">Something went wrong</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    We encountered an unexpected error. Please try again or return to the homepage.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 border border-border hover:bg-background-light transition-colors rounded"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

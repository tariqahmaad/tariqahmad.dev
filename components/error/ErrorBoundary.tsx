'use client';
import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    /** Bumped on reset so the subtree remounts instead of re-rendering into
     *  the same deterministic throw. */
    resetKey: number;
}

/**
 * Error Boundary component to catch and handle errors thrown while rendering
 * the component tree below it.
 *
 * Scope note: React error boundaries only catch errors from rendering,
 * lifecycle methods and constructors of descendants. They do NOT catch
 * errors from event handlers, setTimeout/rAF callbacks, promises, GSAP
 * callbacks, observers, or Server Components — those need their own
 * try/catch or an error-reporting service.
 */
export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, resetKey: 0 };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error Boundary caught an error:', error, errorInfo);
        }
    }

    resetErrorBoundary = () => {
        this.setState((prev) => ({
            hasError: false,
            error: null,
            resetKey: prev.resetKey + 1,
        }));
    };

    render() {
        if (this.state.hasError) {
            const FallbackComponent =
                this.props.fallback ||
                DefaultErrorFallback;
            return <FallbackComponent error={this.state.error!} resetErrorBoundary={this.resetErrorBoundary} />;
        }

        return (
            <React.Fragment key={this.state.resetKey}>
                {this.props.children}
            </React.Fragment>
        );
    }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({
    error,
    resetErrorBoundary,
}: {
    error: Error;
    resetErrorBoundary: () => void;
}): React.ReactNode {
    return (
        <div
            role="alert"
            className="flex items-center justify-center min-h-screen bg-background text-foreground p-4"
        >
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-anton text-primary">
                        Oops!
                    </h1>
                    <p className="text-muted-foreground">
                        Something went wrong. Please try refreshing the page.
                    </p>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <details className="text-left bg-card border border-border rounded-lg p-4">
                        <summary className="cursor-pointer text-sm font-mono text-primary mb-2">
                            Error Details
                        </summary>
                        <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
                            {error.stack ?? error.message}
                        </pre>
                    </details>
                )}

                <button
                    type="button"
                    onClick={resetErrorBoundary}
                    className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground hover:bg-primary-hover rounded-md transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

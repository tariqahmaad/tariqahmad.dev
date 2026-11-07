'use client';
import React from 'react';

import HudErrorScreen from '@/components/error/HudErrorScreen';
import HudButton from '@/components/shared/hud/HudButton';

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
        <HudErrorScreen
            command="render --component-tree"
            output="uncaught exception in a client component"
            title="SIGNAL LOST"
            description="The page tree failed to render. Retrying remounts it from scratch; the console and menu come back with it."
            actions={
                <HudButton
                    variant="solid"
                    size="md"
                    onClick={resetErrorBoundary}
                >
                    Retry
                </HudButton>
            }
            extra={
                process.env.NODE_ENV === 'development' ? (
                    <details className="border border-white/10 bg-background/60 p-4">
                        <summary className="cursor-pointer font-mono text-ui-sm text-primary">
                            stack trace
                        </summary>
                        <pre className="mt-2 max-h-40 overflow-auto font-mono text-ui-xs text-muted-foreground">
                            {error.stack ?? error.message}
                        </pre>
                    </details>
                ) : null
            }
        />
    );
}

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
    /** Monospace command that "failed", e.g. `cd /missing-page`. */
    command: string;
    /** Shell output line, e.g. `no such file or directory`. */
    output: string;
    title: string;
    description: string;
    digest?: string;
    actions: ReactNode;
    /** Optional extra block (suggestions, dev-only stack trace). */
    extra?: ReactNode;
    className?: string;
}

/**
 * Shared error surface for 404, route errors and the global fallback.
 *
 * The rest of the site speaks in terminals and corner brackets; the old error
 * pages were plain Tailwind cards with rounded corners, which made a failure
 * look like a different product. This keeps the same vocabulary without
 * depending on client hooks, so it can be used from server components.
 */
export default function HudErrorScreen({
    command,
    output,
    title,
    description,
    digest,
    actions,
    extra,
    className,
}: Props) {
    return (
        <main
            id="main"
            className={cn(
                'relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-20 text-foreground',
                className,
            )}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-menu-grid opacity-[0.03]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hud-scanlines opacity-[0.015]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/[0.06] to-transparent"
            />

            <div className="relative w-full max-w-2xl">
                <div className="relative border border-primary/25 bg-background-light/40 p-6 sm:p-10 rounded-tl-[10px] rounded-br-[10px]">
                    {/* Corner brackets, fully drawn. */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-tl-[10px] border-t-2 border-l-2 border-primary/70 [clip-path:inset(0_85%_70%_0)]"
                    />
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-br-[10px] border-b-2 border-r-2 border-primary/70 [clip-path:inset(70%_0_0_85%)]"
                    />

                    <p className="font-mono text-ui-sm uppercase tracking-[0.3em] text-primary/80">
                        <span className="text-primary">$</span> tariq
                        <span className="text-subtle"> --error</span>
                    </p>

                    <h1 className="mt-6 font-anton text-heading-md leading-[1.05] sm:text-heading-lg">
                        {title}
                    </h1>

                    <div className="mt-6 border-l-2 border-primary/40 pl-4 font-mono text-body-sm">
                        <p className="break-all text-subtle">
                            <span className="text-primary">$</span> {command}
                        </p>
                        <p className="mt-1 break-all text-primary/80">
                            {output}
                        </p>
                    </div>

                    <p className="mt-6 max-w-[52ch] text-body-base leading-relaxed text-muted-foreground">
                        {description}
                    </p>

                    {digest ? (
                        <p className="mt-2 font-mono text-ui-sm text-subtle">
                            ref: {digest}
                        </p>
                    ) : null}

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        {actions}
                    </div>

                    {extra ? <div className="mt-8">{extra}</div> : null}
                </div>

                <p className="mt-4 text-center font-mono text-ui-xs uppercase tracking-[0.2em] text-subtle">
                    Press ⌘K to open the console, or use the links above.
                </p>
            </div>
        </main>
    );
}

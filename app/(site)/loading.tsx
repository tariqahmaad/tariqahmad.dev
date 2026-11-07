export default function Loading() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-menu-grid opacity-[0.03]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hud-scanlines opacity-[0.015]"
            />

            <div
                role="status"
                aria-label="Loading page"
                className="relative w-full max-w-md rounded-tl-[10px] rounded-br-[10px] border border-primary/20 bg-background-light/40 p-6 sm:p-8"
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-tl-[10px] border-t-2 border-l-2 border-primary/60 [clip-path:inset(0_85%_70%_0)]"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-br-[10px] border-b-2 border-r-2 border-primary/60 [clip-path:inset(70%_0_0_85%)]"
                />

                <p className="font-mono text-ui-sm uppercase tracking-[0.3em] text-primary/80">
                    <span className="text-primary">$</span> tariq
                    <span className="text-subtle"> --boot</span>
                </p>
                <p className="mt-4 font-mono text-body-sm text-primary/80">
                    loading portfolio
                    <span className="animate-pulse">_</span>
                </p>

                <div className="relative mt-6 h-[2px] w-full overflow-hidden bg-white/5">
                    <div className="relative h-full w-1/3 animate-[scan_1.6s_ease-in-out_infinite] bg-primary/80" />
                </div>

                <div className="mt-3 flex items-center justify-between font-mono text-ui-xs uppercase tracking-[0.2em] text-subtle">
                    <span>mounting sections</span>
                    <span>please wait</span>
                </div>
            </div>
        </div>
    );
}

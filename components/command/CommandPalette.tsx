'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CornerDownLeft, Search, X } from 'lucide-react';

import HudOverlay from '@/components/shared/hud/HudOverlay';
import { useActiveSection } from '@/components/layout/ActiveSectionProvider';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useInertOutside } from '@/hooks/useInertOutside';
import {
    COMMAND_GROUPS,
    COMMAND_SEEDS,
    type CommandSeed,
} from '@/lib/commands';
import { SECTION_COUNT, SITE_SECTIONS, sectionIndex } from '@/lib/navigation';
import { cn, scrollToSection } from '@/lib/utils';

interface Props {
    onClose: () => void;
}

const normalize = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

/** Prefix hits rank above substring hits; empty query keeps source order. */
function scoreCommand(command: CommandSeed, query: string): number {
    const label = normalize(command.label);
    const keywords = (command.keywords ?? []).map(normalize);
    const group = normalize(command.group);

    if (label === query) return 100;
    if (label.startsWith(query)) return 80;
    if (label.split(/[\s/]+/).some((word) => word.startsWith(query))) {
        return 60;
    }
    if (label.includes(query)) return 40;
    if (keywords.some((keyword) => keyword.startsWith(query))) return 30;
    if (keywords.some((keyword) => keyword.includes(query))) return 20;
    if (group.includes(query)) return 10;
    return 0;
}

/**
 * The command console (⌘K / Ctrl+K).
 *
 * A terminal-styled palette over the same section/project/link index that
 * feeds the rest of the site. It is a modal dialog with a combobox input: the
 * list is driven by `aria-activedescendant` rather than moving focus, so
 * screen-reader users keep typing while arrowing through results.
 */
export default function CommandPalette({ onClose }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const activeSection = useActiveSection();

    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
    const openerRef = useRef<Element | null>(null);
    const statusTimerRef = useRef<number | null>(null);

    const [query, setQuery] = useState('');
    const [index, setIndex] = useState(0);
    const [status, setStatus] = useState('');
    const [clock, setClock] = useState('');

    useScrollLock(true);
    useInertOutside(true, () => [rootRef.current]);

    const results = useMemo(() => {
        const needle = normalize(query.trim());
        const menuAvailable = pathname === '/' || pathname === '/product';

        const scored = COMMAND_SEEDS.filter(
            (command) =>
                command.kind !== 'open-menu' || menuAvailable,
        )
            .map((command) => ({
                command,
                score: needle ? scoreCommand(command, needle) : 1,
            }))
            .filter((entry) => entry.score > 0);

        scored.sort((a, b) => {
            const groupDelta =
                COMMAND_GROUPS.indexOf(a.command.group) -
                COMMAND_GROUPS.indexOf(b.command.group);
            if (groupDelta !== 0) return groupDelta;
            // Empty query: keep the hand-written source order (Home first)
            // instead of sorting every group alphabetically.
            if (!needle) return 0;
            if (a.score !== b.score) return b.score - a.score;
            return a.command.label.localeCompare(b.command.label);
        });

        return scored.map((entry) => entry.command);
    }, [query, pathname]);

    const grouped = useMemo(
        () =>
            COMMAND_GROUPS.map((group) => ({
                group,
                items: results.filter((command) => command.group === group),
            })).filter((section) => section.items.length > 0),
        [results],
    );

    const indexById = useMemo(
        () => new Map(results.map((command, position) => [command.id, position])),
        [results],
    );

    const activeCommand = results[index];

    // Capture the opener, focus the input, and hand focus back on close. The
    // restore is deferred one task because the inert teardown runs in the same
    // commit: focusing an element that is still inert would be a no-op.
    useEffect(() => {
        openerRef.current = document.activeElement;
        const frame = requestAnimationFrame(() => inputRef.current?.focus());
        return () => {
            cancelAnimationFrame(frame);
            const opener = openerRef.current;
            window.setTimeout(() => {
                if (opener instanceof HTMLElement && opener.isConnected) {
                    opener.focus({ preventScroll: true });
                }
            }, 0);
        };
    }, []);

    useEffect(() => {
        setIndex(0);
    }, [query]);

    useEffect(() => {
        setIndex((current) =>
            Math.min(current, Math.max(results.length - 1, 0)),
        );
    }, [results.length]);

    useEffect(() => {
        optionRefs.current[index]?.scrollIntoView({ block: 'nearest' });
    }, [index]);

    useEffect(() => {
        const tick = () =>
            setClock(
                new Date().toLocaleTimeString('en-GB', { hour12: false }),
            );
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, []);

    useEffect(
        () => () => {
            if (statusTimerRef.current !== null) {
                window.clearTimeout(statusTimerRef.current);
            }
        },
        [],
    );

    const announce = useCallback((message: string) => {
        setStatus(message);
        if (statusTimerRef.current !== null) {
            window.clearTimeout(statusTimerRef.current);
        }
        statusTimerRef.current = window.setTimeout(() => {
            statusTimerRef.current = null;
            setStatus('');
        }, 2600);
    }, []);

    const copyEmail = useCallback(
        async (email: string) => {
            try {
                await navigator.clipboard.writeText(email);
                announce(`COPIED — ${email}`);
            } catch {
                announce('COPY BLOCKED — select the address manually');
            }
        },
        [announce],
    );

    const run = useCallback(
        (command: CommandSeed | undefined) => {
            if (!command) return;

            switch (command.kind) {
                case 'section': {
                    const id = command.target ?? '';
                    if (pathname === '/') {
                        onClose();
                        scrollToSection(id, 0);
                    } else {
                        router.push(`/#${id}`);
                        onClose();
                    }
                    return;
                }
                case 'route': {
                    router.push(command.target ?? '/');
                    onClose();
                    return;
                }
                case 'external': {
                    if (!command.target) return;
                    window.open(
                        command.target,
                        '_blank',
                        'noopener,noreferrer',
                    );
                    onClose();
                    return;
                }
                case 'copy-email': {
                    void copyEmail(command.target ?? '');
                    return;
                }
                case 'open-menu': {
                    onClose();
                    window.dispatchEvent(new Event('site-menu:open'));
                    return;
                }
            }
        },
        [copyEmail, onClose, pathname, router],
    );

    const onKeyDown = useCallback(
        (event: ReactKeyboardEvent<HTMLDivElement>) => {
            // Enter/arrows during IME composition belong to the IME.
            if (event.nativeEvent.isComposing) return;

            switch (event.key) {
                case 'ArrowDown': {
                    event.preventDefault();
                    if (results.length === 0) return;
                    setIndex((current) => (current + 1) % results.length);
                    return;
                }
                case 'ArrowUp': {
                    event.preventDefault();
                    if (results.length === 0) return;
                    setIndex(
                        (current) =>
                            (current - 1 + results.length) % results.length,
                    );
                    return;
                }
                case 'Home': {
                    event.preventDefault();
                    setIndex(0);
                    return;
                }
                case 'End': {
                    event.preventDefault();
                    setIndex(Math.max(results.length - 1, 0));
                    return;
                }
                case 'Enter': {
                    event.preventDefault();
                    run(activeCommand);
                    return;
                }
                case 'Escape': {
                    event.preventDefault();
                    event.stopPropagation();
                    onClose();
                    return;
                }
                case 'Tab': {
                    // Two focusables only: keep Tab inside the dialog.
                    event.preventDefault();
                    if (document.activeElement === inputRef.current) {
                        closeRef.current?.focus();
                    } else {
                        inputRef.current?.focus();
                    }
                    return;
                }
                default:
                    return;
            }
        },
        [activeCommand, onClose, results.length, run],
    );

    const readout = useMemo(() => {
        if (!activeSection) {
            return pathname === '/' ? 'CONSOLE READY' : `~${pathname}`;
        }
        const position = sectionIndex(activeSection);
        const section = SITE_SECTIONS[position];
        if (!section) return 'CONSOLE READY';
        return `SECTION ${String(position + 1).padStart(2, '0')}/${String(
            SECTION_COUNT,
        ).padStart(2, '0')} · ${section.label.toUpperCase()}`;
    }, [activeSection, pathname]);

    return (
        <div
            ref={rootRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command console"
            className="fixed inset-0 z-[70] flex items-start justify-center px-3 pt-[7vh] sm:pt-[12vh]"
            onKeyDown={onKeyDown}
        >
            <HudOverlay open onClick={onClose} zIndex={0} />

            <div className="relative z-10 w-full max-w-[660px] overflow-hidden rounded-tl-[10px] rounded-br-[10px] border border-primary/25 bg-background/95 shadow-[0_0_70px_-15px_hsl(var(--primary)/0.3)]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-menu-grid opacity-[0.02]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 hud-scanlines opacity-[0.012]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/[0.08] to-transparent"
                />

                {/* Title bar */}
                <div className="relative flex items-center justify-between gap-3 border-b border-white/5 bg-background px-4 py-3 sm:px-5">
                    <p className="font-mono text-ui-sm uppercase tracking-[0.2em] text-primary/80">
                        <span className="text-primary">$</span> tariq
                        <span className="text-subtle"> --console</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <kbd className="hidden rounded-sm border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-ui-xs text-subtle sm:inline-block">
                            ESC
                        </kbd>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close command console"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-subtle transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Prompt */}
                <div className="relative flex items-center gap-3 border-b border-white/5 px-4 py-3.5 focus-within:border-primary/30 sm:px-5">
                    <Search
                        className="h-4 w-4 shrink-0 text-primary/70"
                        aria-hidden="true"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search or jump to…"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="command-list"
                        aria-autocomplete="list"
                        aria-activedescendant={
                            activeCommand
                                ? `command-option-${index}`
                                : undefined
                        }
                        aria-label="Search commands"
                        autoComplete="off"
                        spellCheck={false}
                        className="command-input min-w-0 flex-1 bg-transparent font-mono text-body-base text-foreground outline-none placeholder:text-subtle"
                    />
                    <span
                        aria-hidden="true"
                        className="hidden shrink-0 items-center gap-1.5 font-mono text-ui-xs uppercase tracking-wider text-subtle sm:flex"
                    >
                        {results.length} hits
                    </span>
                </div>

                {/* Results */}
                <div
                    id="command-list"
                    role="listbox"
                    aria-label="Commands"
                    className="relative max-h-[52vh] min-h-[180px] overflow-y-auto overscroll-contain py-2"
                >
                    {grouped.length === 0 ? (
                        <div className="px-5 py-8 font-mono text-body-sm text-subtle">
                            <p className="text-primary/80">
                                $ grep &quot;{query}&quot; — no matches
                            </p>
                            <p className="mt-2 text-ui-sm">
                                Try “projects”, “cv”, “skills”, or “email”.
                            </p>
                        </div>
                    ) : (
                        grouped.map((group) => (
                            <div
                                key={group.group}
                                role="group"
                                aria-label={group.group}
                                className="px-2 pb-1"
                            >
                                <p
                                    aria-hidden="true"
                                    className="px-3 pb-1 pt-2 font-mono text-ui-xs uppercase tracking-[0.3em] text-subtle"
                                >
                                    {group.group}
                                </p>
                                {group.items.map((command) => {
                                    const position =
                                        indexById.get(command.id) ?? -1;
                                    const selected = position === index;
                                    const Icon = command.icon;

                                    return (
                                        <div
                                            key={command.id}
                                            ref={(element) => {
                                                optionRefs.current[position] =
                                                    element;
                                            }}
                                            id={`command-option-${position}`}
                                            role="option"
                                            aria-selected={selected}
                                            tabIndex={-1}
                                            onMouseMove={() =>
                                                setIndex(position)
                                            }
                                            onMouseDown={(event) =>
                                                event.preventDefault()
                                            }
                                            onClick={() => run(command)}
                                            className={cn(
                                                'group relative flex cursor-pointer items-center gap-3 rounded-sm border px-3 py-2.5 transition-colors',
                                                selected
                                                    ? 'border-primary/40 bg-primary/[0.08]'
                                                    : 'border-transparent',
                                            )}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 transition-opacity',
                                                    selected
                                                        ? 'bg-primary opacity-100'
                                                        : 'bg-transparent opacity-0',
                                                )}
                                            />
                                            <Icon
                                                className={cn(
                                                    'h-4 w-4 shrink-0',
                                                    selected
                                                        ? 'text-primary'
                                                        : 'text-subtle group-hover:text-primary/80',
                                                )}
                                                aria-hidden="true"
                                            />
                                            <span
                                                className={cn(
                                                    'min-w-0 flex-1 truncate text-body-sm',
                                                    selected
                                                        ? 'text-foreground'
                                                        : 'text-foreground/85',
                                                )}
                                            >
                                                {command.label}
                                            </span>
                                            {command.hint ? (
                                                <span className="hidden shrink-0 font-mono text-ui-xs text-subtle sm:block">
                                                    {command.hint}
                                                </span>
                                            ) : null}
                                            {selected ? (
                                                <CornerDownLeft
                                                    className="hidden h-3.5 w-3.5 shrink-0 text-primary/70 sm:block"
                                                    aria-hidden="true"
                                                />
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Status bar */}
                <div className="relative flex flex-col gap-2 border-t border-white/5 bg-background px-4 py-2.5 font-mono text-ui-xs uppercase tracking-[0.16em] text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p aria-hidden="true" className="flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                            <span className="text-primary/70">↑↓</span> move
                        </span>
                        <span>
                            <span className="text-primary/70">↵</span> open
                        </span>
                        <span>
                            <span className="text-primary/70">esc</span> close
                        </span>
                    </p>
                    <p className="flex items-center gap-2 text-primary/70">
                        <span className="h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true" />
                        <span>{readout}</span>
                        <span aria-hidden="true" className="text-subtle">
                            ·
                        </span>
                        <span className="tabular-nums text-subtle">{clock}</span>
                    </p>
                </div>

                <p role="status" aria-live="polite" className="sr-only">
                    {status ||
                        `${results.length} command${
                            results.length === 1 ? '' : 's'
                        } available`}
                </p>
            </div>
        </div>
    );
}

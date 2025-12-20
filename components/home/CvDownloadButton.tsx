'use client';

import React, { useState } from 'react';
import { useGlitchText, AnimationPhase } from '@/hooks/useGlitchText';
import { Check } from 'lucide-react';

const CvDownloadButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [phase, setPhase] = useState<AnimationPhase>('stable');
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success'>(
        'idle',
    );

    const { displayText, opacity } = useGlitchText('CV DOWNLOAD', phase, 0);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setPhase('entering');
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setPhase('stable');
    };

    const handleClick = () => {
        if (downloadStatus === 'success') return;

        // Delay the status change to allow download to start first
        setTimeout(() => {
            setDownloadStatus('success');

            // Reset after 3 seconds
            setTimeout(() => {
                setDownloadStatus('idle');
            }, 3000);
        }, 100);
    };

    return (
        <a
            href="/Tariq_Ahmad_Resume.pdf"
            download="Tariq_Ahmad_Resume.pdf"
            onClick={handleClick}
            className="group relative flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 px-6 md:px-3 py-3 border border-transparent bg-primary/[0.05] shadow-[0_0_15px_rgba(0,255,0,0.1)] backdrop-blur-[2px] hover:bg-primary/[0.1] hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] active:scale-95 transition-all duration-300 ease-out rounded-lg overflow-hidden w-full max-w-[300px] md:max-w-none md:w-[110px] h-14 md:h-auto md:aspect-square"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-lg animate-pulse group-hover:opacity-0 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Scan Line */}
            <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />

            {/* Corner Accents */}
            <svg
                className="absolute top-1 right-1 md:top-0 md:right-0 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                viewBox="0 0 10 10"
            >
                <path
                    d="M0 0 H10 V10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-primary"
                />
            </svg>
            <svg
                className="absolute bottom-1 left-1 md:bottom-0 md:left-0 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                viewBox="0 0 10 10"
            >
                <path
                    d="M0 0 V10 H10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-primary"
                />
            </svg>

            {/* Content Container */}
            <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0 flex items-center justify-center">
                {/* IDLE STATE: Flowing Arrow Animation */}
                {downloadStatus === 'idle' && (
                    <svg
                        viewBox="0 0 24 24"
                        className="w-full h-full text-primary"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* Tray - Reacts to impact */}
                        <path
                            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                            className="animate-tray-pulse origin-[50%_100%]"
                            style={{ transformBox: 'fill-box' }}
                        />

                        {/* Drawing Arrow */}
                        <g className="animate-draw-drop">
                            {/* Main Body */}
                            <path
                                d="M12 3v12"
                                style={{
                                    strokeDasharray: '12',
                                    strokeDashoffset: '12',
                                    animation: 'inherit',
                                }}
                            />
                            {/* Arrow Head */}
                            <polyline
                                points="7 10 12 15 17 10"
                                style={{
                                    strokeDasharray: '16',
                                    strokeDashoffset: '16',
                                    animation: 'inherit',
                                }}
                            />
                        </g>
                    </svg>
                )}

                {/* SUCCESS STATE: Checkmark Pop */}
                {downloadStatus === 'success' && (
                    <div className="animate-check-pop">
                        <Check
                            className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]"
                            strokeWidth={3}
                        />
                        <div className="absolute inset-0 bg-primary/20 blur-xl animate-ping rounded-full" />
                    </div>
                )}
            </div>

            {/* Text */}
            <span
                className="font-mono text-sm xs:text-base md:text-[10px] font-bold tracking-wider text-muted-foreground/90 group-hover:text-primary transition-colors duration-300 relative z-10 text-center"
                style={{
                    opacity: opacity,
                    textShadow: isHovered
                        ? '0 0 10px rgba(0, 255, 0, 0.6)'
                        : 'none',
                }}
            >
                {downloadStatus === 'success' ? 'DOWNLOADED' : displayText}
            </span>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:w-full w-0" />
        </a>
    );
};

export default CvDownloadButton;

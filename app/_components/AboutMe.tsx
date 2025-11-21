'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import React from 'react';

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 80%',
                    end: 'bottom 80%',
                    scrub: 1,
                },
            });

            tl.from('.slide-up-and-fade', {
                y: 100,
                opacity: 0,
                stagger: 0.05,
            });
        },
        { scope: container },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-out',
                    trigger: container.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.to('.slide-up-and-fade', {
                y: -150,
                opacity: 0,
                stagger: 0.05,
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-section" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-4xl md:text-6xl font-thin mb-20 slide-up-and-fade">
                    I believe in building robust and efficient software solutions
                    that solve real-world problems through innovative technology and
                    modern development practices.
                </h2>

                <p className="pb-3 border-b text-muted-foreground slide-up-and-fade">
                    About me.
                </p>

                <div className="grid md:grid-cols-12 mt-9">
                    <div className="md:col-span-5">
                        <p className="text-5xl slide-up-and-fade">
                            Hi, I&apos;m Tariq Ahmad.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="text-lg text-muted-foreground max-w-[450px]">
                            <p className="slide-up-and-fade">
                                I&apos;m a Computer Engineering graduate from Istanbul
                                Aydin University with a solid grounding in software
                                development, networking, and web technologies. Proven success
                                in managing complex projects and enhancing system performance
                                through innovative solutions. Graduated in July 2025 with a CGPA of
                                3.36/4.0.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                My experience spans full-stack development, research
                                assistance in Industry 4.0 technologies, and hands-on work
                                in network infrastructure. I excel in strategic problem-solving,
                                team collaboration, and leadership—consistently delivering
                                projects on time while maintaining high quality standards.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                Fluent in English, native in Dari, and conversational in Hindi,
                                I bring strong cross-cultural communication skills alongside
                                technical expertise in C, C++, Java, Python, and modern web
                                frameworks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;

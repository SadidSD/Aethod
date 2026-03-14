import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { StudioNode } from '@/components/ui/StudioNode';

export default function StudioPage() {
    return (
        <main className="min-h-screen bg-neo-bg overflow-hidden text-neo-text">
            <Navbar />

            <section className="relative container mx-auto max-w-[1440px] pt-32 px-10 pb-20">
                {/* Heading Area */}
                <div className="max-w-lg mb-8">
                    <h1 className="text-[64px] font-medium tracking-tight leading-[1.1]">
                        What We <span className="text-[#5A69EA] opacity-60">Actually</span> Do
                    </h1>
                    <p className="mt-8 text-[18px] font-light text-neo-text/60 leading-relaxed max-w-sm">
                        Operations are overloaded with platforms. Signals are buried under systems. <span className="text-[#5A69EA] font-normal">Aethod</span> converts complexity into coordinated action.
                    </p>
                </div>

                {/* Serpentine Path & Nodes Container */}
                <div className="relative w-full" style={{ height: '520px' }}>
                    {/* SVG Serpentine Path */}
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible"
                        viewBox="0 0 1200 500"
                        fill="none"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Shadow layer for depth */}
                        <path
                            d="M -40,400 C 100,400 180,390 300,360 C 420,330 480,310 540,280 C 600,250 650,220 720,200 C 790,180 850,170 950,140 C 1050,110 1100,100 1260,80"
                            stroke="rgba(0,0,0,0.06)"
                            strokeWidth="40"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Main outer path - thick neomorphic stroke */}
                        <path
                            d="M -40,400 C 100,400 180,390 300,360 C 420,330 480,310 540,280 C 600,250 650,220 720,200 C 790,180 850,170 950,140 C 1050,110 1100,100 1260,80"
                            stroke="#E8E6E3"
                            strokeWidth="32"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Inner path - gradient accent */}
                        <path
                            d="M -40,400 C 100,400 180,390 300,360 C 420,330 480,310 540,280 C 600,250 650,220 720,200 C 790,180 850,170 950,140 C 1050,110 1100,100 1260,80"
                            stroke="url(#pathGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            fill="none"
                            className="opacity-30"
                        />

                        <defs>
                            <linearGradient id="pathGradient" x1="0" y1="400" x2="1200" y2="80" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#5A69EA" />
                                <stop offset="1" stopColor="#BF8BCA" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Node 1: Systems Architecture — bottom-left */}
                    <div
                        className="absolute z-30"
                        style={{ left: '15%', top: '68%', transform: 'translate(-50%, -50%)' }}
                    >
                        <StudioNode />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 min-w-[260px] text-center">
                            <h3 className="text-[24px] font-light leading-tight">
                                Systems <span className="text-[#5A69EA] opacity-60 font-normal">Architecture</span>
                            </h3>
                            <p className="mt-3 text-[15px] font-light text-neo-text/50 leading-relaxed">
                                We design intelligent digital systems.<br />
                                Not apps, not websites — systems
                            </p>
                        </div>
                    </div>

                    {/* Node 2: AI-Driven Automation — middle */}
                    <div
                        className="absolute z-30"
                        style={{ left: '48%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        <StudioNode />
                        <div className="absolute top-full left-full ml-4 mt-2 min-w-[260px]">
                            <h3 className="text-[24px] font-light leading-tight">
                                AI-Driven <span className="text-[#5A69EA] opacity-60 font-normal">Automation</span>
                            </h3>
                            <p className="mt-3 text-[15px] font-light text-neo-text/50 leading-relaxed">
                                Operational intelligence<br />
                                Decision support<br />
                                Process orchestration
                            </p>
                        </div>
                    </div>

                    {/* Node 3: Applied Research — top-right */}
                    <div
                        className="absolute z-30"
                        style={{ left: '75%', top: '32%', transform: 'translate(-50%, -50%)' }}
                    >
                        <StudioNode />
                        <div className="absolute bottom-full left-full ml-4 mb-2 min-w-[280px]">
                            <h3 className="text-[24px] font-light leading-tight">
                                Applied <span className="text-[#5A69EA] opacity-60 font-normal">Research</span>
                            </h3>
                            <p className="mt-3 text-[15px] font-light text-neo-text/50 leading-relaxed">
                                We study emerging systems<br />
                                Then we turn insights into tools<br />
                                Each with short, thoughtful descriptions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

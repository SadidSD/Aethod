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
                    {/* SVG Serpentine Path — Exact Figma export */}
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible"
                        viewBox="0 0 1166 365"
                        fill="none"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <filter id="filter0_ddiiii_145_123" x="0" y="0" width="1166" height="364.928" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="-1" dy="-1"/>
                                <feGaussianBlur stdDeviation="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.5 0"/>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_145_123"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="1" dy="1"/>
                                <feGaussianBlur stdDeviation="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
                                <feBlend mode="normal" in2="effect1_dropShadow_145_123" result="effect2_dropShadow_145_123"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_145_123" result="shape"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="3" dy="3"/>
                                <feGaussianBlur stdDeviation="4"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.9 0"/>
                                <feBlend mode="normal" in2="shape" result="effect3_innerShadow_145_123"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="-3" dy="-3"/>
                                <feGaussianBlur stdDeviation="3"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/>
                                <feBlend mode="normal" in2="effect3_innerShadow_145_123" result="effect4_innerShadow_145_123"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="3" dy="-3"/>
                                <feGaussianBlur stdDeviation="3"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.2 0"/>
                                <feBlend mode="normal" in2="effect4_innerShadow_145_123" result="effect5_innerShadow_145_123"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="-3" dy="3"/>
                                <feGaussianBlur stdDeviation="3"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.2 0"/>
                                <feBlend mode="normal" in2="effect5_innerShadow_145_123" result="effect6_innerShadow_145_123"/>
                            </filter>
                        </defs>

                        <g filter="url(#filter0_ddiiii_145_123)">
                            <path
                                d="M10.502 301.037C10.502 301.037 278.19 379.737 387.502 346.037C465.301 322.052 519.222 255.036 594.502 224.037C717.17 173.524 741.006 227.347 853.502 157.037C933.502 107.037 953.502 83.0367 953.502 83.0367C953.502 83.0367 999.582 34.0816 1081.5 16.9464C1123.96 8.06441 1155.5 10.9464 1155.5 10.9464"
                                stroke="#B2CEFE"
                                strokeWidth="15"
                                strokeLinecap="round"
                            />
                        </g>
                    </svg>

                    {/* Node 1: Systems Architecture — bottom-left on curve */}
                    <div
                        className="absolute z-30"
                        style={{ left: '8%', top: '75%', transform: 'translate(-50%, -50%)' }}
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

                    {/* Node 2: AI-Driven Automation — middle of curve */}
                    <div
                        className="absolute z-30"
                        style={{ left: '42%', top: '58%', transform: 'translate(-50%, -50%)' }}
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

                    {/* Node 3: Applied Research — top-right of curve */}
                    <div
                        className="absolute z-30"
                        style={{ left: '72%', top: '28%', transform: 'translate(-50%, -50%)' }}
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

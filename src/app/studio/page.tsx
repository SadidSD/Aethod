import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { StudioNode } from '@/components/ui/StudioNode';

export default function StudioPage() {
    return (
        <main className="min-h-screen bg-neo-bg overflow-hidden text-neo-text">
            <Navbar />

            <section className="relative container mx-auto max-w-[1440px] pt-20 px-10 pb-10">
                {/* Heading Area */}
                <div className="max-w-lg mb-0">
                    <h1 className="text-[64px] font-medium tracking-tight leading-[1.1]">
                        What We <span className="text-[#5A69EA] opacity-60">Actually</span> Do
                    </h1>
                    <p className="mt-8 text-[18px] font-light text-neo-text/60 leading-relaxed max-w-sm">
                        Operations are overloaded with platforms. Signals are buried under systems. <span className="text-[#5A69EA] font-normal">Aethod</span> converts complexity into coordinated action.
                    </p>
                </div>

                {/* Serpentine Path & Nodes Container */}
                <div className="relative w-full -mt-50" style={{ height: '480px' }}>
                    {/* SVG Serpentine Path — Exact Figma CSS shadows */}
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible"
                        viewBox="0 0 1166 420"
                        fill="none"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Exact Figma CSS: box-shadow with 2 drop shadows + 4 inner shadows */}
                            <filter id="figmaCurveFilter" x="-5%" y="-15%" width="110%" height="140%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />

                                {/* Drop shadow 1: 1px 1px 2px rgba(255,255,255,0.3) */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="1" dy="1" />
                                <feGaussianBlur stdDeviation="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />

                                {/* Drop shadow 2: -1px -1px 2px rgba(182,181,179,0.5) */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="-1" dy="-1" />
                                <feGaussianBlur stdDeviation="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.5 0" />
                                <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />

                                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />

                                {/* Inset 1: inset -3px 3px 6px rgba(182,181,179,0.2) */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="-3" dy="3" />
                                <feGaussianBlur stdDeviation="3" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.2 0" />
                                <feBlend mode="normal" in2="shape" result="effect3_innerShadow" />

                                {/* Inset 2: inset 3px -3px 6px rgba(182,181,179,0.2) */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="3" dy="-3" />
                                <feGaussianBlur stdDeviation="3" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.2 0" />
                                <feBlend mode="normal" in2="effect3_innerShadow" result="effect4_innerShadow" />

                                {/* Inset 3: inset -3px -3px 6px rgba(255,255,255,0.9) */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="-3" dy="-3" />
                                <feGaussianBlur stdDeviation="3" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0" />
                                <feBlend mode="normal" in2="effect4_innerShadow" result="effect5_innerShadow" />

                                {/* Inset 4: inset 3px 3px 8px rgba(182,181,179,0.9) */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="3" dy="3" />
                                <feGaussianBlur stdDeviation="4" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.9 0" />
                                <feBlend mode="normal" in2="effect5_innerShadow" result="effect6_innerShadow" />
                            </filter>
                        </defs>

                        {/* Group both the thick background border and the inner blue path under the Figma shadow filter */}
                        <g filter="url(#figmaCurveFilter)">
                            {/* Thick outer border (#F2F1EF) */}
                            <path
                                d="M10.502 301.037C10.502 301.037 278.19 379.737 387.502 346.037C465.301 322.052 519.222 255.036 594.502 224.037C717.17 173.524 741.006 227.347 853.502 157.037C933.502 107.037 953.502 83.0367 953.502 83.0367C953.502 83.0367 999.582 34.0816 1081.5 16.9464C1123.96 8.06441 1155.5 10.9464 1155.5 10.9464"
                                stroke="#F2F1EF"
                                strokeWidth="36"
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Inner blue path (#B2CEFE) */}
                            <path
                                d="M10.502 301.037C10.502 301.037 278.19 379.737 387.502 346.037C465.301 322.052 519.222 255.036 594.502 224.037C717.17 173.524 741.006 227.347 853.502 157.037C933.502 107.037 953.502 83.0367 953.502 83.0367C953.502 83.0367 999.582 34.0816 1081.5 16.9464C1123.96 8.06441 1155.5 10.9464 1155.5 10.9464"
                                stroke="#B2CEFE"
                                strokeWidth="15"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </g>
                    </svg>

                    {/* Node 1: Systems Architecture — bottom-left on curve */}
                    <div
                        className="absolute z-30"
                        style={{ left: '10%', top: '78%', transform: 'translate(-50%, -50%)' }}
                    >
                        <StudioNode />
                        <div className="absolute top-full left-0 mt-6 min-w-[260px] text-left">
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
                        style={{ left: '45%', top: '64%', transform: 'translate(-50%, -50%)' }}
                    >
                        <StudioNode />
                        <div className="absolute top-full left-0 mt-6 min-w-[260px] text-left">
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
                        style={{ left: '73%', top: '39%', transform: 'translate(-50%, -50%)' }}
                    >
                        <StudioNode />
                        <div className="absolute top-full left-0 mt-6 min-w-[280px] text-left">
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

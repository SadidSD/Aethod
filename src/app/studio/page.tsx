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
                    {/* SVG Serpentine Path — Enhanced with white border & shadows */}
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible"
                        viewBox="0 0 1166 420"
                        fill="none"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Filter for the white outer border — inner shadow at bottom */}
                            <filter id="whiteBorderFilter" x="-20%" y="-20%" width="140%" height="160%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                {/* Bottom drop shadow for the whole curve */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="0" dy="6"/>
                                <feGaussianBlur stdDeviation="5"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                                {/* White highlight on top */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="0" dy="-2"/>
                                <feGaussianBlur stdDeviation="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"/>
                                <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape"/>
                                {/* Inner shadow at bottom of white border */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="0" dy="4"/>
                                <feGaussianBlur stdDeviation="3"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0.6 0 0 0 0 0.59 0 0 0 0 0.58 0 0 0 0.35 0"/>
                                <feBlend mode="normal" in2="shape" result="effect3_innerShadow"/>
                                {/* Inner shadow at top for depth */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="0" dy="-2"/>
                                <feGaussianBlur stdDeviation="2"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"/>
                                <feBlend mode="normal" in2="effect3_innerShadow" result="effect4_innerShadow"/>
                            </filter>

                            {/* Filter for the blue inner path — neomorphic inner shadows */}
                            <filter id="bluePathFilter" x="-10%" y="-10%" width="120%" height="140%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                {/* Inner shadow at bottom of blue stroke */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="0" dy="3"/>
                                <feGaussianBlur stdDeviation="2.5"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0.4 0 0 0 0 0.45 0 0 0 0 0.7 0 0 0 0.4 0"/>
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                                {/* Subtle top highlight */}
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dx="0" dy="-2"/>
                                <feGaussianBlur stdDeviation="2"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0"/>
                                <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
                            </filter>
                        </defs>

                        {/* Layer 1: Thick white outer border with bottom inner shadow */}
                        <g filter="url(#whiteBorderFilter)">
                            <path
                                d="M10.502 301.037C10.502 301.037 278.19 379.737 387.502 346.037C465.301 322.052 519.222 255.036 594.502 224.037C717.17 173.524 741.006 227.347 853.502 157.037C933.502 107.037 953.502 83.0367 953.502 83.0367C953.502 83.0367 999.582 34.0816 1081.5 16.9464C1123.96 8.06441 1155.5 10.9464 1155.5 10.9464"
                                stroke="white"
                                strokeWidth="32"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </g>

                        {/* Layer 2: Blue inner path with bottom inner shadow */}
                        <g filter="url(#bluePathFilter)">
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

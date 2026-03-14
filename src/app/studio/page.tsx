import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { StudioNode } from '@/components/ui/StudioNode';

const nodes = [
    {
        id: "systems-architecture",
        title: "Systems Architecture",
        subtitle: "",
        description: "We design intelligent digital systems.\nNot apps, not websites — systems",
        x: "15%",
        y: "65%",
        textOffset: "translate-y-24 -translate-x-10"
    },
    {
        id: "ai-automation",
        title: "AI-Driven",
        subtitle: "Automation",
        description: "Operational intelligence\nDecision support\nProcess orchestration",
        x: "48%",
        y: "48%",
        textOffset: "translate-y-24 translate-x-10"
    },
    {
        id: "applied-research",
        title: "Applied",
        subtitle: "Research",
        description: "We study emerging systems\nThen we turn insights into tools\nEach with short, thoughtful descriptions.",
        x: "82%",
        y: "32%",
        textOffset: "-translate-y-32 translate-x-10"
    }
];

export default function StudioPage() {
    return (
        <main className="min-h-screen bg-neo-bg overflow-hidden text-neo-text">
            <Navbar />

            <section className="relative container mx-auto max-w-[1440px] pt-32 px-10 min-h-[900px]">
                {/* Heading Area */}
                <div className="absolute top-32 left-10 z-20 max-w-lg">
                    <h1 className="text-[64px] font-medium tracking-tight leading-[1.1]">
                        What We <span className="text-[#5A69EA] opacity-60">Actually</span> Do
                    </h1>
                    <p className="mt-8 text-[18px] font-light text-neo-text/60 leading-relaxed max-w-sm">
                        Operations are overloaded with platforms. Signals are buried under systems. <span className="text-[#5A69EA] font-normal">Aethod</span> converts complexity into coordinated action.
                    </p>
                </div>

                {/* Serpentine Path & Nodes Container */}
                <div className="relative w-full h-[600px] mt-40">
                    {/* SVG Serpentine Path */}
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible"
                        viewBox="0 0 1440 600"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Outer Path (Neomorphic Deep Stroke) */}
                        <path
                            d="M-100 450 C 150 450, 400 500, 720 380 S 1100 180, 1540 180"
                            stroke="#F2F1EF"
                            strokeWidth="35"
                            strokeLinecap="round"
                            className="shadow-neo-nav"
                        />

                        {/* Inner Path (Gradient Glow) */}
                        <path
                            d="M-100 450 C 150 450, 400 500, 720 380 S 1100 180, 1540 180"
                            stroke="url(#pathGradient)"
                            strokeWidth="15"
                            strokeLinecap="round"
                            className="opacity-40"
                        />

                        <defs>
                            <linearGradient id="pathGradient" x1="0" y1="450" x2="1440" y2="180" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#5A69EA" />
                                <stop offset="1" stopColor="#BF8BCA" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Interactive Nodes */}
                    {nodes.map((node) => (
                        <div
                            key={node.id}
                            className="absolute z-30"
                            style={{
                                left: node.x,
                                top: node.y,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <StudioNode />

                            {/* Text Labels */}
                            <div className={`absolute whitespace-pre-line min-w-[300px] ${node.textOffset}`}>
                                <h3 className="text-[28px] font-light leading-tight">
                                    {node.title}{" "}
                                    {node.subtitle && (
                                        <span className="text-[#5A69EA] opacity-60 font-normal">
                                            {node.subtitle}
                                        </span>
                                    )}
                                </h3>
                                <p className="mt-4 text-[16px] font-light text-neo-text/50 leading-relaxed max-w-[280px]">
                                    {node.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

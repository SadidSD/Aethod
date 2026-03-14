import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { JournalCard } from '@/components/ui/JournalCard';

const journals = [
    {
        title: "The Future of Autonomous Decision Systems",
        date: "March 2024",
        excerpt: "Exploring the intersection of LLMs and classical control theory for industrial automation. How agents are reshaping the factory floor.",
        image: "/journal_automation_1772645931887.png"
    },
    {
        title: "Scaling Intelligent Architectures in 2024",
        date: "February 2024",
        excerpt: "A deep dive into distributed decision engines and the move towards decentralized AI-first infrastructure for global enterprises.",
        image: "/journal_architecture_1772645948736.png"
    },
    {
        title: "Neural Networks and Quantum Topologies",
        date: "February 2024",
        excerpt: "New research into non-Euclidean data structures and their implications for the next generation of high-speed decision systems.",
        image: "/journal_research_1772645968285.png"
    },
    {
        title: "Heuristic Search in Uncertain Environments",
        date: "January 2024",
        excerpt: "How Aethod is applying applied research in pathfinding to complex business logistics and global supply chain optimization.",
        image: "/journal_automation_1772645931887.png" // Reusing for dummy purposes
    },
    {
        title: "Topological Data Analysis for Market Logic",
        date: "January 2024",
        excerpt: "Using shape-based data analysis to identify hidden patterns in high-frequency financial signals and alternative data streams.",
        image: "/journal_architecture_1772645948736.png" // Reusing for dummy purposes
    },
    {
        title: "Ethical Constraints in Automated Planning",
        date: "December 2023",
        excerpt: "Formalizing safety and fairness directly into the heuristic functions of autonomous planning agents for risk-sensitive deployments.",
        image: "/journal_research_1772645968285.png" // Reusing for dummy purposes
    }
];

export default function JournalsPage() {
    return (
        <div className="min-h-screen bg-neo-bg font-sora pb-24">
            <Navbar />

            <main className="container mx-auto max-w-[1352px] px-6 mt-32">
                {/* Header Section */}
                <div className="max-w-[800px] mb-20">
                    <h1 className="text-[56px] leading-[1.15] font-semibold text-neo-text tracking-tight font-roboto-serif mb-6">
                        Latest <span className="text-neo-gradient">Journals</span> & Research.
                    </h1>
                    <p className="text-[20px] font-light text-gray-500 leading-relaxed">
                        Documenting our progress in applied research, systems design, and the evolving landscape of intelligent automation.
                    </p>
                </div>

                {/* Journals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {journals.map((journal, index) => (
                        <JournalCard
                            key={index}
                            {...journal}
                            className="animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both"
                            style={{ animationDelay: `${index * 100}ms` }}
                        />
                    ))}
                </div>
            </main>

            {/* Decorative Bottom Well */}
            <div className="container mx-auto max-w-[1352px] px-6 mt-32">
                <div className="w-full h-[120px] bg-neo-bg shadow-neo-well rounded-[40px] border border-white/10 flex items-center justify-center">
                    <span className="text-gray-400 font-light italic">End of Journal Feed</span>
                </div>
            </div>

        </div>
    );
}

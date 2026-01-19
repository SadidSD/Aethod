import { Button } from "@/components/ui/Button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function TCGIndustryPage() {
    return (
        <div className="pb-20">
            {/* Overview Hero */}
            <section className="pt-20 pb-16 px-4 bg-gradient-to-b from-transparent to-[#dbe2ea]">
                <div className="container mx-auto max-w-5xl text-center">
                    <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6 neu-pressed">
                        SPECIALIZED INDUSTRY
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-8">
                        The Ultimate Web Architecture for <br />
                        <span className="text-accent">Trading Card Game</span> Shops
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Generic ecommerce platforms fail when you have 50,000 unique SKUs with different conditions,
                        sets, and languages. We build systems designed for TCG complexity.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Scheule a Demo</Button>
                    </Link>
                </div>
            </section>

            {/* The Problem */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Why Shopify isn't enough</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="neu-panel p-8">
                        <h3 className="text-xl font-bold mb-4 text-red-500">Inventory Chaos</h3>
                        <p className="text-gray-600">Managing Near Mint vs Damaged cards across thousands of sets creates massive data bloat on standard platforms.</p>
                    </div>
                    <div className="neu-panel p-8">
                        <h3 className="text-xl font-bold mb-4 text-red-500">Buy-lists are Hard</h3>
                        <p className="text-gray-600">Most platforms only sell. We build systems that let you buy cards from customers efficiently with automated grading workflows.</p>
                    </div>
                    <div className="neu-panel p-8">
                        <h3 className="text-xl font-bold mb-4 text-red-500">Slow Search</h3>
                        <p className="text-gray-600">Standard search bars choke on "Charizard Base Set 1st Edition Shadowless". We use elastic search tailored for TCG.</p>
                    </div>
                </div>
            </section>

            {/* The Solution */}
            <section className="container mx-auto px-4 py-10">
                <div className="neu-panel p-8 md:p-16">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-bold">The Aethod TCG Stack</h2>
                            <p className="text-lg text-gray-600">
                                We deploy a custom Headless architecture using Next.js and your preferred backend (Shopify, Crystal Commerce, etc.) or our custom database.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Instant Search (Algolia/Typesense)",
                                    "Live TCGPlayer Pricing Sync",
                                    "Bulk Inventory Upload Tools",
                                    "Automated Buylist Portal",
                                    "Customer Loyalty Rewards"
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs neu-pressed">
                                            <Check size={14} />
                                        </div>
                                        <span className="font-medium text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 w-full bg-white/50 rounded-2xl p-6 neu-input min-h-[400px] flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <p>Interactive Demo Placeholder</p>
                                <p className="text-xs">Inventory Grid View</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 pt-16 text-center">
                <h2 className="text-3xl font-bold mb-6">Upgrade your Shop</h2>
                <Link href="/contact">
                    <Button size="lg" className="h-16 px-10 text-lg">
                        Start Integration <ArrowRight className="ml-2" />
                    </Button>
                </Link>
            </section>
        </div>
    );
}

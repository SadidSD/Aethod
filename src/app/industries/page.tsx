import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function IndustriesPage() {
    const industries = [
        {
            name: "Trading Card Games",
            status: "Active",
            description: "We are the leading agency for TCG ecommerce, inventory management, and buylist systems.",
            link: "/industry/tcg"
        },
        {
            name: "Digital Commerce",
            status: "Coming Soon",
            description: "Advanced Shopify Headless implementations and Next.js commerce solutions.",
            link: "#"
        },
        {
            name: "SaaS Startups",
            status: "Coming Soon",
            description: "MVP development, payment integration, and scalable cloud architecture.",
            link: "#"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Industries</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    We focus deep on specific verticals to provide tailored, high-impact systems.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industries.map((ind, i) => (
                    <Card key={i} className="flex flex-col h-full hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold">{ind.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ind.status === 'Active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {ind.status}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-8 flex-1">
                            {ind.description}
                        </p>

                        <div className="mt-auto">
                            {ind.status === 'Active' ? (
                                <Link href={ind.link}>
                                    <Button className="w-full">Explore Solutions</Button>
                                </Link>
                            ) : (
                                <Button disabled className="w-full bg-gray-200 text-gray-400 shadow-none">
                                    Coming Soon
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

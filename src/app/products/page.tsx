import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, Box, Database, Sparkles } from "lucide-react";

export default function ProductsPage() {
    const products = [
        {
            name: "TCG Inventory SaaS",
            status: "Beta",
            description: "A comprehensive cloud platform for managing TCG singles, syncing prices, and handling buylists.",
            icon: <Box className="w-8 h-8" />
        },
        {
            name: "AI Automation Toolkit",
            status: "Alpha",
            description: "Drag-and-drop builder for creating business automation agents without code.",
            icon: <Sparkles className="w-8 h-8" />
        },
        {
            name: "Data Sync Core",
            status: "Planned",
            description: "Universal API middleware to sync inventory between Shopify, eBay, and TCGPlayer.",
            icon: <Database className="w-8 h-8" />
        }
    ];

    return (
        <div className="container mx-auto px-4 py-20 pb-40">
            <div className="text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Internal tools born from our agency work, now available for everyone.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((p, i) => (
                    <Card key={i} className="flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-10 scale-150 rotate-12 transition-all">
                            {p.icon}
                        </div>

                        <div className="mb-6">
                            <span className={`text-xs font-bold px-2 py-1 rounded border ${p.status === 'Beta' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                                    p.status === 'Alpha' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                                        'bg-gray-50 border-gray-200 text-gray-500'
                                }`}>
                                {p.status}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-4">{p.name}</h3>
                        <p className="text-gray-600 mb-8 flex-1">{p.description}</p>

                        <Button disabled={p.status === 'Planned'} variant="default" className="w-full">
                            {p.status === 'Planned' ? 'Join Waitlist' : 'View Product'}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Bot, Code, Globe, LayoutDashboard, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
    const services = [
        {
            title: "TCG Website Development",
            description: "Specialized ecommerce solutions for Card Shops.",
            icon: <ShoppingBag className="w-8 h-8" />,
            features: [
                "Custom Storefronts tailored for card singles",
                "Buylist integration & Trade-in systems",
                "Live Inventory Sync with TCGPlayer/eBay (API)",
                "SEO-ready structure for card variants"
            ]
        },
        {
            title: "Custom Web Development",
            description: "Business websites and complex web applications.",
            icon: <Globe className="w-8 h-8" />,
            features: [
                "High-performance landing pages",
                "React / Next.js Web Applications",
                "Internal Dashboards & Admin Tools",
                "Secure Database Architecture"
            ]
        },
        {
            title: "AI Agent Development",
            description: "Smart assistants that work 24/7 for your business.",
            icon: <Bot className="w-8 h-8" />,
            features: [
                "Customer Support Chatbots",
                "Lead Qualification Agents",
                "Automated Data Entry Agents",
                "Multi-agent workflows"
            ]
        },
        {
            title: "Business Automation",
            description: "Streamline operations and reduce manual data entry.",
            icon: <Zap className="w-8 h-8" />,
            features: [
                "n8n / Zapier / Make automation workflows",
                "Email Marketing Automation",
                "Order Processing Automation",
                "CRM Syncing"
            ]
        }
    ];

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    We combine advanced engineering with system-thinking to build digital products that last.
                </p>
            </div>

            <div className="space-y-12">
                {services.map((service, index) => (
                    <div key={index} className="neu-panel p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="h-16 w-16 min-w-[64px] rounded-2xl bg-gray-100 flex items-center justify-center neu-pressed text-accent">
                                {service.icon}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h2>
                                <p className="text-lg text-gray-600 mb-8">{service.description}</p>

                                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">Key Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {service.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-accent"></div>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full md:w-auto flex flex-col gap-4">
                                <Link href="/contact">
                                    <Button>Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <h2 className="text-2xl font-bold mb-6">Not sure what you need?</h2>
                <Link href="/contact">
                    <Button variant="ghost" className="neu-input bg-transparent border border-gray-200">
                        Book a Free Consultation
                    </Button>
                </Link>
            </div>
        </div>
    );
}

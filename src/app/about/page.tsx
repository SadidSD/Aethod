import { Button } from "@/components/ui/Button";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-8">System + Intelligence</h1>

                <div className="space-y-8 text-lg md:text-xl text-gray-600 leading-relaxed mb-16">
                    <p>
                        Aethod was founded on a simple premise: <strong>Websites are not enough.</strong>
                    </p>
                    <p>
                        In the modern era, businesses need digital systems that utilize intelligence.
                        Whether that is proper data architecture for a TCG shop with 100k products,
                        or an AI agent that handles your customer support tickets while you sleep.
                    </p>
                    <p>
                        We blend aesthetic excellence with rigorous system engineering. We don't just
                        make things look good—we make them work securely, efficiently, and at scale.
                    </p>
                </div>

                <div className="neu-panel p-8 md:p-12 mb-16">
                    <h2 className="text-2xl font-bold mb-6">Our Philosophy</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold mb-2">Long-Term Thinking</h3>
                            <p className="text-gray-600 text-sm">We code for the next 5 years, not just the next 5 months. Scalability is built-in.</p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Simplicity</h3>
                            <p className="text-gray-600 text-sm">Complex systems should feel simple to the user. We hide the complexity behind great UI.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="mb-6 font-medium">Ready to work with a team that thinks differently?</p>
                    <Button>Get in Touch</Button>
                </div>
            </div>
        </div>
    );
}

import { Button } from "@/components/ui/Button";
import { Mail, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Start a Project</h1>
                    <p className="text-xl text-gray-600">
                        Tell us about your system. We'll tell you how we can build it.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="neu-panel p-8">
                            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="text-accent" />
                                    <span>hello@aethod.agency</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="text-accent" />
                                    <span>San Francisco, CA (Remote Global)</span>
                                </div>
                            </div>
                        </div>

                        <div className="neu-panel p-8">
                            <h3 className="text-xl font-bold mb-4">Project Types</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• TCG Ecommerce Migrations</li>
                                <li>• Custom Next.js Web Apps</li>
                                <li>• AI Agent Integration</li>
                                <li>• Business Automation Consulting</li>
                            </ul>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="neu-panel p-8">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Name</label>
                                <input
                                    type="text"
                                    className="w-full h-12 px-4 rounded-xl neu-input text-gray-700 placeholder-gray-400"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full h-12 px-4 rounded-xl neu-input text-gray-700 placeholder-gray-400"
                                    placeholder="john@company.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Project Details</label>
                                <textarea
                                    className="w-full p-4 rounded-xl neu-input text-gray-700 placeholder-gray-400 min-h-[150px] resize-y"
                                    placeholder="Tell us about what you want to build..."
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full">
                                Send Request
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

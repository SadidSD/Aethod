import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full py-12 bg-[#E0E5EC] border-t border-white/20 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Aethod</h3>
                        <p className="text-sm text-gray-500">
                            Designing Intelligent Web Systems for Modern Commerce.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Careers</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Services</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/services">TCG Development</Link></li>
                            <li><Link href="/services">AI Agents</Link></li>
                            <li><Link href="/services">Web Systems</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Twitter / X</li>
                            <li>LinkedIn</li>
                            <li>GitHub</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Aethod Agency. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

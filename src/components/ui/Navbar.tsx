"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/studio", label: "Studio" },
    { href: "/system", label: "System" },
    { href: "/research", label: "Research" },
    { href: "/products", label: "Products" },
    { href: "/journals", label: "Journals" },
]

export function Navbar() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full bg-transparent pt-8 px-6">
            <div className="container mx-auto max-w-[1352px] h-[100px] bg-neo-bg shadow-neo-nav rounded-neo flex items-center px-10 border border-white/20">

                {/* Logo - Convex Neomorph */}
                <Link href="/" className="flex-shrink-0">
                    <div className="h-[66px] w-[66px] rounded-full bg-neo-bg shadow-neo-convex flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:shadow-neo-concave">
                        <span className="text-2xl font-black text-neo-text">A.</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="flex items-center mx-auto gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-[20px] font-light transition-all duration-300",
                                pathname === link.href
                                    ? "text-neo-text font-normal"
                                    : "text-gray-500 hover:text-neo-text"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-10">
                    {/* Ask Smith Concave Search Bar */}
                    <div className="hidden xl:flex items-center gap-3 h-[58px] min-w-[475px] bg-neo-bg shadow-neo-concave rounded-[20px] px-6 border border-white/10 group">
                        <Search size={18} className="text-[#3B71A0]" />
                        <span className="text-[16px] font-light text-neo-gradient opacity-80 group-hover:opacity-100 transition-opacity">
                            Ask Smith about your query
                        </span>
                    </div>

                    {/* Phone Icon - Convex */}
                    <Link href="/contact" className="flex-shrink-0">
                        <div className="h-[66px] w-[66px] rounded-full bg-neo-bg shadow-neo-convex flex items-center justify-center border border-white/20 hover:scale-105 active:shadow-neo-concave transition-all">
                            <Phone size={24} className="text-neo-text" />
                        </div>
                    </Link>
                </div>

            </div>
        </header>
    )
}

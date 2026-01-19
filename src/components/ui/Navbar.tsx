"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, Building2, Package, User, Mail, Menu, X, Linkedin, Twitter, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/services", label: "Services", icon: Briefcase },
    { href: "/industries", label: "Industries", icon: Building2 },
    { href: "/products", label: "Products", icon: Package },
    { href: "/about", label: "About", icon: User },
    { href: "/contact", label: "Contact", icon: Mail },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full bg-[var(--background)]/90 backdrop-blur-sm transition-all duration-300">
            <div className="container mx-auto px-6 h-24 flex items-center justify-between">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 group"
                >
                    {/* Logo Icon */}
                    <span className="font-black text-3xl tracking-tighter text-foreground">
                        A<span className="text-gray-400 text-sm font-normal tracking-normal ml-1">.ethod</span>
                    </span>
                </Link>

                {/* Desktop Nav - "Floating Circles" */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-4">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;

                            return (
                                <div key={link.href} className="relative group flex flex-col items-center">
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                                            // Active State: Blue filled circle
                                            // Inactive State: "Down curved inside" (Pressed/Inset Shadow default)
                                            isActive
                                                ? "bg-accent text-white shadow-[0px_4px_10px_rgba(59,130,246,0.5)] scale-110"
                                                : "text-gray-500 bg-[var(--background)] shadow-[var(--shadow-neu-pressed)] hover:text-accent hover:shadow-[var(--shadow-neu-flat)] hover:-translate-y-[1px] active:shadow-[var(--shadow-neu-pressed)]"
                                        )}
                                    >
                                        <Icon size={20} strokeWidth={2} />
                                    </Link>

                                    {/* Tooltip Label - Appears below on hover */}
                                    <span className="absolute top-14 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-xs font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap pointer-events-none">
                                        {link.label}
                                    </span>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Separator */}
                    <div className="h-8 w-[1px] bg-gray-300"></div>

                    {/* Social Icons (Placeholder) */}
                    <div className="flex items-center gap-3">
                        {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                            <button
                                key={i}
                                className="h-9 w-9 rounded-full flex items-center justify-center text-gray-500 bg-[var(--background)] shadow-[var(--shadow-neu-flat)] hover:text-accent hover:shadow-[var(--shadow-neu-pressed)] transition-all active:scale-95"
                            >
                                <Icon size={16} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-3 rounded-full text-foreground transition-all shadow-[var(--shadow-neu-flat)] active:shadow-[var(--shadow-neu-pressed)]"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-24 left-0 w-full p-4 bg-[var(--background)]/90 backdrop-blur-md border-b border-gray-200 z-50">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium shadow-[var(--shadow-neu-flat)] active:shadow-[var(--shadow-neu-pressed)]",
                                    pathname === link.href ? "text-accent" : "text-gray-600"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <link.icon size={20} />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {/* Shadow Separation Line */}
            <div className="w-full relative z-20">
                {/* White line with inner shadow from top */}
                <div className="h-[2px] w-full bg-white relative z-10"></div>
            </div>
        </header>
    )
}

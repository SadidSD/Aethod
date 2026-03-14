import React from 'react';
import { cn } from "@/lib/utils";

interface ServiceCardProps {
    title: string;
    description: string;
    className?: string;
}

export const ServiceCard = ({ title, description, className }: ServiceCardProps) => {
    return (
        <div className={cn(
            "relative group overflow-hidden rounded-[30px] bg-neo-bg p-10 transition-all duration-500",
            "shadow-neo-convex hover:shadow-neo-card",
            "border border-white/20 hover:border-white/40",
            className
        )}>
            {/* Subtle Gradient Glow on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-[#5A69EA] to-[#BF8BCA]" />

            <div className="relative z-10 flex flex-col gap-4">
                <h3 className="text-[24px] font-medium text-neo-gradient tracking-tight">
                    {title}
                </h3>
                <p className="text-[16px] font-light text-neo-text/70 leading-relaxed">
                    {description}
                </p>

                {/* Decorative Accent (Vertical bar from Figma 114:196) */}
                <div className="mt-4 h-[50px] w-[10px] rounded-full bg-gradient-to-b from-[#5A69EA] to-[#BF8BCA] opacity-20 group-hover:opacity-100 transition-opacity duration-500 shadow-sm" />
            </div>
        </div>
    );
};

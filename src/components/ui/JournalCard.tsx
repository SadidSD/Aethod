import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalCardProps {
    title: string;
    date: string;
    excerpt: string;
    image: string;
    className?: string;
}

export const JournalCard = ({ title, date, excerpt, image, className }: JournalCardProps) => {
    return (
        <div className={cn(
            "group relative flex flex-col bg-neo-bg rounded-[32px] p-6 shadow-neo-card border border-white/20 transition-all duration-500 hover:scale-[1.02]",
            className
        )}>
            {/* Image Container */}
            <div className="relative h-[240px] w-full rounded-[24px] overflow-hidden bg-gray-100 shadow-neo-concave mb-6">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-medium text-[#3B71A0] tracking-wider uppercase">{date}</span>
                <div className="h-[40px] w-[40px] rounded-full bg-neo-bg shadow-neo-convex flex items-center justify-center border border-white/20 group-hover:shadow-neo-concave transition-all duration-300">
                    <ArrowUpRight size={18} className="text-neo-text group-hover:text-neo-gradient transition-colors" />
                </div>
            </div>

            {/* Content */}
            <h3 className="text-[24px] font-semibold text-neo-text leading-tight mb-3 group-hover:text-neo-gradient transition-colors">
                {title}
            </h3>
            <p className="text-[16px] font-light text-gray-500 leading-relaxed line-clamp-3">
                {excerpt}
            </p>

            {/* Bottom Glow Effect */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-neo-purple/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};

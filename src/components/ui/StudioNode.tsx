import React from 'react';
import { cn } from "@/lib/utils";

interface StudioNodeProps {
    className?: string;
    style?: React.CSSProperties;
}

export const StudioNode = ({ className, style }: StudioNodeProps) => {
    return (
        <div
            className={cn(
                "h-[75px] w-[75px] rounded-[30px] bg-neo-bg shadow-neo-nav flex items-center justify-center border border-white/20 transition-all duration-300 hover:scale-110",
                className
            )}
            style={style}
        >
            {/* Inner "dent" for detail */}
            <div className="h-[45px] w-[45px] rounded-full shadow-neo-concave opacity-20" />
        </div>
    );
};

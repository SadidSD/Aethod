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
                "h-[75px] w-[75px] rounded-[30px] flex items-center justify-center transition-all duration-300 hover:scale-[1.05]",
                className
            )}
            style={{
                background: '#F2F1EF',
                boxShadow: '-3px 3px 6px rgba(182, 181, 179, 0.2), 3px -3px 6px rgba(182, 181, 179, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.9), 3px 3px 8px rgba(182, 181, 179, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.3), inset -1px -1px 2px rgba(182, 181, 179, 0.5)',
                ...style
            }}
        >
            {/* Inner "dent" for detail */}
            <div className="h-[45px] w-[45px] rounded-full shadow-neo-concave opacity-20" />
        </div>
    );
};

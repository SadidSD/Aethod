import { ArrowUpRight } from 'lucide-react';

export const GradientArrow = ({ size = 22, className = "" }: { size?: number, className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <ArrowUpRight
                size={size}
                stroke="url(#arrow-gradient-inner)"
                className="stroke-[2.5]"
            >
                <defs>
                    <linearGradient id="arrow-gradient-inner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5A69EA" />
                        <stop offset="100%" stopColor="#BF8BCA" />
                    </linearGradient>
                </defs>
            </ArrowUpRight>
        </div>
    );
};

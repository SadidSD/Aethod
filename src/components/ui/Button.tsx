import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "link"
    size?: "default" | "sm" | "lg"
    icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", icon, children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    // Variants
                    variant === "default" && "neu-btn text-foreground px-6 py-3 hover:text-accent-dark",
                    variant === "ghost" && "hover:bg-black/5 dark:hover:bg-white/5 rounded-full",
                    variant === "link" && "text-accent underline-offset-4 hover:underline decoration-accent",

                    // Sizes
                    size === "default" && "h-12 text-base",
                    size === "sm" && "h-9 px-4 text-sm",
                    size === "lg" && "h-14 px-8 text-lg",
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
                {icon && <span className="ml-2">{icon}</span>}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }

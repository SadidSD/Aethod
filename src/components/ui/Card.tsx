import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "neu-panel p-6 mb-4 text-foreground",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

export { Card }

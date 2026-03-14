"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface HomeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "purple" | "blue"
  text: string
  className?: string
}

export const HomeButton = ({ variant = "purple", text, className, ...props }: HomeButtonProps) => {
  const isPurple = variant === "purple"
  const bgColor = isPurple ? "bg-[#BF8BCA]" : "bg-[#B2CEFE]"
  const accentColor = isPurple ? "text-[#BF8BCA]" : "text-[#B2CEFE]"

  return (
    <button
      className={cn(
        "group relative h-[66px] w-[210px] flex items-center justify-center transition-all duration-300 outline-none",
        className
      )}
      {...props}
    >
      {/* Background Layer with neomorphic shadows */}
      <div
        className={cn(
          "absolute inset-0 rounded-[18px] transition-all duration-300",
          bgColor,
          "shadow-[-1px_-1px_5px_rgba(0,0,0,0.25),inset_4px_3px_5px_rgba(0,0,0,0.20),inset_-3px_-2px_5px_rgba(255,255,255,0.70)]"
        )}
      ></div>

      {/* White Inner Box Layer - Moves on click */}
      <div className="absolute inset-[5px] bg-[#F2F1EF] rounded-[15px] flex items-center px-6 border border-white/40 transition-transform duration-150 active:scale-[0.96]">
        <div className="flex items-center justify-between w-full">
          <span className="text-[20px] font-medium text-[#404040]">{text}</span>
          {/* Arrow Icon with dynamic accent color */}
          <div className={cn("transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1", accentColor)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  )
}

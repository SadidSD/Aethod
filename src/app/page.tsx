"use client"

import * as React from "react"
import { Navbar } from "@/components/ui/Navbar"
import { HomeButton } from "@/components/ui/HomeButton"
import Image from "next/image"

export default function Home() {
  const [isToggled, setIsToggled] = React.useState(true)

  return (
    <div className="min-h-screen bg-neo-bg font-sora">
      <Navbar />

      {/* Top Right Toggle Section... */}
      <div className="absolute top-36 right-12 flex items-center gap-4">
        <button
          onClick={() => setIsToggled(!isToggled)}
          className="h-[30px] w-[60px] bg-neo-bg shadow-neo-concave rounded-full p-1 relative transition-all"
        >
          <div className={`h-[22px] w-[22px] rounded-full bg-white shadow-md transition-all duration-300 transform ${isToggled ? 'translate-x-[30px] bg-[#3B82F6]' : 'translate-x-0 bg-gray-400'}`}></div>
          {isToggled && <div className="absolute inset-x-1.5 inset-y-1.5 bg-[#3B82F6]/20 rounded-full pointer-events-none"></div>}
        </button>
      </div>

      <main className="container mx-auto max-w-[1352px] px-6 mt-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Left Column... */}
          <section className="flex-1 text-left max-w-[650px]">
            <h1 className="text-[56px] leading-[1.15] font-semibold text-neo-text tracking-tight font-roboto-serif">
              We design <span className="text-neo-gradient">intelligent systems</span> for complex environments.
            </h1>

            <p className="mt-10 text-[20px] font-light text-gray-500 max-w-[500px] leading-relaxed">
              AI-first architectures, automation, and decision systems for businesses operating in uncertainty.
            </p>
            <div className="mt-16 flex items-center gap-10">
              <HomeButton variant="purple" text="Explore" />
              <HomeButton variant="blue" text="Thinking" />
            </div>
          </section>

          {/* Right Column - 3D Orb visual with Shadow */}
          <div className="flex-1 relative w-full h-[600px] flex flex-col items-center justify-center overflow-visible">
            {/* Main Floating Orb - Larger and higher */}
            <div className="relative w-[550px] h-[550px] animate-float z-10 -mt-20">
              <Image
                src="/homeMotion.gif"
                alt="Aethod Systems Motion"
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(90,105,234,0.15)]"
                priority
                unoptimized
              />
            </div>
            
            {/* Dynamic Shadow Below - Refined width */}
            <div className="w-[260px] h-[40px] bg-black/60 rounded-[100%] blur-xl animate-shadow-pulse mt-4 relative z-0"></div>
          </div>

        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shadow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(0.85); opacity: 0.4; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .animate-shadow-pulse {
          animation: shadow-pulse 6s ease-in-out infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  )
}

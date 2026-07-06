"use client";

import { useEffect } from "react";

export default function ResponsiveScaler() {
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      
      const scale1440 = w / 1440;
      const scale430 = w / 430;
      
      document.documentElement.style.setProperty('--scale-1440', scale1440.toString());
      document.documentElement.style.setProperty('--scale-430', scale430.toString());
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return null;
}

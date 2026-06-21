"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync theme on initial mount
    const saved = localStorage.getItem("theme");
    const initialIsDark = saved ? saved === "dark" : false; // Default to light, or read saved theme
    
    setIsDark(initialIsDark);
    document.documentElement.setAttribute("data-theme", initialIsDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const setTheme = (theme) => {
    const shouldBeDark = theme === "dark";
    setIsDark(shouldBeDark);
    document.documentElement.setAttribute("data-theme", shouldBeDark ? "dark" : "light");
    localStorage.setItem("theme", shouldBeDark ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

"use client";

import React from "react";

export default function LargeLogo({ className }) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* New Aeethod "A" mark logo */}
      <img
        src="/logo-icon.png"
        alt="Aeethod Logo"
        style={{
          width: "70%",
          height: "70%",
          objectFit: "contain",
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
        }}
      />
    </div>
  );
}

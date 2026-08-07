"use client";

import React, { useEffect, useState } from "react";

export default function GlobalCursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      style={{
        position: "fixed",
        top: -60, // Offset by half the width/height to center the glow on the cursor
        left: -60,
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 0, 
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease, transform 0.1s ease-out",
        transform: `translate(${position.x}px, ${position.y}px)`,
        // Exactly half blue, half orange with reduced opacity
        background: "linear-gradient(90deg, rgba(38, 132, 185, 0.15) 0%, rgba(253, 126, 20, 0.15) 100%)",
        filter: "blur(30px)", // Adjusted blur for smaller size
      }}
    />
  );
}

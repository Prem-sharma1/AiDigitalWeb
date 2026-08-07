"use client";

import React, { useRef, useState } from "react";

export default function TiltCard({ children, className = "", style = {} }) {
  const cardRef = useRef(null);
  const [glowStyle, setGlowStyle] = useState({ opacity: 0, x: 0, y: 0 });
  const [transformStyle, setTransformStyle] = useState("");

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate cursor position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation for 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Subtle tilt intensity
    const rotateX = ((y - centerY) / centerY) * -4; // Max 4deg
    const rotateY = ((x - centerX) / centerX) * 4;  // Max 4deg

    setGlowStyle({ opacity: 1, x, y });
    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setGlowStyle({ opacity: 0, x: 0, y: 0 });
    setTransformStyle(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: transformStyle,
      }}
    >
      <div 
        className="tilt-card-glow"
        style={{
          opacity: glowStyle.opacity,
          background: `radial-gradient(circle at ${glowStyle.x}px ${glowStyle.y}px, rgba(199, 110, 35, 0.15), transparent 40%)`
        }}
      />
      <div className="tilt-card-content">
        {children}
      </div>
    </div>
  );
}

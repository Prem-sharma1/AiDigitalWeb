"use client"; // Required for DOM refs and lifecycle hooks
import React, { useRef, useEffect } from "react";
import PricingPopup from "./PricingPopup";
import { Icon } from "./SiteChrome";

export default function HeroOrbit() {
    const dialogRef = useRef(null);

    // Triggers the pricing popup natively when the page renders
    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <div className="hero-orbit orbit-container" aria-hidden="true">
            {/* Handled natively with no buttons or local react visibility state hooks */}
            <PricingPopup dialogRef={dialogRef} />

            {/* Central Nucleus */}
            <div className="orbit-nucleus">
                <div className="nucleus-pulse-ring-1" />
                <div className="nucleus-pulse-ring-2" />
                <div className="orbit-nucleus-inner">
                    <Icon name="hub" />
                    <strong>Digital<br />Marketing</strong>
                </div>
            </div>

            {/* Background Visual Concentric Rings */}
            <div className="orbit orbit-ring orbit-xl" />
            <div className="orbit orbit-ring orbit-lg" />
            <div className="orbit orbit-ring orbit-md" />
            <div className="orbit orbit-ring orbit-sm" />

            {/* SMO on XL Orbit Ring */}
            <span className="orbit-dot-wrapper orbit-dot-xl rotate-extra-slow">
                <span className="orbit-dot orbit-dot-yellow counter-rotate-extra-slow">SMO</span>
            </span>

            {/* SEO on LG Orbit Ring */}
            <span className="orbit-dot-wrapper orbit-dot-lg rotate-slow">
                <span className="orbit-dot orbit-dot-orange counter-rotate-slow">SEO</span>
            </span>

            {/* Google Ads on MD Orbit Ring */}
            <span className="orbit-dot-wrapper orbit-dot-md rotate-medium">
                <span className="orbit-dot orbit-dot-blue counter-rotate-medium">Google ads</span>
            </span>

            {/* Website on SM Orbit Ring */}
            <span className="orbit-dot-wrapper orbit-dot-sm rotate-fast">
                <span className="orbit-dot orbit-dot-light counter-rotate-fast">Website</span>
            </span>
        </div>
    );
}
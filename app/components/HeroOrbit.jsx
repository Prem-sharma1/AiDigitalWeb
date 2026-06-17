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
            <div className="orbit orbit-ring orbit-lg" />
            <div className="orbit orbit-ring orbit-md" />
            <div className="orbit orbit-ring orbit-sm" />

            <span className="orbit-dot-wrapper orbit-dot-lg rotate-slow">
                <i className="orbit-dot orbit-dot-blue" />
            </span>
            <span className="orbit-dot-wrapper orbit-dot-md rotate-medium">
                <i className="orbit-dot orbit-dot-orange" />
            </span>
            <span className="orbit-dot-wrapper orbit-dot-sm rotate-fast">
                <i className="orbit-dot orbit-dot-light" />
            </span>

            {/* Metric Cards (positioned around the nucleus) */}
            <div className="metric-card metric-top">
                <div>
                    <Icon name="monitoring" />
                    <span>SEO Traffic</span>
                </div>
                <strong>+142%</strong>
                <small>Past 30 days</small>
            </div>

            <div className="metric-card metric-compact metric-left">
                <div>
                    <Icon name="trending_up" />
                    <span>Conversion Rate</span>
                </div>
                <strong>+64%</strong>
                <small>Landing Pages</small>
            </div>



            <div className="metric-card metric-compact metric-right metric-orange">
                <div>
                    <Icon name="verified" />
                    <span>Lead Quality</span>
                </div>
                <strong>+78%</strong>
                <small>Sales Ready</small>
            </div>

            <div className="metric-card metric-bottom">
                <div>
                    <Icon name="ads_click" />
                    <span>Ad ROAS</span>
                </div>
                <strong>3.8x</strong>
                <small>Avg Return</small>
            </div>
        </div>
    );
}
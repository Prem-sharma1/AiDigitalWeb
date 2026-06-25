"use client"; // Required for native browser event click listeners

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from "../hooks/useCart";
import { useRouter } from "next/navigation";

export default function PricingPopup({ dialogRef }) {
    const [popupPlans, setPopupPlans] = useState({
        Basic: { price: 2499, period: "/mo", features: ["Meta Ads", "Creative - 3", "AI Video - 1", "Reels/Shorts - 1", "Weekly Report"] },
        Standard: { price: 3999, period: "/mo", features: ["Meta Ads", "Creative - 5", "AI Video - 2", "Reels/Shorts - 3", "Weekly Report"] },
        Premium: { price: 4999, period: "/mo", features: ["Google Ads", "Creative - 5", "AI Video - 1", "Reels/Shorts - 3", "Weekly Report"] }
    });

    useEffect(() => {
        fetch("/api/admin/pricing?t=" + Date.now(), { cache: "no-store" })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Offline");
            })
            .then(data => {
                if (data.adsPlans) {
                    const basic = data.adsPlans.find(p => p.level === "Basic") || popupPlans.Basic;
                    const standard = data.adsPlans.find(p => p.level === "Standard") || popupPlans.Standard;
                    const premium = data.adsPlans.find(p => p.level === "Premium" || p.level === "Premium Plan") || popupPlans.Premium;

                    setPopupPlans({
                        Basic: {
                            price: basic.price,
                            period: basic.period || "/mo",
                            features: basic.features
                        },
                        Standard: {
                            price: standard.price,
                            period: standard.period || "/mo",
                            features: standard.features
                        },
                        Premium: {
                            price: premium.price,
                            period: premium.period || "/mo",
                            features: premium.features
                        }
                    });
                }
            })
            .catch(err => console.warn("Using default static popup plans:", err));
    }, []);

    const handleClose = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    const { addToCart, clearCart } = useCart();
    const router = useRouter();

    const handleBuyNow = (planName, price, features = []) => {
        clearCart();
        addToCart({
            name: planName,
            price: price,
            features: features
        });
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        router.push("/checkout");
    };

    return (
        <dialog
            ref={dialogRef}
            className="popup-card-dialog"
            onClick={(e) => {
                if (e.target === dialogRef.current) handleClose();
            }}
        >
            <div className="popup-card-internal" onClick={(e) => e.stopPropagation()}>

                {/* Close button cross icon */}
                <button onClick={handleClose} className="popup-close-btn" aria-label="Close popup">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="popup-header-container">
                    <div className="popup-logo-wrapper">
                        <Image
                            src="/logo-cropped.png"
                            alt="AI Digital Logo"
                            width={48}
                            height={48}
                            className="popup-header-logo"
                            priority
                        />
                    </div>
                    <div className="popup-header">
                        <h2 className="popup-title">
                            Elevate Your Digital Presence with <span>aidigitals</span>
                        </h2>
                        <p className="popup-subtitle">Join 500+ teams automating their growth today.</p>
                    </div>
                </div>

                <div className="pricing-grid">
                    {/* Basic Plan */}
                    <div className="plan-card">
                            <div className="plan-header-row">
                                <span className="plan-name">Basic</span>
                            </div>
                            <div className="plan-price-area">
                                <span className="price-amount">₹{popupPlans.Basic.price}</span>
                                <span className="price-period">{popupPlans.Basic.period}</span>
                            </div>
                            <ul className="plan-features">
                                {popupPlans.Basic.features.map((feat, i) => (
                                    <li className="feature-item" key={i}>
                                        <div className="feature-icon-wrapper icon-check">
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleBuyNow("Basic", popupPlans.Basic.price, popupPlans.Basic.features)}
                                className="btn-card-outline"
                                style={{ display: "block", width: "100%", textAlign: "center", marginTop: "auto" }}
                            >
                                Buy Now
                            </button>
                    </div>

                    {/* Standard Plan */}
                    <div className="plan-card popular">
                            <div className="plan-header-row">
                                <span className="plan-name">Standard</span>
                                <span className="popular-badge">Popular</span>
                            </div>
                            <div className="plan-price-area">
                                <span className="price-amount">₹{popupPlans.Standard.price}</span>
                                <span className="price-period">{popupPlans.Standard.period}</span>
                            </div>
                            <ul className="plan-features">
                                {popupPlans.Standard.features.map((feat, i) => (
                                    <li className="feature-item" key={i}>
                                        <div className={`feature-icon-wrapper ${i === 0 ? "icon-star" : "icon-check"}`}>
                                            {i === 0 ? (
                                                <svg fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ) : (
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleBuyNow("Standard", popupPlans.Standard.price, popupPlans.Standard.features)}
                                className="btn-card-solid"
                                style={{ display: "block", width: "100%", textAlign: "center", marginTop: "auto" }}
                            >
                                Buy Now
                            </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="plan-card">
                            <div className="plan-header-row">
                                <span className="plan-name">Premium</span>
                            </div>
                            <div className="plan-price-area">
                                <span className="price-amount">₹{popupPlans.Premium.price}</span>
                                <span className="price-period">{popupPlans.Premium.period}</span>
                            </div>
                            <ul className="plan-features">
                                {popupPlans.Premium.features.map((feat, i) => (
                                    <li className="feature-item" key={i}>
                                        <div className="feature-icon-wrapper icon-check">
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleBuyNow("Premium", popupPlans.Premium.price, popupPlans.Premium.features)}
                                className="btn-card-outline"
                                style={{ display: "block", width: "100%", textAlign: "center", marginTop: "auto" }}
                            >
                                Buy Now
                            </button>
                    </div>

                </div>

            </div>
        </dialog>
    );
}
"use client"; // Required for native browser event click listeners

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

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

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBuyNow = async (planName, price) => {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            alert("Failed to load Razorpay SDK. Please check your internet connection.");
            return;
        }

        try {
            const response = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: price, planName }),
            });
            const data = await response.json();

            if (!data.success) {
                alert("Unable to initiate order. Please try again.");
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_7fK8bF9H1k6Y3a",
                amount: data.amount,
                currency: "INR",
                name: "AI Digital",
                description: `${planName} Plan Purchase`,
                image: "/logo-cropped.png",
                order_id: data.orderId,
                handler: async function (paymentResponse) {
                    try {
                        const verifyResponse = await fetch("/api/razorpay/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                            }),
                        });
                        const verifyData = await verifyResponse.json();
                        if (verifyData.success) {
                            alert(`Payment Successful!\nPayment ID: ${paymentResponse.razorpay_payment_id}`);
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (err) {
                        console.error("Verification call error:", err);
                        alert("Verification connection error.");
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#e56030"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Order creation call failed:", error);
            alert("Failed to initiate payment. Please try again.");
        }
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
                                onClick={() => handleBuyNow("Basic", popupPlans.Basic.price)}
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
                                onClick={() => handleBuyNow("Standard", popupPlans.Standard.price)}
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
                                onClick={() => handleBuyNow("Premium", popupPlans.Premium.price)}
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
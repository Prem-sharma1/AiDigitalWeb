"use client"; // Required for native browser event click listeners

import React from 'react';

export default function PricingPopup({ dialogRef }) {
    const handleClose = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
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

                <div className="popup-header">

                    <h2 className="popup-title">
                        Elevate Your Digital Presence with <span>aidigitals</span>
                    </h2>
                    <p className="popup-subtitle">Join 500+ teams automating their growth today.</p>
                </div>

                <div className="pricing-grid">
                    {/* Basic Plan */}
                    <div className="plan-card">
                        <div>
                            <div className="plan-header-row">
                                <span className="plan-name">Basic</span>
                            </div>
                            <div className="plan-price-area">
                                <span className="price-amount">₹2499</span>
                                <span className="price-period">/mo</span>
                            </div>
                            <ul className="plan-features">
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Meta Ads
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Creative - 3
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    AI Video - 1
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Reels/Shorts - 1
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Weekly Report
                                </li>
                            </ul>
                        </div>
                        <a href="/pricing?service=Performance%20Marketing&plan=Meta%20Ads%20-%20Basic%20(%E2%82%B92499/mo)" className="btn-card-outline" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Select Plan</a>
                    </div>

                    {/* Standard Plan */}
                    <div className="plan-card popular">
                        <div>
                            <div className="plan-header-row">
                                <span className="plan-name">Standard</span>
                                <span className="popular-badge">Popular</span>
                            </div>
                            <div className="plan-price-area">
                                <span className="price-amount">₹3999</span>
                                <span className="price-period">/mo</span>
                            </div>
                            <ul className="plan-features">
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-star">
                                        <svg fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    </div>
                                    Meta Ads
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Creative - 5
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    AI Video - 2
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Reels/Shorts - 3
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Weekly Report
                                </li>
                            </ul>
                        </div>
                        <a href="/pricing?service=Performance%20Marketing&plan=Meta%20Ads%20-%20Standard%20(%E2%82%B93999/mo)" className="btn-card-solid" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Select Plan</a>
                    </div>

                    {/* Premium Plan */}
                    <div className="plan-card">
                        <div>
                            <div className="plan-header-row">
                                <span className="plan-name">Premium</span>
                            </div>
                            <div className="plan-price-area">
                                <span className="price-amount">₹4999</span>
                                <span className="price-period">/mo</span>
                            </div>
                            <ul className="plan-features">
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Google Ads
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Creative - 5
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    AI Video - 1
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Reels/Shorts - 3
                                </li>
                                <li className="feature-item">
                                    <div className="feature-icon-wrapper icon-check">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Weekly Report
                                </li>
                            </ul>
                        </div>
                        <a href="/pricing?service=Performance%20Marketing&plan=Google%20Ads%20-%20Premium%20(%E2%82%B94999/mo)" className="btn-card-outline" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Select Plan</a>
                    </div>
                </div>

            </div>
        </dialog>
    );
}
"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { Icon, SiteFooter, SiteHeader } from "../components/SiteChrome";

// Define valid referral codes and their discount percentages
const REFERRAL_CODES = {
  WELCOME10: { discount: 10, label: "Welcome Promo - 10% Off" },
  GROW20: { discount: 20, label: "Growth Accelerate - 20% Off" },
  PREM15: { discount: 15, label: "Prem Sharma Partner - 15% Off" },
  SHARMA15: { discount: 15, label: "Sharma Marketing - 15% Off" },
};

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Onboarding details
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");

  // Referral System States
  const [referralInput, setReferralInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [referralSuccessMsg, setReferralSuccessMsg] = useState("");
  const [referralErrorMsg, setReferralErrorMsg] = useState("");

  // Recovery Modal States
  const [showExitSurvey, setShowExitSurvey] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [submittingReminder, setSubmittingReminder] = useState(false);
  const [reminderSuccess, setReminderSuccess] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Referral Code Application Logic
  const handleApplyReferral = () => {
    setReferralErrorMsg("");
    setReferralSuccessMsg("");

    const formattedCode = referralInput.trim().toUpperCase();

    if (!formattedCode) {
      setReferralErrorMsg("Please enter a code.");
      return;
    }

    if (REFERRAL_CODES[formattedCode]) {
      const codeDetails = REFERRAL_CODES[formattedCode];
      setAppliedCode(formattedCode);
      setDiscountPercent(codeDetails.discount);
      setReferralSuccessMsg(`Code "${formattedCode}" applied successfully! (${codeDetails.label})`);
      setReferralInput("");
    } else {
      setReferralErrorMsg("Invalid referral or promo code. Please check and try again.");
    }
  };

  const handleRemoveReferral = () => {
    setAppliedCode("");
    setDiscountPercent(0);
    setReferralSuccessMsg("");
    setReferralErrorMsg("");
  };

  // Get the single item (plan) to check out
  const selectedItem = items && items.length > 0 ? items[0] : null;

  // Clean price value
  const itemPrice = selectedItem
    ? typeof selectedItem.price === "string"
      ? parseInt(selectedItem.price.replace(/,/g, ""), 10)
      : selectedItem.price
    : 0;

  // Calculated Rates
  const discountAmount = Math.round((itemPrice * discountPercent) / 100);
  const finalTotal = Math.max(0, itemPrice - discountAmount);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (!customerName || !customerEmail || !customerPhone) {
      alert("Please fill in your name, email, and phone number to proceed.");
      return;
    }

    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          planName: selectedItem.name,
          referralCode: appliedCode || "None"
        }),
      });
      const data = await response.json();

      if (!data.success) {
        alert("Unable to initiate checkout order. Please try again.");
        setLoading(false);
        return;
      }

      // Add extra details in checkout description notes
      const notesDescription = `Company: ${companyName || "N/A"} | Biz: ${businessCategory || "N/A"}`;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_7fK8bF9H1k6Y3a",
        amount: data.amount,
        currency: "INR",
        name: "AI Digital",
        description: `${selectedItem.name} Purchase`,
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
              clearCart();
              window.location.href = `/payment-success?payment_id=${paymentResponse.razorpay_payment_id}&amount=${finalTotal}&plans=${encodeURIComponent(selectedItem.name)}&phone=${encodeURIComponent(customerPhone)}`;
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification call error:", err);
            alert("Verification connection error.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          companyName: companyName || "N/A",
          businessCategory: businessCategory || "N/A",
          appliedReferralCode: appliedCode || "None",
          extraDetails: notesDescription
        },
        theme: {
          color: "#e56030",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setShowExitSurvey(true);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout payment initialization error:", error);
      alert("Failed to connect to checkout gateway. Please try again.");
      setLoading(false);
    }
  };

  const handleScheduleReminder = async (e) => {
    if (e) e.preventDefault();
    if (!reminderDate) {
      alert("Please select a date for the reminder.");
      return;
    }
    setSubmittingReminder(true);
    try {
      const response = await fetch("/api/checkout/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          planName: selectedItem?.name,
          planPrice: finalTotal,
          reminderDate: reminderDate
        })
      });
      const data = await response.json();
      if (data.success) {
        setReminderSuccess(true);
        setTimeout(() => {
          setShowExitSurvey(false);
          setReminderSuccess(false);
          setReminderDate("");
        }, 3000);
      } else {
        alert("Failed to schedule reminder. Please try again.");
      }
    } catch (err) {
      console.error("Reminder scheduling error:", err);
      alert("Connection error. Please try again.");
    } finally {
      setSubmittingReminder(false);
    }
  };


  if (!mounted) {
    return (
      <div className="pricing-page-wrapper">
        <SiteHeader active="checkout" />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="loader-spinner">Loading your secure checkout...</div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="pricing-page-wrapper">
      <SiteHeader active="checkout" />

      <main className="cart-container" style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 24px", minHeight: "75vh" }}>

        {/* Checkout Header */}
        <div className="cart-header" style={{ marginBottom: "40px", textAlign: "center" }}>
          <div className="badge-pill" style={{ display: "inline-block", background: "var(--orange-soft)", color: "var(--orange)", padding: "4px 16px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700" }}>
            Secure Checkout
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "700", color: "var(--text)", marginTop: "12px" }}>
            Activate Your <span>Campaign</span>
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: "1.05rem" }}>
            Complete your onboarding details and proceed to secure checkout.
          </p>
        </div>

        {!selectedItem ? (
          /* Empty Checkout State */
          <div className="empty-cart-card" style={{
            background: "var(--surface)",
            border: "1px solid var(--line-soft)",
            borderRadius: "24px",
            padding: "60px 24px",
            textAlign: "center",
            boxShadow: "var(--card-shadow)",
            maxWidth: "600px",
            margin: "0 auto",
            animation: "fadeInSlide 0.4s ease-out"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "72px", color: "var(--orange)", marginBottom: "20px" }}>
              shopping_cart_checkout
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "12px", color: "var(--text)" }}>No Plan Selected</h2>
            <p style={{ color: "var(--muted)", marginBottom: "32px", fontSize: "1rem" }}>
              Please select a digital marketing, custom website, or creative package to activate.
            </p>
            <a href="/pricing" className="nav-button" style={{ textDecoration: "none", display: "inline-block", padding: "12px 32px", fontSize: "0.95rem" }}>
              Explore Packages & Pricing
            </a>
          </div>
        ) : (
          /* Checkout Content Layout */
          <div className="cart-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>

            {/* Left side: Details Form */}
            <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Customer Contact Details */}
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--line-soft)",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "var(--card-shadow)"
              }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700", borderBottom: "1px solid var(--line-soft)", paddingBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--text)", marginBottom: "24px" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--orange)" }}>account_circle</span>
                  Contact Information
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "0.95rem",
                        outline: "none",
                        transition: "border-color 0.2s ease"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="biz-fields-grid">
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          border: "1px solid var(--line)",
                          fontSize: "0.95rem",
                          outline: "none"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                        WhatsApp Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 90960 90701"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          border: "1px solid var(--line)",
                          fontSize: "0.95rem",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra business context fields for Campaign Setup */}
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--line-soft)",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "var(--card-shadow)"
              }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700", borderBottom: "1px solid var(--line-soft)", paddingBottom: "12px", display: "flex", alignItems: "center", gap: "10px", color: "var(--text)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--blue)" }}>campaign</span>
                  Campaign Configuration (Optional)
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "8px", marginBottom: "24px" }}>
                  Provide details about your project to help us initialize parameters for your campaign setup quickly.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "0.95rem",
                        outline: "none",
                        transition: "border-color 0.2s ease"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                      Business Category / Brief Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what your business does and target audience..."
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                        fontSize: "0.95rem",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s ease"
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Right side: Billing Summary & Promo Code */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="cart-checkout-summary-card" style={{
                background: "var(--surface)",
                border: "1px solid var(--line-soft)",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "var(--card-shadow)",
                position: "sticky",
                top: "100px"
              }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "20px", borderBottom: "1px solid var(--line-soft)", paddingBottom: "12px", color: "var(--text)" }}>
                  Order Summary
                </h2>

                {/* Selected Plan Details */}
                <div style={{
                  padding: "18px",
                  background: "rgba(248, 250, 252, 0.8)",
                  borderRadius: "16px",
                  border: "1px solid var(--line-soft)",
                  marginBottom: "20px"
                }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text)" }}>
                    {selectedItem.name}
                  </h3>
                  <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text)", marginTop: "6px" }}>
                    ₹{selectedItem.price}
                  </div>

                  {selectedItem.features && selectedItem.features.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                        {selectedItem.features.slice(0, 3).map((feat, i) => (
                          <li key={i} style={{ fontSize: "0.82rem", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--orange)", fontWeight: "bold" }}>check_circle</span>
                            {feat}
                          </li>
                        ))}
                        {selectedItem.features.length > 3 && (
                          <li style={{ fontSize: "0.82rem", color: "var(--muted)", fontStyle: "italic", marginLeft: "20px" }}>
                            + {selectedItem.features.length - 3} more features included
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Promo Code Box */}
                <div style={{
                  border: "1px solid var(--line-soft)",
                  borderRadius: "14px",
                  padding: "16px",
                  background: "rgba(248, 250, 252, 0.6)",
                  marginBottom: "20px"
                }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                    Referral / Promo Code
                  </label>

                  {!appliedCode ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10"
                        value={referralInput}
                        onChange={(e) => setReferralInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid var(--line)",
                          fontSize: "0.9rem",
                          outline: "none",
                          textTransform: "uppercase"
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyReferral}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          background: "var(--text)",
                          color: "#ffffff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: "600"
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0fdf4", padding: "8px 12px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#166534" }}>
                        ✓ {appliedCode} (-{discountPercent}%)
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveReferral}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          fontWeight: "700",
                          padding: 0
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {referralErrorMsg && (
                    <div style={{ fontSize: "0.8rem", color: "#ef4444", marginTop: "6px", fontWeight: "600" }}>
                      {referralErrorMsg}
                    </div>
                  )}
                  {referralSuccessMsg && (
                    <div style={{ fontSize: "0.8rem", color: "#166534", marginTop: "6px", fontWeight: "600" }}>
                      {referralSuccessMsg}
                    </div>
                  )}

                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "8px" }}>
                    Use <strong>WELCOME10</strong> or <strong>PREM15</strong> to apply standard discount rates.
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{ padding: "16px 0 0 0", borderTop: "1px dashed var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.92rem" }}>
                    <span style={{ color: "var(--muted)" }}>Subtotal</span>
                    <span style={{ fontWeight: "600", color: "var(--text)" }}>₹{itemPrice}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.92rem" }}>
                      <span style={{ color: "#166534", fontWeight: "600" }}>Referral Discount</span>
                      <span style={{ fontWeight: "700", color: "#166534" }}>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.92rem" }}>
                    <span style={{ color: "var(--muted)" }}>Setup Fees</span>
                    <span style={{ fontWeight: "600", color: "#10b981" }}>FREE</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.4rem", fontWeight: "800", borderTop: "1px solid var(--line-soft)", paddingTop: "14px", marginTop: "14px" }}>
                    <span>Total Amount</span>
                    <span style={{ color: "var(--orange)" }}>₹{finalTotal}</span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="nav-button"
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "1.05rem",
                    fontWeight: "700",
                    background: "var(--orange)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "999px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 6px 20px rgba(229, 96, 48, 0.35)",
                    transition: "all 0.2s ease",
                    marginTop: "20px"
                  }}
                >
                  {loading ? (
                    "Initializing Checkout..."
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>lock</span>
                      Pay Securely via Razorpay
                    </>
                  )}
                </button>

                <p style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", marginTop: "10px" }}>
                  🔒 Secured payment processing.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <SiteFooter />

      {showExitSurvey && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px",
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.98)",
            borderRadius: "24px",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            width: "100%",
            maxWidth: "850px",
            padding: "40px",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
            animation: "slideUp 0.3s ease-out"
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowExitSurvey(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>close</span>
            </button>

            {reminderSuccess ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "72px", color: "#10b981", marginBottom: "20px" }}>check_circle</span>
                <h3 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1e293b", marginBottom: "12px", fontFamily: "inherit" }}>Reminder Scheduled!</h3>
                <p style={{ color: "#64748b", fontSize: "1.05rem", fontFamily: "inherit" }}>We've successfully scheduled your payment reminder on <strong>{reminderDate}</strong>. Talk to you soon!</p>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1e293b", margin: 0, fontFamily: "inherit" }}>
                    Select how you would like to proceed 🚀
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.98rem", margin: "8px 0 0 0", fontFamily: "inherit" }}>
                    You dismissed the payment step. Let us help you continue your growth journey.
                  </p>
                </div>

                <div className="recovery-options-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>

                  {/* Option 1: Reschedule / Remind */}
                  <div className="recovery-card" style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "var(--orange-soft)",
                        color: "var(--orange)",
                        marginBottom: "8px"
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>calendar_month</span>
                      </div>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>Reschedule / Remind</h4>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                        Pick a date and we will record a reminder for you to make the payment later.
                      </p>
                    </div>

                    <form onSubmit={handleScheduleReminder} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <input
                        type="date"
                        required
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.88rem",
                          color: "#1e293b",
                          fontFamily: "inherit",
                          outline: "none"
                        }}
                      />
                      <button
                        type="submit"
                        disabled={submittingReminder}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "var(--orange)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "background-color 0.2s"
                        }}
                      >
                        {submittingReminder ? "Scheduling..." : "Set Reminder"}
                      </button>
                    </form>
                  </div>

                  {/* Option 2: Connect with Sales */}
                  <div className="recovery-card" style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "#e8fcf0",
                        color: "#25D366",
                        marginBottom: "8px"
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>chat</span>
                      </div>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>Connect with Sales</h4>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                        Have questions about pricing, custom deliverables, or special packages? Chat with our team.
                      </p>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=919096090701&text=${encodeURIComponent(
                        `Hi, I was checking out the ${selectedItem?.name || "Premium Plan"} on AI Digital (₹${finalTotal || "0"}) and wanted to discuss custom options or ask a few questions. My details: Name: ${customerName || "N/A"}, Phone: ${customerPhone || "N/A"}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "#25D366",
                        color: "#ffffff",
                        textAlign: "center",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        display: "block",
                        transition: "background-color 0.2s"
                      }}
                    >
                      Chat on WhatsApp
                    </a>
                  </div>

                  {/* Option 3: Explore Portfolio */}
                  <div className="recovery-card" style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "var(--blue-soft)",
                        color: "var(--blue)",
                        marginBottom: "8px"
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>folder_open</span>
                      </div>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>Check Portfolio</h4>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                        Would you like to check our portfolio or completed projects first? See our case studies.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowExitSurvey(false);
                        window.location.href = "/portfolio";
                      }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "var(--text)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      }}
                    >
                      View Portfolio Page
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive layout styles specifically for Checkout page */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .recovery-card:hover {
          transform: translateY(-6px);
          border-color: var(--orange) !important;
          box-shadow: 0 10px 24px rgba(229, 96, 48, 0.08);
        }
        @media (min-width: 992px) {
          .cart-content-grid {
            grid-template-columns: 1.6fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .biz-fields-grid {
            grid-template-columns: 1fr !important;
          }
          .recovery-options-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}


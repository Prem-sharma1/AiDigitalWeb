"use client";

import React, { useEffect, useState } from "react";
import { Icon, SiteFooter, SiteHeader } from "../components/SiteChrome";

export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState("");
  const [plans, setPlans] = useState("");
  
  // Tab control: "form" | "scheduler" | "whatsapp"
  const [activeTab, setActiveTab] = useState("form");

  // Form inputs
  const [contactName, setContactName] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [businessType, setBusinessType] = useState("Sole Proprietorship");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [gstin, setGstin] = useState("");
  const [requestCallBack, setRequestCallBack] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Scheduler states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [schedulerBooked, setSchedulerBooked] = useState(false);
  const [schedulerLoading, setSchedulerLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setPaymentId(params.get("payment_id") || "pay_mock123456");
      setAmount(params.get("amount") || "0");
      setPlans(params.get("plans") || "AI Digital Plan");
    }
  }, []);

  // Format next 5 working days (excluding weekends) for scheduler
  const getNextWorkingDays = () => {
    const days = [];
    let current = new Date();
    
    while (days.length < 5) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
        days.push(new Date(current));
      }
    }
    return days;
  };

  const nextDays = getNextWorkingDays();
  const timeSlots = ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: paymentId,
          plans: plans,
          contact_name: contactName,
          alt_phone: altPhone,
          business_type: businessType,
          gstin: gstin,
          address_line1: addressLine1,
          address_line2: addressLine2,
          city: city,
          state_name: stateName,
          pin_code: pinCode,
          request_callback: requestCallBack ? 1 : 0
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save details");
      
      setFormSubmitted(true);
      setActiveTab("form");
    } catch (err) {
      alert("Error saving onboarding details: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSchedulerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot) return;
    
    setSchedulerLoading(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: paymentId,
          plans: plans,
          scheduled_date: selectedDate,
          scheduled_time: selectedTimeSlot
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to book strategy session");
      
      setSchedulerBooked(true);
    } catch (err) {
      alert("Error scheduling call: " + err.message);
    } finally {
      setSchedulerLoading(false);
    }
  };

  const getWhatsAppOnboardingMessage = () => {
    let msg = `Hi! I completed payment (ID: ${paymentId}) for the plan: ${plans}.\n\n`;
    msg += `I would like to complete my onboarding setup via chat! Here are my details:\n\n`;
    msg += `👤 CONTACT DETAILS:\n`;
    msg += `- Contact Name: ${contactName || "(Not filled yet)"}\n`;
    msg += `- Alt WhatsApp/Phone: ${altPhone || "(Not filled yet)"}\n`;
    msg += `- Business Entity: ${businessType || "Sole Proprietorship"}\n`;
    msg += `- GSTIN: ${gstin || "(Not provided)"}\n\n`;
    msg += `📍 BILLING ADDRESS:\n`;
    msg += `- Address Line 1: ${addressLine1 || "(Not filled yet)"}\n`;
    if (addressLine2) msg += `- Address Line 2: ${addressLine2}\n`;
    msg += `- City: ${city || "(Not filled yet)"}\n`;
    msg += `- State: ${stateName || "(Not filled yet)"}\n`;
    msg += `- ZIP/Pin Code: ${pinCode || "(Not filled yet)"}\n\n`;
    msg += `📞 CALLBACK PREFERENCE:\n`;
    msg += `- Request Callback: ${requestCallBack ? "Yes, please call me back" : "No, chat is fine"}\n\n`;
    if (selectedDate && selectedTimeSlot) {
      msg += `🗓️ STRATEGY CALL BOOKED:\n`;
      msg += `- Date: ${selectedDate}\n`;
      msg += `- Time: ${selectedTimeSlot}\n\n`;
    }
    msg += `Status: Ready for Onboarding\n`;
    msg += `Please verify and confirm my campaign.`;
    return msg;
  };

  const getWhatsAppOnboardingLink = () => {
    return `https://wa.me/919096090701?text=${encodeURIComponent(getWhatsAppOnboardingMessage())}`;
  };

  if (!mounted) {
    return (
      <div className="pricing-page-wrapper">
        <SiteHeader active="none" />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Processing transaction success details...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="pricing-page-wrapper">
      <SiteHeader active="none" />

      <main style={{ maxWidth: "900px", margin: "40px auto", padding: "0 24px", minHeight: "80vh" }}>
        
        {/* Success Confirmation Card */}
        <div className="success-banner-card" style={{
          background: "var(--surface)",
          border: "1px solid #bbf7d0",
          borderRadius: "24px",
          padding: "32px",
          textAlign: "center",
          boxShadow: "var(--card-shadow)",
          marginBottom: "40px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Visual gradient background highlight */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #10b981, #34d399)"
          }} />

          <div className="success-icon-wrapper" style={{
            width: "72px",
            height: "72px",
            background: "#ecfdf5",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            color: "#10b981",
            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.15)"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "40px", fontWeight: "bold" }}>
              check_circle
            </span>
          </div>

          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--text)" }}>
            Payment <span>Successful!</span>
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: "1rem" }}>
            Thank you for your purchase. We have received your order.
          </p>

          {/* Details Table */}
          <div style={{
            marginTop: "24px",
            padding: "20px",
            background: "var(--page)",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            textAlign: "left"
          }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase" }}>Payment ID</span>
              <div style={{ fontSize: "0.95rem", fontWeight: "700", wordBreak: "break-all" }}>{paymentId}</div>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase" }}>Amount Paid</span>
              <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--orange)" }}>₹{amount}</div>
            </div>
            <div className="plans-purchased-cell" style={{ gridColumn: "span 2" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase" }}>Service Plans Purchased</span>
              <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>{plans}</div>
            </div>
          </div>
        </div>

        {/* Action Choice Section */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", textAlign: "center", marginBottom: "8px" }}>
            Initialize Onboarding Campaign
          </h2>
          <p style={{ color: "var(--muted)", textAlign: "center", fontSize: "0.95rem", marginBottom: "24px" }}>
            Select how you would like to complete your onboarding checklist:
          </p>

          {/* Tabs Navigation */}
          <div style={{
            display: "flex",
            background: "var(--surface-muted)",
            padding: "6px",
            borderRadius: "12px",
            gap: "8px",
            maxWidth: "600px",
            margin: "0 auto 32px auto"
          }} className="tabs-wrapper">
            <button
              onClick={() => setActiveTab("form")}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: activeTab === "form" ? "var(--surface)" : "transparent",
                color: activeTab === "form" ? "var(--orange)" : "var(--muted)",
                boxShadow: activeTab === "form" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>description</span>
              Fill Details Form
            </button>
            
            <button
              onClick={() => setActiveTab("scheduler")}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: activeTab === "scheduler" ? "var(--surface)" : "transparent",
                color: activeTab === "scheduler" ? "var(--orange)" : "var(--muted)",
                boxShadow: activeTab === "scheduler" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>calendar_month</span>
              Book Call
            </button>

            <button
              onClick={() => setActiveTab("whatsapp")}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: activeTab === "whatsapp" ? "var(--surface)" : "transparent",
                color: activeTab === "whatsapp" ? "var(--orange)" : "var(--muted)",
                boxShadow: activeTab === "whatsapp" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>chat</span>
              WhatsApp Chat
            </button>
          </div>

          {/* Tab Panes */}
          <div className="tab-pane-container" style={{
            background: "var(--surface)",
            border: "1px solid var(--line-soft)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "var(--card-shadow)",
            animation: "fadeInSlide 0.3s ease-out"
          }}>
            
            {/* 1. Client Detailing Onboarding Form */}
            {activeTab === "form" && (
              <div>
                {formSubmitted ? (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "#10b981", marginBottom: "16px" }}>
                      task_alt
                    </span>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "8px" }}>Onboarding Details Submitted!</h3>
                    {requestCallBack && (
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "var(--orange-soft)",
                        color: "var(--orange)",
                        padding: "6px 16px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        marginBottom: "16px"
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>phone_callback</span>
                        Call Back Requested
                      </div>
                    )}
                    <p style={{ color: "var(--muted)", maxWidth: "500px", margin: "0 auto 24px auto" }}>
                      Thank you. We have saved your project details. {requestCallBack ? "Our campaign specialist will call you back at your convenience to discuss these details." : "Our onboarding representative will review them and reach out shortly to kickstart the campaign."}
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <a href="/" className="nav-button" style={{ textDecoration: "none", display: "inline-block", background: "var(--text)" }}>
                        Go to Home
                      </a>
                      <a href={getWhatsAppOnboardingLink()} target="_blank" rel="noopener noreferrer" className="nav-button" style={{ textDecoration: "none", display: "inline-block", background: "#25d366" }}>
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px", borderBottom: "1px solid var(--line-soft)", paddingBottom: "12px" }}>
                      Client Profile & Billing Address Details
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="biz-fields-grid">
                      <div>
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          Primary Contact Person Name *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Prem Sharma"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
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
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          Alternative WhatsApp / Phone No.
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 90960 90701"
                          value={altPhone}
                          onChange={(e) => setAltPhone(e.target.value)}
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
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          Business Entity Type *
                        </label>
                        <select
                          required
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            border: "1px solid var(--line)",
                            fontSize: "0.95rem",
                            outline: "none",
                            background: "var(--surface)"
                          }}
                        >
                          <option value="Sole Proprietorship">Sole Proprietorship</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Private Limited Company">Private Limited Company</option>
                          <option value="Individual">Individual</option>
                          <option value="LLP">LLP</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          GSTIN Number (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 27AAAAA0000A1Z5"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            border: "1px solid var(--line)",
                            fontSize: "0.95rem",
                            outline: "none",
                            textTransform: "uppercase"
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          Billing Address Line 1 *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Street Address, P.O. Box, Company name"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
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

                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          Billing Address Line 2
                        </label>
                        <input
                          type="text"
                          placeholder="Apartment, Suite, Unit, Building, Floor, etc."
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
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
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          City *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Pune"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
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
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          State / Region *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Maharashtra"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
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

                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                          ZIP / Pin Code *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. 411001"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
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

                    {/* Request Call Back Checkbox */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px", background: "var(--page)", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--line-soft)" }}>
                      <input
                        type="checkbox"
                        id="callback-checkbox"
                        checked={requestCallBack}
                        onChange={(e) => setRequestCallBack(e.target.checked)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: "var(--orange)"
                        }}
                      />
                      <label htmlFor="callback-checkbox" style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--text)", cursor: "pointer" }}>
                        Yes, I request a callback from a manager to discuss these onboarding details.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="nav-button"
                      style={{
                        padding: "14px 24px",
                        fontSize: "0.95rem",
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
                        boxShadow: "0 4px 15px rgba(229, 96, 48, 0.3)",
                        transition: "all 0.2s ease",
                        width: "fit-content",
                        marginTop: "12px"
                      }}
                    >
                      {formLoading ? "Saving details..." : "Submit Onboarding Details"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 2. Meeting Call Scheduler */}
            {activeTab === "scheduler" && (
              <div>
                {schedulerBooked ? (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "var(--blue)", marginBottom: "16px" }}>
                      calendar_today
                    </span>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "8px" }}>Strategy Meeting Scheduled!</h3>
                    <p style={{ color: "var(--muted)", maxWidth: "550px", margin: "0 auto 24px auto" }}>
                      We have booked your slot for **{selectedDate}** at **{selectedTimeSlot}**. A Google Meet calendar invite has been sent to your email. We look forward to onboarding you!
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <a href="/" className="nav-button" style={{ textDecoration: "none", display: "inline-block", background: "var(--text)" }}>
                        Go to Home
                      </a>
                      <button onClick={() => setSchedulerBooked(false)} className="nav-button" style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--line)" }}>
                        Change Time
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSchedulerSubmit}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px", borderBottom: "1px solid var(--line-soft)", paddingBottom: "12px" }}>
                      Schedule Strategy Onboarding Call
                    </h3>
                    <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "24px" }}>
                      Too busy to fill out the form now? Select a convenient time slot below for a strategy onboarding session with our project manager.
                    </p>

                    {/* Date Picker Grid */}
                    <div style={{ marginBottom: "24px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "var(--text)", marginBottom: "12px" }}>
                        1. Select a Date:
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }}>
                        {nextDays.map((d, idx) => {
                          const dateString = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                          const valString = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                          const isSelected = selectedDate === valString;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedDate(valString)}
                              style={{
                                padding: "14px 10px",
                                borderRadius: "12px",
                                border: "1px solid",
                                borderColor: isSelected ? "var(--orange)" : "var(--line)",
                                background: isSelected ? "var(--orange-soft)" : "var(--surface)",
                                color: isSelected ? "var(--orange)" : "var(--text)",
                                fontWeight: "700",
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                              }}
                            >
                              {dateString}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slot Picker Grid */}
                    {selectedDate && (
                      <div style={{ marginBottom: "32px", animation: "fadeInSlide 0.2s ease-out" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "var(--text)", marginBottom: "12px" }}>
                          2. Select an Available Time Slot (IST):
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "10px" }}>
                          {timeSlots.map((slot, idx) => {
                            const isSelected = selectedTimeSlot === slot;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedTimeSlot(slot)}
                                style={{
                                  padding: "10px 8px",
                                  borderRadius: "10px",
                                  border: "1px solid",
                                  borderColor: isSelected ? "var(--orange)" : "var(--line)",
                                  background: isSelected ? "var(--orange-soft)" : "var(--surface)",
                                  color: isSelected ? "var(--orange)" : "var(--muted)",
                                  fontWeight: "600",
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                  transition: "all 0.15s ease"
                                }}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Confirm Booking CTA */}
                    <button
                      type="submit"
                      disabled={schedulerLoading || !selectedDate || !selectedTimeSlot}
                      className="nav-button"
                      style={{
                        padding: "14px 24px",
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        background: "var(--orange)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "999px",
                        cursor: (!selectedDate || !selectedTimeSlot) ? "not-allowed" : "pointer",
                        opacity: (!selectedDate || !selectedTimeSlot) ? 0.6 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 4px 15px rgba(229, 96, 48, 0.3)",
                        transition: "all 0.2s ease",
                        width: "fit-content"
                      }}
                    >
                      {schedulerLoading ? "Scheduling call..." : "Confirm Booking Slot"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 3. WhatsApp Direct Onboarding channel */}
            {activeTab === "whatsapp" && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  background: "#e8fbf0",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  color: "#25d366"
                }}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.817 9.817 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.136 8.136 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.188 8.188 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24z"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "8px" }}>Onboarding via WhatsApp</h3>
                <p style={{ color: "var(--muted)", maxWidth: "520px", margin: "0 auto 24px auto", fontSize: "0.95rem" }}>
                  Complete your campaign setup instantly on chat. Send a prefilled WhatsApp message to our onboarding staff to begin.
                </p>
                <div style={{
                  textAlign: "left",
                  maxWidth: "550px",
                  margin: "0 auto 24px auto",
                  padding: "20px",
                  background: "var(--page)",
                  border: "1px dashed var(--line)",
                  borderRadius: "16px",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  whiteSpace: "pre-wrap",
                  color: "var(--text)",
                  maxHeight: "220px",
                  overflowY: "auto",
                  lineHeight: "1.4"
                }}>
                  <strong style={{ color: "var(--orange)", display: "block", marginBottom: "8px", fontFamily: "inherit" }}>
                    Prefilled Message Preview:
                  </strong>
                  {getWhatsAppOnboardingMessage()}
                </div>
                <a
                  href={getWhatsAppOnboardingLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-button"
                  style={{
                    background: "#25d366",
                    color: "#ffffff",
                    textDecoration: "none",
                    padding: "14px 28px",
                    borderRadius: "999px",
                    fontWeight: "700",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>chat</span>
                  Launch WhatsApp Chat
                </a>
              </div>
            )}

          </div>
        </div>

      </main>

      <SiteFooter />

      {/* Animation rules */}
      <style jsx global>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 576px) {
          .tabs-wrapper {
            flex-direction: column !important;
            max-width: 100% !important;
          }
          .plans-purchased-cell {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

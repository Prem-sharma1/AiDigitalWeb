"use client";

import React, { useState } from "react";
import { isValidEmail, isValidMobileNumber, isValidName } from "../../lib/validation";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validations
    if (!isValidName(formData.name)) {
      setStatus("error");
      setErrorMessage("Please enter a valid name (at least 2 letters).");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address with a domain (e.g. user@domain.com).");
      return;
    }
    if (!isValidMobileNumber(formData.phone)) {
      setStatus("error");
      setErrorMessage("Please enter a valid 10-digit WhatsApp mobile number.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setStatus("success");
      
      // Push event to Google Tag Manager
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "contact_form_success",
          userName: formData.name,
          userEmail: formData.email,
          userPhone: formData.phone,
          selectedService: formData.service,
          message: formData.message
        });
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="contact-card">
      <span className="contact-label">Contact Us</span>
      <h2>Let's build something great together</h2>
      <p>Tell us about your project and we'll respond within one business day.</p>
      
      {status === "success" && (
        <div style={{
          backgroundColor: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#166534",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "16px"
        }}>
          Thank you! Your inquiry has been submitted and saved to our Google Sheet successfully. We will get back to you shortly.
        </div>
      )}

      {status === "error" && (
        <div style={{
          backgroundColor: "#FEF2F2",
          border: "1px solid #FEE2E2",
          color: "#991B1B",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "16px"
        }}>
          Error: {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          aria-label="Your name"
          placeholder="Your name"
          required
          disabled={status === "submitting"}
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-label="Email address"
          placeholder="Email address"
          type="email"
          required
          disabled={status === "submitting"}
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          aria-label="Phone"
          placeholder="Phone"
          required
          disabled={status === "submitting"}
        />
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          aria-label="Service of interest"
          required
          disabled={status === "submitting"}
        >
          <option value="" disabled>Service of interest</option>
          <option value="SEO Growth">SEO Growth</option>
          <option value="Performance Marketing">Performance Marketing</option>
          <option value="Web Development">Web Development</option>
        </select>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          aria-label="Project brief"
          placeholder="Tell us about your project"
          rows="5"
          required
          disabled={status === "submitting"}
        />
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}

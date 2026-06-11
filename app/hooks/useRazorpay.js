"use client";

import { useCallback } from "react";

export function useRazorpay() {
  const getPlanAmount = useCallback((planName) => {
    if (!planName) return 0;
    const match = planName.replace(/,/g, "").match(/₹(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }, []);

  const triggerCheckout = useCallback(async ({
    planName,
    userName,
    email,
    phone,
    onSuccess,
    onFailure
  }) => {
    const amount = getPlanAmount(planName);
    if (amount === 0) {
      alert("Please select a valid plan.");
      return;
    }

    try {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, planName }),
      });
      const data = await response.json();

      if (!data.success) {
        alert("Failed to initiate transaction: " + data.error);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: data.amount,
        currency: "INR",
        name: "AI Digital",
        description: `Payment for ${planName}`,
        order_id: data.orderId,
        handler: async function (res) {
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              }),
            });
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              if (onSuccess) onSuccess(res.razorpay_payment_id);
            } else {
              alert("Signature verification failed.");
              if (onFailure) onFailure("Verification failed");
            }
          } catch (err) {
            console.error(err);
            if (onFailure) onFailure(err);
          }
        },
        prefill: {
          name: userName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#E56030",
        },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK is not loaded yet. Please wait a moment and try again.");
        return;
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Checkout failed.");
      if (onFailure) onFailure(err);
    }
  }, [getPlanAmount]);

  return { triggerCheckout, getPlanAmount };
}
export default useRazorpay;

import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { sendWhatsAppMessage } from "../../../../lib/whatsapp";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret_value_for_validation_only";

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", keySecret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Trigger WhatsApp notifications
      try {
        const razorpay = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_7fK8bF9H1k6Y3a",
          key_secret: keySecret,
        });

        // Fetch payment details securely from Razorpay API
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        const contact = payment.contact;
        const email = payment.email;
        const amount = payment.amount ? payment.amount / 100 : 0;
        
        let planName = "AI Digital Plan";
        if (payment.notes && payment.notes.planName) {
          planName = payment.notes.planName;
        } else if (payment.order_id) {
          try {
            const order = await razorpay.orders.fetch(payment.order_id);
            if (order && order.notes && order.notes.planName) {
              planName = order.notes.planName;
            }
          } catch (e) {
            console.warn("Failed to fetch Razorpay order notes:", e.message);
          }
        }

        // Notify the client
        if (contact) {
          const clientMsg = `💳 *Payment Successful!*\n\nHi! Thank you for purchasing the *${planName}* for ₹${amount}. We have successfully received your payment (ID: ${razorpay_payment_id}).\n\nOur team is initializing your campaign parameters and we will schedule an onboarding call shortly.\n\nBest regards,\nAI Digital Team`;
          await sendWhatsAppMessage({ to: contact, message: clientMsg });
        }

        // Notify the Admin
        const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER || "919096090701";
        const adminMsg = `🎉 *New Purchase Notification!*\n\n*Plan:* ${planName}\n*Amount:* ₹${amount}\n*Customer Contact:* ${contact || "N/A"}\n*Customer Email:* ${email || "N/A"}\n*Payment ID:* ${razorpay_payment_id}`;
        await sendWhatsAppMessage({ to: adminNumber, message: adminMsg });

      } catch (waErr) {
        console.error("WhatsApp payment notification failed:", waErr.message);
      }

      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

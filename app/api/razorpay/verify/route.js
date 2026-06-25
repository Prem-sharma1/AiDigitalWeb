import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { sendWhatsAppMessage } from "../../../../lib/whatsapp";
import { sendEmail } from "../../../../lib/email";

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
      // Trigger WhatsApp & Email notifications
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
        let referralCode = "None";

        if (payment.notes) {
          if (payment.notes.planName) planName = payment.notes.planName;
          if (payment.notes.referralCode) referralCode = payment.notes.referralCode;
        }

        if (payment.order_id) {
          try {
            const order = await razorpay.orders.fetch(payment.order_id);
            if (order && order.notes) {
              if (order.notes.planName) planName = order.notes.planName;
              if (order.notes.referralCode) referralCode = order.notes.referralCode;
            }
          } catch (e) {
            console.warn("Failed to fetch Razorpay order notes:", e.message);
          }
        }

        // Notify the client via WhatsApp
        if (contact) {
          const clientMsg = `💳 *Payment Successful!*\n\nHi! Thank you for purchasing the *${planName}* for ₹${amount}. We have successfully received your payment (ID: ${razorpay_payment_id}).\n\nOur team is initializing your campaign parameters and we will schedule an onboarding call shortly.\n\nBest regards,\nAI Digital Team`;
          await sendWhatsAppMessage({ to: contact, message: clientMsg });
        }

        // Notify the Admin via WhatsApp
        const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER || "919096090701";
        const adminMsg = `🎉 *New Purchase Notification!*\n\n*Plan:* ${planName}\n*Amount:* ₹${amount}\n*Customer Contact:* ${contact || "N/A"}\n*Customer Email:* ${email || "N/A"}\n*Referral Code:* ${referralCode}\n*Payment ID:* ${razorpay_payment_id}`;
        await sendWhatsAppMessage({ to: adminNumber, message: adminMsg });

        // Notify the Admin via Email
        const adminEmail = process.env.ADMIN_EMAIL || "aidigitalbiz01@gmail.com";
        const emailSubject = `🎉 New Plan Purchase Alert: ${planName} (₹${amount})`;
        const emailText = `Hello,\n\nA customer has successfully purchased a plan on your website.\n\nPurchase Details:\n- Plan Name: ${planName}\n- Amount: ₹${amount}\n- Customer Contact: ${contact || "N/A"}\n- Customer Email: ${email || "N/A"}\n- Referral Code: ${referralCode}\n- Payment ID: ${razorpay_payment_id}\n\nPlease check your Razorpay dashboard and follow up with the client.\n\nBest regards,\nAI Digital Notification System`;
        
        await sendEmail({
          to: adminEmail,
          subject: emailSubject,
          text: emailText
        });

      } catch (waErr) {
        console.error("Payment notification failed:", waErr.message);
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

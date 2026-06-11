import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing required verification parameters" }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error("RAZORPAY_KEY_SECRET is not defined in environment variables");
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    // Create the expected signature using HMAC-SHA256
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(text)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Payment verified successfully
      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Signature verification error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

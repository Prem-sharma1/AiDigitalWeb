import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { amount, planName } = await req.json();

    if (!amount || !planName) {
      return NextResponse.json({ success: false, error: "Missing amount or planName" }, { status: 400 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("Razorpay keys are missing from environment variables");
      return NextResponse.json({ success: false, error: "Payment gateway credentials are not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // Razorpay accepts amounts in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planName,
      },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ success: true, orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

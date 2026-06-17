import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_7fK8bF9H1k6Y3a",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret_value_for_validation_only",
});

export async function POST(req) {
  try {
    const { amount, planName } = await req.json();

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planName,
      },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ success: true, orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

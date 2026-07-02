import { NextResponse } from "next/server";
import { sendEmail } from "../../../../lib/email";
import { sendWhatsAppMessage } from "../../../../lib/whatsapp";

// In-memory OTP Cache (Serverless warning: would need a persistent cache like Redis in production,
// but works perfectly for local server setups).
const otpCache = new Map();

function formatTwilioPhone(phone) {
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.length === 10) {
      cleaned = "+91" + cleaned; // Default country code India if 10-digit
    } else {
      cleaned = "+" + cleaned;
    }
  }
  return cleaned;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, email, phone, code } = body;

    const identifier = phone || email;

    if (!identifier) {
      return NextResponse.json({ success: false, error: "Email or phone number is required" }, { status: 400 });
    }

    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    // Use Twilio Verify Service if configured
    const useTwilioVerify = verifyServiceSid && accountSid && authToken;

    if (action === "send") {
      if (useTwilioVerify) {
        const toVal = phone ? formatTwilioPhone(phone) : email;
        const channelVal = phone ? "whatsapp" : "email";
        const twilioUrl = `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`;
        const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

        const bodyParams = new URLSearchParams({
          To: toVal,
          Channel: channelVal
        });

        console.log(`[TWILIO VERIFY SEND] Dispatching ${channelVal} verification to ${toVal}...`);

        const response = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: bodyParams.toString()
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Twilio Verify error: HTTP ${response.status}`);
        }

        return NextResponse.json({
          success: true,
          message: `OTP verification sent via Twilio ${channelVal} successfully`,
          details: { emailSent: !phone, whatsappSent: !!phone }
        });
      }

      // Fallback: Custom in-memory OTP for Email or standard WhatsApp log
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in memory cache (expires in 5 minutes)
      otpCache.set(identifier, {
        code: otp,
        expires: Date.now() + 5 * 60000
      });

      console.log(`[OTP GENERATED] Identifier: ${identifier} | OTP: ${otp}`);

      // Send Email
      let emailSent = false;
      if (email) {
        const mailRes = await sendEmail({
          to: email,
          subject: "AI Digital - Checkout Verification OTP",
          text: `Your secure verification code to complete your checkout is: ${otp}\n\nThis OTP is valid for 5 minutes. Please do not share this code with anyone.`,
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 480px;">
            <h2 style="color: #e56030; margin-top: 0;">AI Digital Verification</h2>
            <p>Your secure verification code to complete your checkout is:</p>
            <div style="font-size: 24px; font-weight: 800; color: #0f172a; padding: 12px 24px; background: #f8fafc; border-radius: 8px; display: inline-block; letter-spacing: 4px; margin: 16px 0;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 13px; margin-bottom: 0;">This OTP is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
          </div>`
        });
        emailSent = mailRes.success;
      }

      // Send WhatsApp (Standard notification sender)
      let whatsappSent = false;
      if (phone) {
        try {
          const cleanPhone = phone.replace(/\D/g, "");
          await sendWhatsAppMessage({
            to: cleanPhone,
            message: `AI Digital: Your verification code to complete your checkout is *${otp}*. Valid for 5 minutes.`
          });
          whatsappSent = true;
        } catch (wsErr) {
          console.error("WhatsApp OTP send error:", wsErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        details: { emailSent, whatsappSent }
      });
    }

    if (action === "verify") {
      if (useTwilioVerify) {
        const toVal = phone ? formatTwilioPhone(phone) : email;
        const twilioUrl = `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`;
        const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

        const bodyParams = new URLSearchParams({
          To: toVal,
          Code: code.trim()
        });

        console.log(`[TWILIO VERIFY CHECK] Checking OTP code for ${toVal}...`);

        const response = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: bodyParams.toString()
        });

        const data = await response.json();
        if (!response.ok || data.status !== "approved") {
          return NextResponse.json({
            success: false,
            error: data.message || "Incorrect verification code or verification expired. Please check and try again."
          }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Verification successful" });
      }

      // Fallback: Local Cache verification
      const cached = otpCache.get(identifier);

      if (!cached) {
        return NextResponse.json({ success: false, error: "No OTP request found. Please request a new code." }, { status: 400 });
      }

      if (Date.now() > cached.expires) {
        otpCache.delete(identifier);
        return NextResponse.json({ success: false, error: "OTP has expired. Please request a new code." }, { status: 400 });
      }

      if (cached.code !== code) {
        return NextResponse.json({ success: false, error: "Invalid OTP code. Please check and try again." }, { status: 400 });
      }

      otpCache.delete(identifier);
      return NextResponse.json({ success: true, message: "Verification successful" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("OTP API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

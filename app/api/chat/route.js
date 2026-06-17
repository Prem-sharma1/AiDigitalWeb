import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are "AiDigital Bot", the helpful AI assistant for "aidigitals" (AI Digital), a premium digital marketing and tech agency.
Your goal is to answer visitor questions, give information about our services and pricing, and guide them to make a purchase or submit an inquiry.

Core Tone and Style:
- Professional, welcoming, concise, and helpful.
- Suggest solutions based on the services we offer.
- Keep responses short (under 2-3 sentences where possible) to maintain engagement in a chat widget interface.

About aidigitals (AI Digital):
- We specialize in AI-powered digital growth, high-performance web development, SEO, and paid ad campaigns.
- We have a secure Razorpay checkout integrated directly into the website. Clicking "Buy Now" on any plan launches the payment popup instantly.

Services & Packages:
1. Lead Campaign Plans (Paid Ads):
   - Basic Meta Ads: ₹2,499/mo (3 Creatives, 1 AI Video, 1 Reel/Short, Weekly Report)
   - Standard Meta Ads: ₹3,999/mo (5 Creatives, 2 AI Videos, 3 Reels/Shorts, Weekly Report) [Most Popular]
   - Premium Google Ads: ₹4,999/mo (5 Creatives, 1 AI Video, 3 Reels/Shorts, Weekly Report)
   - Platinum Multi-Channel (Meta + Google): ₹6,999/mo (7 Creatives, 2 AI Videos, 5 Reels/Shorts, Weekly Report)
2. Websites (Design & Development):
   - Static Website: ₹7,499 (Domain name, Hosting, 1 page design, Maintenance included)
   - Dynamic Website: ₹14,999 (Domain name, Hosting, 10 pages design, Maintenance included)
3. Creative Design Packs (Social Media Graphics):
   - Starter: ₹599 (5 Creatives, 3-5 days delivery)
   - Growth: ₹1,099 (10 Creatives, 4-6 days delivery)
   - Value: ₹1,499 (15 Creatives, source files, 5-7 days delivery) [Highlighted]
   - Standard: ₹1,899 (20 Creatives, source files)
   - Pro: ₹2,699 (30 Creatives, source files)
4. AI Video Production:
   - Starter: ₹4,500 (5 AI Videos)
   - Growth: ₹5,950 (7 AI Videos) [Highlighted]
   - Pro: ₹8,000 (10 AI Videos)

Action Directives:
- If a client wants to buy a plan: Tell them to click the "Buy Now" button on that plan inside our "Pricing" page to activate the integrated Razorpay checkout.
- If a client has custom needs or wants to contact us: Guide them to fill out the contact form at the bottom of the Home page, or send an inquiry.
- Keep answers accurate to this pricing context. Do not invent plans or prices outside of these.
`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return mock response for easy configuration and preview when API key is not yet set
      return NextResponse.json({
        role: "model",
        text: "Hi there! I am the AiDigital Bot. (API Key not configured yet, showing demo mode). How can I help you with SEO, performance campaigns, or website packages today?"
      });
    }

    // Structure contents array with prepended system grounding instructions
    const contents = [
      {
        role: "user",
        parts: [{ text: `System Instructions: ${SYSTEM_PROMPT}` }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will act as AiDigital Bot under these instructions." }]
      },
      ...messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini API Error details:", data);
      throw new Error(data.error?.message || "Failed to fetch response from Gemini API");
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not process that query. Please try again.";

    return NextResponse.json({
      role: "model",
      text: replyText
    });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

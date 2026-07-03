import pool from "./db";

/**
 * Normalizes a phone number to only contain digits, ensuring country code is included.
 * @param {string} phone 
 * @returns {string}
 */
export function normalizePhoneNumber(phone) {
  let cleaned = phone.replace(/[^\d+]/g, "");
  // If it starts with +, remove it to normalize
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }
  // Standard fallback: If it's a 10-digit number, prepend India country code (91) as a default helper
  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }
  return cleaned;
}

/**
 * Sends a WhatsApp message using the configured provider.
 * Logs the output to the database table `whatsapp_logs`.
 * 
 * @param {Object} params
 * @param {string} params.to - Recipient phone number (e.g. "919096090701", "+91 9096090701")
 * @param {string} params.message - Content of the message
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export async function sendWhatsAppMessage({ to, message }) {
  const provider = process.env.WHATSAPP_PROVIDER || "none";
  const recipient = normalizePhoneNumber(to);
  const logId = Math.random().toString(36).substring(2, 15);
  
  let status = "pending";
  let errorMsg = null;

  try {
    if (!recipient) {
      throw new Error("Recipient phone number is invalid or empty.");
    }
    if (!message) {
      throw new Error("Message body is required.");
    }

    if (provider === "none") {
      // Console logging fallback for testing
      console.log(`[WHATSAPP SANDBOX LOG] To: +${recipient} | Msg: ${message}`);
      status = "success";
    } 
    else if (provider === "meta") {
      const phoneId = process.env.META_PHONE_NUMBER_ID;
      const token = process.env.META_WHATSAPP_ACCESS_TOKEN;

      if (!phoneId || !token) {
        throw new Error("Missing Meta Phone Number ID or Access Token in environment.");
      }

      const metaUrl = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
      
      const response = await fetch(metaUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient,
          type: "text",
          text: { body: message }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || `Meta API error: HTTP ${response.status}`);
      }
      status = "success";
    } 
    else if (provider === "ultramsg") {
      const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
      const token = process.env.ULTRAMSG_TOKEN;

      if (!instanceId || !token) {
        throw new Error("Missing UltraMsg Instance ID or Token in environment.");
      }

      const ultramsgUrl = `https://api.ultramsg.com/${instanceId}/messages/chat`;
      const bodyParams = new URLSearchParams({
        token: token,
        to: `+${recipient}`,
        body: message
      });

      const response = await fetch(ultramsgUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyParams.toString()
      });

      const data = await response.json();
      // UltraMsg returns { sent: "true", ... } or { error: ... }
      if (!response.ok || data.error || data.sent !== "true") {
        throw new Error(data.error || `UltraMsg delivery failed: HTTP ${response.status}`);
      }
      status = "success";
    } 
    else {
      throw new Error(`Unsupported WhatsApp provider: ${provider}`);
    }

    // Return success status
    return { success: true, id: logId };
  } catch (err) {
    status = "failed";
    errorMsg = err.message;
    console.error("sendWhatsAppMessage error:", err);
    return { success: false, error: err.message };
  } finally {
    // Write log to MySQL Database asynchronously (do not block client thread)
    try {
      await pool.query(`
        INSERT INTO whatsapp_logs (id, recipient, message, provider, status, error)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [logId, recipient, message, provider, status, errorMsg]);
    } catch (dbErr) {
      console.warn("Could not log WhatsApp message event to MySQL database. Error:", dbErr.message);
    }
  }
}

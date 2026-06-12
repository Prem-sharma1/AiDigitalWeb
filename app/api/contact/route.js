import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req) {
  try {
    const { name, email, phone, service, message } = await req.json();

    // 1. Validate fields
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: "All form fields are required." },
        { status: 400 }
      );
    }

    // 2. Load Google Credentials from Env
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // Check if env variables are configured
    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error("Missing Google Sheets API environment variables in .env");
      return NextResponse.json(
        {
          error: "Google Sheets integration is not configured. Please set the environment variables in your .env file."
        },
        { status: 501 }
      );
    }

    // 3. Authenticate with Google
    // Parse private key (handling potential escaped newlines and surrounding quotes)
    let formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
    if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
      formattedPrivateKey = formattedPrivateKey.slice(1, -1);
    }
    if (formattedPrivateKey.startsWith("'") && formattedPrivateKey.endsWith("'")) {
      formattedPrivateKey = formattedPrivateKey.slice(1, -1);
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: formattedPrivateKey
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 4. Append row to Sheet (using 'Sheet1!A:F' range or defaults)
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const rowValues = [timestamp, name, email, phone, service, message];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:F",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues]
      }
    });

    return NextResponse.json({ success: true, message: "Inquiry saved successfully." });
  } catch (error) {
    console.error("Google Sheets API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit request to Google Sheets." },
      { status: 500 }
    );
  }
}

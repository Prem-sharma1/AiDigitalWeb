import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const expectedEmail = process.env.ADMIN_EMAIL || "admin@aidigital.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "AdminPassword123";

    if (email === expectedEmail && password === expectedPassword) {
      const isHttps = req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
      const response = NextResponse.json({ success: true });
      // Set a session cookie (admin_session)
      response.cookies.set("admin_session", "authenticated", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: isHttps,
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const session = req.cookies.get("admin_session");
  if (session && session.value === "authenticated") {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "", { path: "/", maxAge: 0 });
  return response;
}

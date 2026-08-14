import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "tong2026password";

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({
        success: true,
        message: "Authentication successful.",
        token: "tong_admin_session_valid",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid username or password. Please try again." },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Authentication failed." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { deactivateAccount } from "@/lib/mock-settings-store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username } = body as { username?: string };

  if (!username?.trim()) {
    return NextResponse.json(
      { error: "Username is required to deactivate your account." },
      { status: 400 }
    );
  }

  const result = deactivateAccount(username);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("creator_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

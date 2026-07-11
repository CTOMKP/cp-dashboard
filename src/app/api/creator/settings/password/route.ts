import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { currentPassword, newPassword, confirmPassword } = body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json(
      { error: "All password fields are required" },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "New passwords do not match" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      accountType,
      mainAudience,
      country,
      language,
      telegramUsername,
      referralCode,
    } = body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !username?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!accountType || !mainAudience || !country || !language) {
      return NextResponse.json(
        { error: "Missing required profile fields" },
        { status: 400 }
      );
    }

    // TODO: Replace with real user registration service
    return NextResponse.json({
      success: true,
      message: "Creator account created",
      user: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        username: username.trim(),
        accountType,
        mainAudience,
        country,
        language,
        telegramUsername: telegramUsername?.trim() || null,
        referralCode: referralCode?.trim() || null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

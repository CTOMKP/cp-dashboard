import { NextRequest, NextResponse } from "next/server";
import {
  clearAllNotifications,
  getNotificationsState,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  maybeCreateDemoReferralNotification,
  removeNotification,
  simulateEarningNotification,
  simulatePayoutPaidNotification,
  simulateReferralNotification,
} from "@/lib/mock-notifications-store";

export async function GET() {
  maybeCreateDemoReferralNotification();

  return NextResponse.json({
    notifications: getNotificationsState(),
    unreadCount: getUnreadCount(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const type = (body as { type?: string }).type ?? "referral";

  const notification =
    type === "earning"
      ? simulateEarningNotification()
      : type === "payout"
        ? simulatePayoutPaidNotification()
        : simulateReferralNotification();

  return NextResponse.json({
    notification,
    notifications: getNotificationsState(),
    unreadCount: getUnreadCount(),
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, all } = body as { id?: string; all?: boolean };

  if (all) {
    markAllNotificationsRead();
    return NextResponse.json({
      notifications: getNotificationsState(),
      unreadCount: getUnreadCount(),
    });
  }

  if (!id) {
    return NextResponse.json(
      { error: "Notification id is required" },
      { status: 400 }
    );
  }

  markNotificationRead(id);

  return NextResponse.json({
    notifications: getNotificationsState(),
    unreadCount: getUnreadCount(),
  });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { id, all } = body as { id?: string; all?: boolean };

  if (all) {
    clearAllNotifications();
    return NextResponse.json({
      notifications: getNotificationsState(),
      unreadCount: getUnreadCount(),
    });
  }

  if (!id) {
    return NextResponse.json(
      { error: "Notification id is required" },
      { status: 400 }
    );
  }

  const removed = removeNotification(id);
  if (!removed) {
    return NextResponse.json(
      { error: "Notification not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    notifications: getNotificationsState(),
    unreadCount: getUnreadCount(),
  });
}

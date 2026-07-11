import { DollarSign, UserPlus, Wallet } from "lucide-react";
import { getNotificationIconClass } from "@/lib/notification-display";
import type { CreatorNotification } from "@/types/creator";

interface NotificationIconProps {
  notification: CreatorNotification;
  size?: "sm" | "md";
}

export default function NotificationIcon({
  notification,
  size = "md",
}: NotificationIconProps) {
  const dimensions = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const className = `${dimensions} shrink-0 flex items-center justify-center rounded-full ${getNotificationIconClass(notification.type)}`;

  if (notification.type === "new_earning") {
    return (
      <div className={className}>
        <DollarSign className={iconSize} />
      </div>
    );
  }

  if (notification.type === "payout_paid") {
    return (
      <div className={className}>
        <Wallet className={iconSize} />
      </div>
    );
  }

  return (
    <div className={className}>
      <UserPlus className={iconSize} />
    </div>
  );
}

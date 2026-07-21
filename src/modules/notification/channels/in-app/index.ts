import type { NotificationChannel, NotificationPayload } from "../../interfaces/channel";
import { prisma } from "@/lib/prisma";
import { NotificationChannelType } from "@prisma/client";

export class InAppChannel implements NotificationChannel {
  type = NotificationChannelType.IN_APP;

  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      await prisma.notification.create({
        data: {
          event: payload.event,
          recipientId: payload.recipientId,
          recipientRole: payload.recipientRole,
          title: payload.title,
          message: payload.message,
          channel: NotificationChannelType.IN_APP,
          status: "UNREAD",
        },
      });
      return true;
    } catch (err) {
      console.error("InAppChannel send error:", err);
      return false;
    }
  }
}

import type { Role, NotificationChannelType } from "@prisma/client";

export interface NotificationPayload {
  event: string;
  recipientId: string;
  recipientRole: Role;
  title: string;
  message: string;
}

export interface NotificationChannel {
  type: NotificationChannelType;
  send(payload: NotificationPayload): Promise<boolean>;
}

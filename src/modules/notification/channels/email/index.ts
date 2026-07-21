import type { NotificationChannel, NotificationPayload } from "../../interfaces/channel";
import { prisma } from "@/lib/prisma";
import { NotificationChannelType } from "@prisma/client";

export class EmailChannel implements NotificationChannel {
  type = NotificationChannelType.EMAIL;

  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      // Dapatkan email recipient dari database
      const user = await prisma.user.findUnique({
        where: { id: payload.recipientId },
        select: { email: true },
      });

      const emailAddress = user?.email || "unknown@nifascare.com";

      // Mock Email Sender
      console.log("-----------------------------------------");
      console.log(`[EMAIL SEND] To: ${emailAddress} (${payload.recipientRole})`);
      console.log(`[SUBJECT] ${payload.title}`);
      console.log(`[BODY] ${payload.message}`);
      console.log("-----------------------------------------");

      // Simpan riwayat email ke database sebagai audit log
      await prisma.notification.create({
        data: {
          event: payload.event,
          recipientId: payload.recipientId,
          recipientRole: payload.recipientRole,
          title: payload.title,
          message: payload.message,
          channel: NotificationChannelType.EMAIL,
          status: "READ", // email terkirim langsung ditandai terproses
        },
      });

      return true;
    } catch (err) {
      console.error("EmailChannel send error:", err);
      return false;
    }
  }
}

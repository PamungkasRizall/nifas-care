import type { Role } from "@prisma/client";
import { InAppChannel } from "../channels/in-app";
import { EmailChannel } from "../channels/email";
import { formatNotificationMessage, type TemplateVariables } from "../templates";

const channels = [
  new InAppChannel(),
  new EmailChannel(),
];

export class NotificationCenter {
  /**
   * Mengirim notifikasi terpusat via In-App (lonceng aplikasi) & Email secara bersamaan.
   */
  static async send(
    event: string,
    recipientId: string,
    recipientRole: Role,
    variables: TemplateVariables
  ): Promise<boolean> {
    try {
      // 1. Formulasi teks notifikasi dari template
      const { title, message } = formatNotificationMessage(event, variables);

      const payload = {
        event,
        recipientId,
        recipientRole,
        title,
        message,
      };

      // 2. Kirim via seluruh channel aktif
      const results = await Promise.all(
        channels.map((chan) => chan.send(payload))
      );

      return results.every((res) => res === true);
    } catch (err) {
      console.error("NotificationCenter.send error:", err);
      return false;
    }
  }
}

"use server";

import { auth } from "@/lib/auth/auth";
import { runReminderEngine } from "../engine";
import { revalidatePath } from "next/cache";

/**
 * Memicu jalannya Reminder Engine secara manual untuk simulasi/pengetesan.
 * Dapat diakses oleh admin, bidan, dokter, ahli gizi.
 */
export async function triggerReminderEngineAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const allowedRoles = ["ADMIN", "MIDWIFE", "DOCTOR", "NUTRITIONIST"];
    if (!allowedRoles.includes(session.user.role || "")) {
      throw new Error("Anda tidak memiliki hak akses untuk memicu reminder.");
    }

    const count = await runReminderEngine();

    revalidatePath("/dashboard");
    revalidatePath("/midwife");
    return { success: true, count };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

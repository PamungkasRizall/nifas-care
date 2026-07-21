"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OnboardingSchema } from "../../lib/validators";

export async function submitOnboarding(formData: unknown) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = session.user;

  if (user.role !== "MOTHER") {
    throw new Error("Only mothers can submit this onboarding");
  }

  if (user.status !== "PENDING_ONBOARDING") {
    throw new Error("You have already submitted the onboarding data");
  }

  const parsed = OnboardingSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.motherProfile.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
          education: data.education,
          occupation: data.occupation,
          address: data.address,
          deliveryDate: data.deliveryDate,
          deliveryMethod: data.deliveryMethod,
          gravida: data.gravida,
          parity: data.parity,
          abortus: data.abortus,
          babyName: data.babyName,
          babyGender: data.babyGender,
          birthWeight: data.birthWeight,
          birthLength: data.birthLength,
          hypertension: data.hypertension,
          diabetes: data.diabetes,
          preEclampsia: data.preEclampsia,
          anxietyDisorder: data.anxietyDisorder,
          depressionHistory: data.depressionHistory,
          emergencyContactName: data.emergencyContactName,
          emergencyContactRelationship: data.emergencyContactRelationship,
          emergencyContactPhone: data.emergencyContactPhone,
          privacyPolicyConsent: data.privacyPolicyConsent,
          dataProcessingConsent: data.dataProcessingConsent,
          researchParticipationConsent: data.researchParticipationConsent,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          status: "PENDING_MIDWIFE_REVIEW",
          name: data.fullName
        },
      });
    });
  } catch (error) {
    console.error("Failed to submit onboarding:", error);
    return {
      success: false,
      message: "Internal server error. Please try again later.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/pending");
}

import { z } from "zod";

export const OnboardingSchema = z.object({
  // Personal Info
  fullName: z.string().min(2, "Name is required"),
  phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/, "Invalid phone number format"),
  dateOfBirth: z.coerce.date({ error: "Tanggal lahir wajib diisi" }).refine((date) => date <= new Date(), { message: "Date cannot be in the future" }),
  education: z.string().min(1, "Education is required"),
  occupation: z.string().min(1, "Occupation is required"),
  address: z.string().min(5, "Address is required"),

  // Delivery Info
  deliveryDate: z.coerce.date({ error: "Tanggal persalinan wajib diisi" }).refine((date) => date <= new Date(), { message: "Date cannot be in the future" }),
  deliveryMethod: z.enum(["Normal", "Caesarean Section", "Vacuum", "Forceps"]),

  // Pregnancy Info
  gravida: z.coerce.number().int().positive("Must be positive"),
  parity: z.coerce.number().int().nonnegative("Must be non-negative"),
  abortus: z.coerce.number().int().nonnegative("Must be non-negative").optional(),

  // Baby Info
  babyName: z.string().optional(),
  babyGender: z.enum(["Male", "Female"]),
  birthWeight: z.coerce.number().positive("Birth weight must be a positive number"),
  birthLength: z.coerce.number().positive("Birth length must be a positive number"),

  // Medical History
  hypertension: z.boolean().default(false),
  diabetes: z.boolean().default(false),
  preEclampsia: z.boolean().default(false),
  anxietyDisorder: z.boolean().default(false),
  depressionHistory: z.boolean().default(false),

  // Emergency Contact
  emergencyContactName: z.string().min(2, "Name is required"),
  emergencyContactRelationship: z.string().min(2, "Relationship is required"),
  emergencyContactPhone: z.string().regex(/^\+?[0-9]{9,15}$/, "Invalid phone number format"),

  // Consent
  privacyPolicyConsent: z.boolean().refine((val) => val === true, "Must agree to Privacy Policy"),
  dataProcessingConsent: z.boolean().refine((val) => val === true, "Must agree to Data Processing"),
  researchParticipationConsent: z.boolean().refine((val) => val === true, "Must agree to Research Participation"),
});

export type OnboardingData = z.infer<typeof OnboardingSchema>;

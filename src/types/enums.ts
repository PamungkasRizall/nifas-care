export enum Role {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  MIDWIFE = "MIDWIFE",
  NUTRITIONIST = "NUTRITIONIST",
  MOTHER = "MOTHER",
  RESEARCHER = "RESEARCHER",
}

export enum UserStatus {
  PENDING_ONBOARDING = "PENDING_ONBOARDING",
  PENDING_MIDWIFE_REVIEW = "PENDING_MIDWIFE_REVIEW",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum VerificationStatus {
  APPROVED = "APPROVED",
  RETURNED = "RETURNED",
}

export enum AssessmentType {
  EPDS = "EPDS",
  MAGNESIUM = "MAGNESIUM",
}

export enum AssessmentStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum ReviewStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ScheduleTriggerType {
  POSTPARTUM_DAY = "POSTPARTUM_DAY",
  POSTPARTUM_WEEK = "POSTPARTUM_WEEK",
  CUSTOM = "CUSTOM",
}

export enum AssignmentStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
  OVERDUE = "OVERDUE",
}

export enum InterventionType {
  COUNSELING = "COUNSELING",
  EDUCATION = "EDUCATION",
  REFERRAL = "REFERRAL",
  HOME_VISIT = "HOME_VISIT",
  PSYCHOTHERAPY = "PSYCHOTHERAPY",
}

export enum NotificationChannelType {
  IN_APP = "IN_APP",
  EMAIL = "EMAIL",
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
}

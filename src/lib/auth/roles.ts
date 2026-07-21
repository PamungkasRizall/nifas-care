export const ROLES = [
  "ADMIN",
  "DOCTOR",
  "MIDWIFE",
  "NUTRITIONIST",
  "MOTHER",
  "RESEARCHER",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  MIDWIFE: "/midwife",
  NUTRITIONIST: "/nutritionist",
  MOTHER: "/dashboard",
  RESEARCHER: "/research",
};

interface ProtectedRoute {
  prefix: string;
  roles: Role[];
}

export const PROTECTED_ROUTES: ProtectedRoute[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/doctor", roles: ["DOCTOR", "ADMIN"] },
  { prefix: "/midwife", roles: ["MIDWIFE", "ADMIN"] },
  { prefix: "/nutritionist", roles: ["NUTRITIONIST", "ADMIN"] },
  { prefix: "/research", roles: ["RESEARCHER", "ADMIN"] },
  { prefix: "/dashboard", roles: ["MOTHER", "ADMIN"] },
];

export const PROFILE_ROUTE_PREFIX = "/profile";

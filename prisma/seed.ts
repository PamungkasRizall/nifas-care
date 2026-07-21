import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { Role, UserStatus } from "@prisma/client";

import { seedAssessmentSchedules } from "../src/modules/assessment/schedule/seeder/index";

async function main() {
  console.log("Memulai proses seeding User...");

  const roles = Object.values(Role);
  const defaultPassword = "123456";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  for (const role of roles) {
    const email = `${role.toLowerCase()}@nifascare.com`;
    const name = `${role.charAt(0) + role.slice(1).toLowerCase()} User`;

    await prisma.user.upsert({
      where: { email },
      update: {
        role,
        status: UserStatus.PENDING_ONBOARDING,
      },
      create: {
        name,
        email,
        password: hashedPassword,
        role,
        status: UserStatus.PENDING_ONBOARDING,
      },
    });

    console.log(`User created/updated: ${name} (${email}) - Password: ${defaultPassword}`);
  }

  console.log("Seeding User selesai.");

  console.log("Memulai proses seeding Assessment Schedules & Master Data...");
  await seedAssessmentSchedules();
  console.log("Seeding Assessment Schedules & Master Data selesai.");
}

main()
  .catch((e) => {
    console.error("Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

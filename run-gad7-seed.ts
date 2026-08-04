import "dotenv/config";
import { seedAssessmentSchedules } from "./src/modules/assessment/schedule/seeder/index";
import { prisma } from "./src/lib/prisma";

async function main() {
  console.log("Memulai proses seeding GAD-7...");
  await seedAssessmentSchedules();
  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

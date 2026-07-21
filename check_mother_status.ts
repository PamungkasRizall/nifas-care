import "dotenv/config";
import { prisma } from "@/lib/prisma";

async function check() {
  const mothers = await prisma.user.findMany({
    where: { role: "MOTHER" },
    include: { motherProfile: true }
  });

  console.log("=== MOTHERS IN DATABASE ===");
  for (const m of mothers) {
    console.log(`\n- User ID: ${m.id}`);
    console.log(`  Name: ${m.name}`);
    console.log(`  Email: ${m.email}`);
    console.log(`  Status: ${m.status}`);
    console.log(`  Profile exists: ${Boolean(m.motherProfile)}`);
    if (m.motherProfile) {
      console.log(`  Delivery Date: ${m.motherProfile.deliveryDate}`);
      const delivery = new Date(m.motherProfile.deliveryDate!);
      const today = new Date();
      delivery.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today.getTime() - delivery.getTime());
      const daysPostpartum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      console.log(`  Days Postpartum: ${daysPostpartum}`);
    }

    const assignments = await prisma.assignment.findMany({
      where: { motherId: m.id }
    });
    console.log(`  Assignments count: ${assignments.length}`);
    for (const a of assignments) {
      console.log(`    * [${a.type}] ${a.title} - Status: ${a.status}`);
    }
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

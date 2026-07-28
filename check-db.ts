import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.food.findMany().then(foods => {
  console.log('Foods count:', foods.length);
  process.exit(0);
});

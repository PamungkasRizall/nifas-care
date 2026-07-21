import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding Master Data Magnesium...");

  // ==========================================
  // 1. SEED FOOD CATEGORY
  // ==========================================
  console.log("⚙️ Seeding Food Categories...");
  const categories = [
    { code: "VEGETABLE", name: "Sayuran" },
    { code: "LEGUME", name: "Kacang-kacangan" },
    { code: "SEED", name: "Biji-bijian" },
    { code: "NUT", name: "Kacang Pohon" },
    { code: "GRAIN", name: "Serealia" },
    { code: "FRUIT", name: "Buah" },
    { code: "SEAFOOD", name: "Seafood" },
    { code: "FISH", name: "Ikan" },
    { code: "MEAT", name: "Daging" },
    { code: "DAIRY", name: "Suku & Olahan" },
    { code: "BEVERAGE", name: "Minuman" },
  ];

  for (const cat of categories) {
    await prisma.foodCategory.upsert({
      where: { code: cat.code },
      update: { name: cat.name },
      create: { code: cat.code, name: cat.name },
    });
  }

  // ==========================================
  // 2. SEED FOOD
  // ==========================================
  console.log("⚙️ Seeding Foods...");
  const foods = [
    { code: "BAYAM", name: "Bayam", categoryCode: "VEGETABLE" },
    { code: "KANGKUNG", name: "Kangkung", categoryCode: "VEGETABLE" },
    { code: "BROKOLI", name: "Brokoli", categoryCode: "VEGETABLE" },
    { code: "SAWI_HIJAU", name: "Sawi Hijau", categoryCode: "VEGETABLE" },
    { code: "EDAMAME", name: "Edamame", categoryCode: "LEGUME" },
    { code: "KEDELAI", name: "Kedelai Rebus", categoryCode: "LEGUME" },
    { code: "TEMPE", name: "Tempe", categoryCode: "LEGUME" },
    { code: "TAHU", name: "Tahu", categoryCode: "LEGUME" },
    { code: "ALMOND", name: "Almond", categoryCode: "NUT" },
    { code: "KACANG_MEDE", name: "Kacang Mede", categoryCode: "NUT" },
    { code: "KACANG_TANAH", name: "Kacang Tanah", categoryCode: "LEGUME" },
    { code: "BIJI_LABU", name: "Biji Labu", categoryCode: "SEED" },
    { code: "BIJI_BUNGA_MATAHARI", name: "Biji Bunga Matahari", categoryCode: "SEED" },
    { code: "OATMEAL", name: "Oatmeal", categoryCode: "GRAIN" },
    { code: "BERAS_MERAH", name: "Beras Merah", categoryCode: "GRAIN" },
    { code: "PISANG", name: "Pisang", categoryCode: "FRUIT" },
    { code: "ALPUKAT", name: "Alpukat", categoryCode: "FRUIT" },
    { code: "IKAN_KEMBUNG", name: "Ikan Kembung", categoryCode: "FISH" },
    { code: "IKAN_TUNA", name: "Tuna", categoryCode: "FISH" },
    { code: "UDANG", name: "Udang", categoryCode: "SEAFOOD" },
    { code: "SUSU", name: "Suku", categoryCode: "DAIRY" },
  ];

  for (const food of foods) {
    await prisma.food.upsert({
      where: { code: food.code },
      update: { name: food.name, categoryCode: food.categoryCode },
      create: { code: food.code, name: food.name, categoryCode: food.categoryCode },
    });
  }

  // ==========================================
  // 3 & 4. SEED SERVING & MAGNESIUM CONTENT
  // ==========================================
  console.log("⚙️ Seeding Servings and Magnesium Contents...");
  const servings = [
    // Bayam
    { foodCode: "BAYAM", name: "100 gram", gramEquivalent: 100, magnesiumMg: 79 },
    { foodCode: "BAYAM", name: "1 Mangkok", gramEquivalent: 180, magnesiumMg: 142 },
    // Kangkung
    { foodCode: "KANGKUNG", name: "100 gram", gramEquivalent: 100, magnesiumMg: 34 },
    // Brokoli
    { foodCode: "BROKOLI", name: "100 gram", gramEquivalent: 100, magnesiumMg: 21 },
    // Sawi Hijau
    { foodCode: "SAWI_HIJAU", name: "100 gram", gramEquivalent: 100, magnesiumMg: 19 },
    // Edamame
    { foodCode: "EDAMAME", name: "100 gram", gramEquivalent: 100, magnesiumMg: 61 },
    // Kedelai Rebus
    { foodCode: "KEDELAI", name: "100 gram", gramEquivalent: 100, magnesiumMg: 86 },
    // Tempe
    { foodCode: "TEMPE", name: "50 gram", gramEquivalent: 50, magnesiumMg: 40.5 }, // Diambil proporsional dari data 100gr=81
    { foodCode: "TEMPE", name: "100 gram", gramEquivalent: 100, magnesiumMg: 81 },
    // Tahu
    { foodCode: "TAHU", name: "100 gram", gramEquivalent: 100, magnesiumMg: 30 },
    // Almond
    { foodCode: "ALMOND", name: "30 gram", gramEquivalent: 30, magnesiumMg: 80 },
    { foodCode: "ALMOND", name: "100 gram", gramEquivalent: 100, magnesiumMg: 268 },
    // Kacang Mede
    { foodCode: "KACANG_MEDE", name: "30 gram", gramEquivalent: 30, magnesiumMg: 82 },
    // Kacang Tanah
    { foodCode: "KACANG_TANAH", name: "100 gram", gramEquivalent: 100, magnesiumMg: 168 },
    // Biji Labu
    { foodCode: "BIJI_LABU", name: "30 gram", gramEquivalent: 30, magnesiumMg: 156 },
    { foodCode: "BIJI_LABU", name: "100 gram", gramEquivalent: 100, magnesiumMg: 535 },
    // Biji Bunga Matahari
    { foodCode: "BIJI_BUNGA_MATAHARI", name: "30 gram", gramEquivalent: 30, magnesiumMg: 98 },
    // Oatmeal
    { foodCode: "OATMEAL", name: "100 gram", gramEquivalent: 100, magnesiumMg: 177 },
    // Beras Merah
    { foodCode: "BERAS_MERAH", name: "100 gram", gramEquivalent: 100, magnesiumMg: 43 },
    // Pisang
    { foodCode: "PISANG", name: "100 gram", gramEquivalent: 100, magnesiumMg: 27 },
    // Alpukat
    { foodCode: "ALPUKAT", name: "100 gram", gramEquivalent: 100, magnesiumMg: 29 },
    // Ikan Kembung
    { foodCode: "IKAN_KEMBUNG", name: "100 gram", gramEquivalent: 100, magnesiumMg: 76 },
    // Tuna
    { foodCode: "IKAN_TUNA", name: "100 gram", gramEquivalent: 100, magnesiumMg: 50 },
    // Udang
    { foodCode: "UDANG", name: "100 gram", gramEquivalent: 100, magnesiumMg: 39 },
    // Susu (Disimpan 250ml ekuivalen 250 gram untuk simplisitas sistem)
    { foodCode: "SUSU", name: "250 ml", gramEquivalent: 250, magnesiumMg: 27 },
  ];

  for (const serving of servings) {
    await prisma.foodServing.upsert({
      // Menggunakan kombinasi unique composite key jika ada, atau dicari berdasarkan kecocokan nama & foodCode
      where: {
        foodCode_name: {
          foodCode: serving.foodCode,
          name: serving.name,
        },
      },
      update: {
        gramEquivalent: serving.gramEquivalent,
        magnesiumMg: serving.magnesiumMg,
      },
      create: {
        foodCode: serving.foodCode,
        name: serving.name,
        gramEquivalent: serving.gramEquivalent,
        magnesiumMg: serving.magnesiumMg,
      },
    });
  }

  // ==========================================
  // 5. SEED DAILY MAGNESIUM TARGET
  // ==========================================
  console.log("⚙️ Seeding Daily Targets...");
  await prisma.dailyMagnesiumTarget.upsert({
    where: { group: "IBU_NIFAS" },
    update: { targetMg: 320 },
    create: { group: "IBU_NIFAS", label: "Ibu Nifas", targetMg: 320 },
  });

  // ==========================================
  // 6. SEED INTERPRETATION RULES
  // ==========================================
  console.log("⚙️ Seeding Interpretation Rules...");
  const rules = [
    { minMg: 0, maxMg: 249, status: "SANGAT_KURANG", label: "Sangat Kurang" },
    { minMg: 250, maxMg: 359, status: "KURANG", label: "Kurang" },
    { minMg: 320, maxMg: 450, status: "CUKUP", label: "Cukup" },
    { minMg: 451, maxMg: 600, status: "TINGGI", label: "Tinggi" },
    { minMg: 601, maxMg: 9999, status: "SANGAT_TINGGI", label: "Sangat Tinggi" }, // 9999 sebagai batas atas aman murni integer
  ];

  for (const rule of rules) {
    await prisma.magnesiumInterpretationRule.upsert({
      where: { status: rule.status },
      update: { minMg: rule.minMg, maxMg: rule.maxMg, label: rule.label },
      create: { status: rule.status, minMg: rule.minMg, maxMg: rule.maxMg, label: rule.label },
    });
  }

  console.log("✅ Seeding selesai! Seluruh Master Data berhasil di-insert.");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

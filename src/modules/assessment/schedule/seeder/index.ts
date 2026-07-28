import { prisma } from "@/lib/prisma";
import { EPDS_QUESTIONS } from "@/modules/epds/questions";

/**
 * Seed data awal untuk Assessment Template dan Schedules.
 * EPDS: Hari 14 (Skrining 1), Hari 28 (Skrining 2), Hari 42 (Skrining 3).
 */
export async function seedAssessmentSchedules(): Promise<void> {
  // 1. Buat Template EPDS jika belum ada
  const epdsTemplate = await prisma.assessmentTemplate.upsert({
    where: { code: "EPDS" },
    update: {},
    create: {
      code: "EPDS",
      name: "Edinburgh Postnatal Depression Scale (EPDS)",
      description: "Skrining kesehatan mental dan kecemasan ibu postpartum.",
      version: "1.0",
      isActive: true,
    },
  });

  // 2. Buat Schedules untuk EPDS jika belum ada
  const schedulesData = [
    { triggerType: "POSTPARTUM_DAY" as const, triggerValue: 14, sequence: 1 },
    { triggerType: "POSTPARTUM_DAY" as const, triggerValue: 28, sequence: 2 },
    { triggerType: "POSTPARTUM_DAY" as const, triggerValue: 42, sequence: 3 },
  ];

  for (const s of schedulesData) {
    const existing = await prisma.assessmentSchedule.findFirst({
      where: {
        templateId: epdsTemplate.id,
        sequence: s.sequence,
      },
    });

    if (!existing) {
      await prisma.assessmentSchedule.create({
        data: {
          templateId: epdsTemplate.id,
          triggerType: s.triggerType,
          triggerValue: s.triggerValue,
          sequence: s.sequence,
          isActive: true,
        },
      });
    }
  }

  // 3. Seed EPDS Questions and Options
  for (let i = 0; i < EPDS_QUESTIONS.length; i++) {
    const qSrc = EPDS_QUESTIONS[i];
    const question = await prisma.assessmentQuestion.upsert({
      where: {
        templateId_code: {
          templateId: epdsTemplate.id,
          code: qSrc.id,
        },
      },
      update: {
        title: qSrc.text,
        order: i + 1,
        required: true,
        isActive: true,
      },
      create: {
        templateId: epdsTemplate.id,
        code: qSrc.id,
        title: qSrc.text,
        order: i + 1,
        required: true,
        isActive: true,
      },
    });

    // Delete existing options for this question to ensure clean state
    await prisma.assessmentOption.deleteMany({
      where: { questionId: question.id },
    });

    // Create options
    for (let j = 0; j < qSrc.options.length; j++) {
      const oSrc = qSrc.options[j];
      await prisma.assessmentOption.create({
        data: {
          questionId: question.id,
          label: oSrc.text,
          score: oSrc.score,
          order: j + 1,
        },
      });
    }
  }

  // 4. Seed EPDS Interpretations
  const interpretationsData = [
    { minScore: 0, maxScore: 9, interpretation: "Normal", priority: "LOW" },
    { minScore: 10, maxScore: 12, interpretation: "Risiko Depresi", priority: "HIGH" },
    { minScore: 13, maxScore: 30, interpretation: "Probable Depression", priority: "HIGH" },
  ];

  await prisma.assessmentInterpretation.deleteMany({
    where: { templateId: epdsTemplate.id },
  });

  for (const interp of interpretationsData) {
    await prisma.assessmentInterpretation.create({
      data: {
        templateId: epdsTemplate.id,
        minScore: interp.minScore,
        maxScore: interp.maxScore,
        interpretation: interp.interpretation,
        priority: interp.priority,
      },
    });
  }

  // 5. Seed EPDS Red Flag Rule
  await prisma.redFlagRule.deleteMany({
    where: { templateId: epdsTemplate.id },
  });

  await prisma.redFlagRule.create({
    data: {
      templateId: epdsTemplate.id,
      questionCode: "epds_q10",
      triggerScore: 1, // trigger if score >= 1
      overridePriority: "URGENT",
      note: "Pikiran menyakiti diri sendiri",
    },
  });

  // 6. Seed EPDS Clinical Decision Rules
  await prisma.clinicalDecisionRule.deleteMany({
    where: { templateId: epdsTemplate.id },
  });

  const decisionRules = [
    { priority: "LOW", decision: "Observasi", interventions: ["EDUCATION"] },
    { priority: "HIGH", decision: "Konseling Bidan → Review Dokter", interventions: ["COUNSELING", "HOME_VISIT"] },
    { priority: "URGENT", decision: "Review Dokter Segera", interventions: ["REFERRAL", "PSYCHOTHERAPY"] },
  ];

  for (const rule of decisionRules) {
    await prisma.clinicalDecisionRule.create({
      data: {
        templateId: epdsTemplate.id,
        priority: rule.priority,
        decision: rule.decision,
        interventions: rule.interventions,
      },
    });
  }

  // 7. Seed EPDS Follow Up Rules
  await prisma.followUpRule.deleteMany({
    where: { templateId: epdsTemplate.id },
  });

  const followUpRules = [
    { priority: "LOW", days: 14 },
    { priority: "HIGH", days: 7 },
    { priority: "URGENT", days: 1 },
  ];

  for (const rule of followUpRules) {
    await prisma.followUpRule.create({
      data: {
        templateId: epdsTemplate.id,
        priority: rule.priority,
        days: rule.days,
      },
    });
  }

  // 8. Buat Template Magnesium jika belum ada
  const magTemplate = await prisma.assessmentTemplate.upsert({
    where: { code: "MAGNESIUM" },
    update: {},
    create: {
      code: "MAGNESIUM",
      name: "Skrining Asupan Magnesium Harian",
      description: "Skrining asupan gizi magnesium harian bagi Ibu postpartum.",
      version: "1.0",
      isActive: true,
    },
  });

  // 9. Buat Schedules untuk Magnesium jika belum ada (Hari ke-14 dan Hari ke-28)
  const magSchedulesData = [
    { triggerType: "POSTPARTUM_DAY" as const, triggerValue: 14, sequence: 1 },
    { triggerType: "POSTPARTUM_DAY" as const, triggerValue: 28, sequence: 2 },
  ];

  for (const s of magSchedulesData) {
    const existing = await prisma.assessmentSchedule.findFirst({
      where: {
        templateId: magTemplate.id,
        sequence: s.sequence,
      },
    });

    if (!existing) {
      await prisma.assessmentSchedule.create({
        data: {
          templateId: magTemplate.id,
          triggerType: s.triggerType,
          triggerValue: s.triggerValue,
          sequence: s.sequence,
          isActive: true,
        },
      });
    }
  }

  // 10. Buat Magnesium Master Data
  // Categories
  const categoriesData = [
    "Sayuran",
    "Kacang-kacangan",
    "Biji-bijian",
    "Buah",
    "Seafood",
    "Ikan",
    "Daging",
    "Telur",
    "Susu dan Produk Olahan",
    "Minuman",
    "Lainnya"
  ];
  const categoriesMap: Record<string, string> = {};
  for (const name of categoriesData) {
    const cat = await prisma.foodCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoriesMap[name] = cat.id;
  }

  const foodsData = [
    {
      name: "Bayam",
      category: "Sayuran",
      servings: [
        { name: "1 Mangkok (180 g)", weight: 180, magnesium: 142 },
        { name: "100 g", weight: 100, magnesium: 79 }
      ]
    },
    {
      name: "Kangkung",
      category: "Sayuran",
      servings: [
        { name: "1 Piring (100 g)", weight: 100, magnesium: 79 }
      ]
    },
    {
      name: "Brokoli",
      category: "Sayuran",
      servings: [
        { name: "1 Mangkok (150 g)", weight: 150, magnesium: 33 }
      ]
    },
    {
      name: "Daun Singkong",
      category: "Sayuran",
      servings: [
        { name: "1 Piring (100 g)", weight: 100, magnesium: 65 }
      ]
    },
    {
      name: "Kedelai",
      category: "Kacang-kacangan",
      servings: [
        { name: "100 g rebus", weight: 100, magnesium: 86 },
        { name: "50 g rebus", weight: 50, magnesium: 43 }
      ]
    },
    {
      name: "Almond",
      category: "Kacang-kacangan",
      servings: [
        { name: "30 g", weight: 30, magnesium: 80 },
        { name: "100 g", weight: 100, magnesium: 268 }
      ]
    },
    {
      name: "Kacang Tanah",
      category: "Kacang-kacangan",
      servings: [
        { name: "50 g", weight: 50, magnesium: 84 },
        { name: "100 g", weight: 100, magnesium: 168 }
      ]
    },
    {
      name: "Biji Labu",
      category: "Biji-bijian",
      servings: [
        { name: "30 g", weight: 30, magnesium: 150 }
      ]
    },
    {
      name: "Oatmeal",
      category: "Biji-bijian",
      servings: [
        { name: "1 Mangkok (234 g)", weight: 234, magnesium: 61 }
      ]
    },
    {
      name: "Pisang",
      category: "Buah",
      servings: [
        { name: "1 Buah Sedang", weight: 118, magnesium: 32 },
        { name: "100 g", weight: 100, magnesium: 27 }
      ]
    },
    {
      name: "Alpukat",
      category: "Buah",
      servings: [
        { name: "1 Buah Sedang", weight: 200, magnesium: 58 },
        { name: "100 g", weight: 100, magnesium: 29 }
      ]
    },
    {
      name: "Udang",
      category: "Seafood",
      servings: [
        { name: "100 g rebus", weight: 100, magnesium: 39 }
      ]
    },
    {
      name: "Kerang",
      category: "Seafood",
      servings: [
        { name: "100 g", weight: 100, magnesium: 34 }
      ]
    },
    {
      name: "Ikan Teri",
      category: "Ikan",
      servings: [
        { name: "50 g kering", weight: 50, magnesium: 61 }
      ]
    },
    {
      name: "Ikan Tongkol",
      category: "Ikan",
      servings: [
        { name: "1 Potong Sedang (50 g)", weight: 50, magnesium: 32 },
        { name: "100 g", weight: 100, magnesium: 64 }
      ]
    },
    {
      name: "Daging Ayam",
      category: "Daging",
      servings: [
        { name: "1 Potong Sedang (100 g)", weight: 100, magnesium: 23 }
      ]
    },
    {
      name: "Daging Sapi",
      category: "Daging",
      servings: [
        { name: "1 Potong Sedang (100 g)", weight: 100, magnesium: 21 }
      ]
    },
    {
      name: "Telur Ayam",
      category: "Telur",
      servings: [
        { name: "1 Butir (50 g)", weight: 50, magnesium: 6 },
        { name: "100 g", weight: 100, magnesium: 12 }
      ]
    },
    {
      name: "Telur Bebek",
      category: "Telur",
      servings: [
        { name: "1 Butir (70 g)", weight: 70, magnesium: 12 },
        { name: "100 g", weight: 100, magnesium: 17 }
      ]
    },
    {
      name: "Susu Sapi",
      category: "Susu dan Produk Olahan",
      servings: [
        { name: "1 Gelas (200 ml)", weight: 200, magnesium: 22 }
      ]
    },
    {
      name: "Keju",
      category: "Susu dan Produk Olahan",
      servings: [
        { name: "1 Lembar (20 g)", weight: 20, magnesium: 6 },
        { name: "50 g", weight: 50, magnesium: 14 }
      ]
    },
    {
      name: "Yoghurt",
      category: "Susu dan Produk Olahan",
      servings: [
        { name: "1 Cup (150 g)", weight: 150, magnesium: 17 }
      ]
    },
    {
      name: "Susu Kedelai",
      category: "Minuman",
      servings: [
        { name: "1 Gelas (200 ml)", weight: 200, magnesium: 30 }
      ]
    },
    {
      name: "Air Kelapa",
      category: "Minuman",
      servings: [
        { name: "1 Gelas (250 ml)", weight: 250, magnesium: 60 }
      ]
    },
    {
      name: "Dark Chocolate (Cokelat Hitam)",
      category: "Lainnya",
      servings: [
        { name: "30 g (1 bar kecil)", weight: 30, magnesium: 68 },
        { name: "100 g", weight: 100, magnesium: 228 }
      ]
    }
  ];

  for (const f of foodsData) {
    const catId = categoriesMap[f.category];
    if (!catId) continue;
    const food = await prisma.food.upsert({
      where: { name: f.name },
      update: { categoryId: catId },
      create: { name: f.name, categoryId: catId },
    });

    for (const s of f.servings) {
      const existingServing = await prisma.foodServing.findFirst({
        where: { foodId: food.id, name: s.name }
      });
      if (!existingServing) {
        await prisma.foodServing.create({
          data: {
            foodId: food.id,
            name: s.name,
            weight: s.weight,
            magnesium: s.magnesium
          }
        });
      } else {
        await prisma.foodServing.update({
          where: { id: existingServing.id },
          data: {
            weight: s.weight,
            magnesium: s.magnesium
          }
        });
      }
    }
  }

  // Target AKG
  const existingTarget = await prisma.magnesiumTarget.findFirst();
  if (!existingTarget) {
    await prisma.magnesiumTarget.create({
      data: {
        target: 360,
        isActive: true,
      }
    });
  } else {
    await prisma.magnesiumTarget.update({
      where: { id: existingTarget.id },
      data: { target: 360 }
    });
  }

  // Interpretation Rules
  await prisma.magnesiumInterpretationRule.deleteMany();

  const rules = [
    { 
      minPercent: 0, maxPercent: 49.9, status: "Sangat Kurang", 
      interpretation: "Kondisi: Asupan nutrisi magnesium sangat minim dan jauh di bawah kebutuhan pemulihan tubuh serta produksi ASI.\nTindakan: Memerlukan evaluasi menu makanan serta konseling gizi mendesak dari ahli gizi/tenaga kesehatan." 
    },
    { 
      minPercent: 50, maxPercent: 89.9, status: "Kurang", 
      interpretation: "Kondisi: Asupan magnesium belum mencukupi kebutuhan harian ibu nifas/menyusui.\nTindakan: Edukasi penambahan porsi atau variasi bahan makanan tinggi magnesium (seperti kacang-kacangan, biji-bijian, sayuran hijau, dan pisang)." 
    },
    { 
      minPercent: 90, maxPercent: 120, status: "Cukup", 
      interpretation: "Kondisi: Asupan nutrisi magnesium ideal dan telah memenuhi kebutuhan tubuh harian dengan baik.\nTindakan: Pertahankan pola makan seimbang." 
    },
    { 
      minPercent: 120.1, maxPercent: 9999, status: "Tinggi", 
      interpretation: "Kondisi: Asupan harian melebihi estimasi kebutuhan rata-rata.\nTindakan: Jika bersumber dari makanan alami, umumnya aman (tolerable upper intake level dari makanan alamiah tidak terbatas). Namun, pastikan tidak ada efek samping pencernaan (seperti diare) jika ibu mengonsumsi suplemen tambahan." 
    }
  ];

  for (const r of rules) {
    await prisma.magnesiumInterpretationRule.create({
      data: r
    });
  }

  console.log("seedAssessmentSchedules: Seed templates, schedules, EPDS & Magnesium master data sukses.");
}

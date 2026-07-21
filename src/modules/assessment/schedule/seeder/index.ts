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

  // Foods and Servings
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
        target: 320,
        isActive: true,
      }
    });
  }

  // Interpretation Rules
  const rules = [
    { minPercent: 0, maxPercent: 99.9, status: "Kurang", interpretation: "Asupan magnesium harian Anda kurang dari target AKG. Disarankan untuk meningkatkan konsumsi makanan tinggi magnesium seperti bayam, kedelai, atau kacang almond." },
    { minPercent: 100, maxPercent: 9999, status: "Cukup", interpretation: "Asupan magnesium harian Anda telah memenuhi target AKG. Pertahankan pola makan sehat Anda!" }
  ];

  for (const r of rules) {
    const existingRule = await prisma.magnesiumInterpretationRule.findFirst({
      where: { status: r.status }
    });
    if (!existingRule) {
      await prisma.magnesiumInterpretationRule.create({
        data: r
      });
    } else {
      await prisma.magnesiumInterpretationRule.update({
        where: { id: existingRule.id },
        data: r
      });
    }
  }

  console.log("seedAssessmentSchedules: Seed templates, schedules, EPDS & Magnesium master data sukses.");
}

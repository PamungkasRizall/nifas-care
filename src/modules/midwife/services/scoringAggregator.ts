import { prisma } from "@/lib/prisma";
import { EPDS_QUESTIONS } from "@/modules/epds/questions";
import { GAD7_QUESTIONS } from "@/modules/gad7/questions";

export interface EpdsScoreItem {
  sequence: number;
  label: string;
  score: number;
  score3A: number;
  riskStatus: "LOW" | "HIGH" | "URGENT";
  riskLabel: string;
  completedAt: string | null;
  assessmentId: string;
}

export interface MagnesiumScoreItem {
  day: number;
  label: string;
  intakeMg: number;
  riskStatus: "LOW" | "HIGH" | "URGENT";
  riskLabel: string;
  completedAt: string | null;
  assessmentId: string;
}

export interface Gad7ScoreItem {
  sequence: number;
  label: string;
  score: number;
  riskStatus: "LOW" | "HIGH" | "URGENT";
  riskLabel: string;
  completedAt: string | null;
  assessmentId: string;
}

export interface DailyMoodItem {
  id: string;
  score: number;
  emoji: string;
  label: string;
  note: string | null;
  date: string;
}

export interface MotherScoreSummary {
  epdsList: EpdsScoreItem[];
  magnesiumList: MagnesiumScoreItem[];
  gad7List: Gad7ScoreItem[];
  moodList: DailyMoodItem[];
  epdsSlotMap: Record<number, EpdsScoreItem>;
  magnesiumSlotMap: Record<number, MagnesiumScoreItem>;
  latestEpds?: EpdsScoreItem;
  latestMagnesium?: MagnesiumScoreItem;
  latestGad7?: Gad7ScoreItem;
}

/**
 * Pre-load all lookup tables once to allow fast, synchronous in-memory score calculation.
 */
export async function getScoringReferenceData() {
  const [
    foodServings,
    epdsQuestionsDb,
    gad7QuestionsDb,
    epdsInterpretations,
    gad7Template,
    magTarget,
    magRules,
  ] = await Promise.all([
    prisma.foodServing.findMany({ select: { id: true, magnesium: true } }),
    prisma.assessmentQuestion.findMany({
      where: { template: { code: "EPDS" }, isActive: true },
      include: { options: { orderBy: { order: "asc" } } },
    }),
    prisma.assessmentQuestion.findMany({
      where: { template: { code: "GAD7" }, isActive: true },
      include: { options: { orderBy: { order: "asc" } } },
    }),
    prisma.assessmentInterpretation.findMany({
      where: { template: { code: "EPDS" } },
    }),
    prisma.assessmentTemplate.findUnique({
      where: { code: "GAD7" },
      include: { interpretations: true },
    }),
    prisma.magnesiumTarget.findFirst({ where: { isActive: true } }),
    prisma.magnesiumInterpretationRule.findMany({ orderBy: { minPercent: "asc" } }),
  ]);

  const servingMap = new Map<string, number>(
    foodServings.map((s) => [s.id, s.magnesium])
  );

  return {
    servingMap,
    epdsQuestionsDb,
    gad7QuestionsDb,
    epdsInterpretations,
    gad7Interpretations: gad7Template?.interpretations || [],
    magTarget: magTarget?.target || 320,
    magRules,
  };
}

export type ScoringReferences = Awaited<ReturnType<typeof getScoringReferenceData>>;

export function computeMotherScoreSummary(
  mother: {
    id: string;
    assessments: Array<{
      id: string;
      type: string;
      status: string;
      answers: unknown;
      submittedAt: Date | null;
      completedAt: Date | null;
      createdAt: Date;
      assignment?: { title: string } | null;
    }>;
    dailyMoods?: Array<{
      id: string;
      score: number;
      emoji: string;
      label: string;
      note: string | null;
      date: Date;
    }>;
  },
  refs: ScoringReferences
): MotherScoreSummary {
  // 1. Filter completed/submitted assessments
  const validAssessments = mother.assessments.filter((a) =>
    ["SUBMITTED", "UNDER_REVIEW", "COMPLETED", "REJECTED"].includes(a.status)
  );

  // Sort ascending by time for chronological sequence mapping
  const sorted = [...validAssessments].sort((a, b) => {
    const timeA = new Date(a.completedAt || a.submittedAt || a.createdAt).getTime();
    const timeB = new Date(b.completedAt || b.submittedAt || b.createdAt).getTime();
    return timeA - timeB;
  });

  // 2. EPDS Evaluations
  const epdsAssessments = sorted.filter((a) => a.type === "EPDS");
  const epdsList: EpdsScoreItem[] = [];
  const epdsSlotMap: Record<number, EpdsScoreItem> = {};

  epdsAssessments.forEach((a, idx) => {
    // Attempt to extract sequence from assignment title, fallback to chronological index + 1
    let seq = idx + 1;
    if (a.assignment?.title) {
      const match = a.assignment.title.match(/Skrining Ke-(\d+)/i);
      if (match && match[1]) {
        seq = parseInt(match[1], 10);
      }
    }

    const answers = (a.answers as Record<string, unknown>) || {};
    let totalScore = 0;
    let score3A = 0;

    // Calculate total score & EPDS-3A score (questions q3, q4, q5)
    if (refs.epdsQuestionsDb.length > 0) {
      for (const q of refs.epdsQuestionsDb) {
        const ansIdx = answers[q.code];
        if (ansIdx !== undefined && ansIdx !== null) {
          const opt = q.options[Number(ansIdx)];
          if (opt) {
            totalScore += opt.score;
            if (["epds_q3", "epds_q4", "epds_q5"].includes(q.code)) {
              score3A += opt.score;
            }
          }
        }
      }
    } else {
      // Fallback static
      for (const q of EPDS_QUESTIONS) {
        const ansIdx = answers[q.id];
        if (typeof ansIdx === "number" || typeof ansIdx === "string") {
          const opt = q.options[Number(ansIdx)];
          if (opt) {
            totalScore += opt.score;
            if (["epds_q3", "epds_q4", "epds_q5"].includes(q.id)) {
              score3A += opt.score;
            }
          }
        }
      }
    }

    // Interpretation
    let riskStatus: "LOW" | "HIGH" | "URGENT" = "LOW";
    let riskLabel = "Normal";

    const matchedInterp = refs.epdsInterpretations.find(
      (i) => totalScore >= i.minScore && totalScore <= i.maxScore
    );
    if (matchedInterp) {
      riskStatus = matchedInterp.priority as "LOW" | "HIGH" | "URGENT";
      riskLabel = matchedInterp.interpretation;
    } else {
      if (totalScore >= 13) {
        riskStatus = "HIGH";
        riskLabel = "Probable Depression";
      } else if (totalScore >= 10) {
        riskStatus = "HIGH";
        riskLabel = "Risiko Depresi";
      } else {
        riskStatus = "LOW";
        riskLabel = "Normal";
      }
    }

    const item: EpdsScoreItem = {
      sequence: seq,
      label: `EPDS-${seq}${seq % 2 === 1 ? " (Pre)" : " (Post)"}`,
      score: totalScore,
      score3A,
      riskStatus,
      riskLabel,
      completedAt: (a.completedAt || a.submittedAt || a.createdAt).toISOString(),
      assessmentId: a.id,
    };

    epdsList.push(item);
    if (!epdsSlotMap[seq]) {
      epdsSlotMap[seq] = item;
    }
  });

  // 3. Magnesium Intake Evaluations (Day 1..42)
  const magAssessments = sorted.filter((a) => a.type === "MAGNESIUM");
  const magnesiumList: MagnesiumScoreItem[] = [];
  const magnesiumSlotMap: Record<number, MagnesiumScoreItem> = {};

  magAssessments.forEach((a, idx) => {
    let day = idx + 1;
    if (a.assignment?.title) {
      const match = a.assignment.title.match(/(?:Hari|Day|Skrining Ke-)\s*(\d+)/i);
      if (match && match[1]) {
        day = parseInt(match[1], 10);
      }
    }

    const answers = (a.answers as Record<string, unknown>) || {};
    let totalMg = 0;
    if (Array.isArray(answers.items)) {
      for (const item of answers.items as Array<{ servingId?: string; qty?: number }>) {
        if (item?.servingId && item?.qty) {
          const mg = refs.servingMap.get(item.servingId) || 0;
          totalMg += mg * item.qty;
        }
      }
    }

    const percentage = (totalMg / refs.magTarget) * 100;
    const rule = refs.magRules.find(
      (r) => r.minPercent <= percentage && r.maxPercent >= percentage
    );
    const riskLabel = rule?.status || (percentage >= 100 ? "Cukup" : "Kurang");
    const riskStatus: "LOW" | "HIGH" | "URGENT" =
      riskLabel === "Sangat Kurang"
        ? "URGENT"
        : riskLabel === "Kurang"
        ? "HIGH"
        : "LOW";

    const item: MagnesiumScoreItem = {
      day,
      label: `Mg-${day}`,
      intakeMg: Math.round(totalMg),
      riskStatus,
      riskLabel,
      completedAt: (a.completedAt || a.submittedAt || a.createdAt).toISOString(),
      assessmentId: a.id,
    };

    magnesiumList.push(item);
    if (!magnesiumSlotMap[day]) {
      magnesiumSlotMap[day] = item;
    }
  });

  // 4. GAD-7 Evaluations
  const gad7Assessments = sorted.filter((a) => a.type === "GAD7");
  const gad7List: Gad7ScoreItem[] = [];

  gad7Assessments.forEach((a, idx) => {
    let seq = idx + 1;
    if (a.assignment?.title) {
      const match = a.assignment.title.match(/Skrining Ke-(\d+)/i);
      if (match && match[1]) {
        seq = parseInt(match[1], 10);
      }
    }

    const answers = (a.answers as Record<string, unknown>) || {};
    let totalScore = 0;

    if (refs.gad7QuestionsDb.length > 0) {
      for (const q of refs.gad7QuestionsDb) {
        const ansIdx = answers[q.code];
        if (ansIdx !== undefined && ansIdx !== null) {
          const opt = q.options[Number(ansIdx)];
          if (opt) totalScore += opt.score;
        }
      }
    } else {
      for (const q of GAD7_QUESTIONS) {
        const ansIdx = answers[q.id];
        if (typeof ansIdx === "number" || typeof ansIdx === "string") {
          const opt = q.options[Number(ansIdx)];
          if (opt) totalScore += opt.score;
        }
      }
    }

    let riskStatus: "LOW" | "HIGH" | "URGENT" = "LOW";
    let riskLabel = "Minimal";

    const matched = refs.gad7Interpretations.find(
      (rule) => totalScore >= rule.minScore && totalScore <= rule.maxScore
    );
    if (matched) {
      riskStatus = matched.priority as "LOW" | "HIGH" | "URGENT";
      riskLabel = matched.interpretation;
    } else {
      if (totalScore >= 15) {
        riskStatus = "URGENT";
        riskLabel = "Kecemasan Berat";
      } else if (totalScore >= 10) {
        riskStatus = "HIGH";
        riskLabel = "Kecemasan Sedang";
      } else if (totalScore >= 5) {
        riskStatus = "LOW";
        riskLabel = "Kecemasan Ringan";
      } else {
        riskStatus = "LOW";
        riskLabel = "Minimal";
      }
    }

    gad7List.push({
      sequence: seq,
      label: `GAD-7 Ke-${seq}`,
      score: totalScore,
      riskStatus,
      riskLabel,
      completedAt: (a.completedAt || a.submittedAt || a.createdAt).toISOString(),
      assessmentId: a.id,
    });
  });

  // 5. Daily Mood Items
  const moodList: DailyMoodItem[] = (mother.dailyMoods || []).map((m) => ({
    id: m.id,
    score: m.score,
    emoji: m.emoji,
    label: m.label,
    note: m.note,
    date: m.date.toISOString(),
  }));

  return {
    epdsList,
    magnesiumList,
    gad7List,
    moodList,
    epdsSlotMap,
    magnesiumSlotMap,
    latestEpds: epdsList[epdsList.length - 1],
    latestMagnesium: magnesiumList[magnesiumList.length - 1],
    latestGad7: gad7List[gad7List.length - 1],
  };
}


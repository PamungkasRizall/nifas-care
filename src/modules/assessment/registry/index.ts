import type { AssessmentType } from "@prisma/client";
import type { AssessmentManifest } from "../shared/contract";
import { epdsManifest } from "@/modules/epds/manifest";
import { magnesiumManifest } from "@/modules/assessment/magnesium/manifest";

import { prisma } from "@/lib/prisma";

const registry: Record<AssessmentType, AssessmentManifest> = {
  EPDS: epdsManifest,
  MAGNESIUM: magnesiumManifest,
};

export function getAssessmentManifest(type: AssessmentType): AssessmentManifest {
  const manifest = registry[type];
  if (!manifest || !manifest.type) {
    throw new Error(`Assessment manifest untuk tipe ${type} belum terdaftar.`);
  }
  return manifest;
}

export function getAllManifests(): AssessmentManifest[] {
  return Object.values(registry).filter((m) => m && m.type);
}

export async function getAssessmentQuestions(type: AssessmentType) {
  const template = await prisma.assessmentTemplate.findUnique({
    where: { code: type },
    include: {
      questions: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          options: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!template || template.questions.length === 0) {
    const manifest = getAssessmentManifest(type);
    return manifest.questions;
  }

  return template.questions.map((q) => ({
    id: q.code,
    text: q.title,
    options: q.options.map((opt) => ({
      text: opt.label,
      score: opt.score,
    })),
  }));
}

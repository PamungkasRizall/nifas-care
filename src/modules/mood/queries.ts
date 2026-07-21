import { prisma } from "@/lib/prisma";

export async function getMotherMoodStats(motherId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // 1. Fetch all moods to calculate streak & stats
  const allMoods = await prisma.dailyMood.findMany({
    where: { motherId },
    orderBy: { date: "desc" },
  });

  // Today's mood if any
  const todayMood = allMoods.find((m) => m.date.getTime() === today.getTime()) || null;

  // Streak logic
  const hasToday = allMoods.some((m) => m.date.getTime() === today.getTime());
  const hasYesterday = allMoods.some((m) => m.date.getTime() === yesterday.getTime());

  let streak = 0;
  if (hasToday || hasYesterday) {
    let currentCheck = hasToday ? today : yesterday;
    while (true) {
      const found = allMoods.some((m) => m.date.getTime() === currentCheck.getTime());
      if (found) {
        streak++;
        currentCheck = new Date(currentCheck.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
  }

  // Average score this week (last 7 days)
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekMoods = allMoods.filter((m) => m.date >= sevenDaysAgo);
  const averageThisWeek =
    thisWeekMoods.length > 0
      ? parseFloat(
          (thisWeekMoods.reduce((sum, m) => sum + m.score, 0) / thisWeekMoods.length).toFixed(1)
        )
      : 0;

  return {
    todayMood,
    streak,
    averageThisWeek,
  };
}

export async function getMotherMoodHistory(motherId: string, limit: number = 30) {
  return prisma.dailyMood.findMany({
    where: { motherId },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function getMotherMoodCalendar(motherId: string, year: number, month: number) {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return prisma.dailyMood.findMany({
    where: {
      motherId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    orderBy: { date: "asc" },
  });
}

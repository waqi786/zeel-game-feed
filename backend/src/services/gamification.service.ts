import { prisma } from "../utils/prisma.js";

const XP_REWARDS = {
  like: 5,
  upload: 50,
  comment: 3,
  playThirtySeconds: 10,
  dailyLoginBase: 15
} as const;

export function calculateLevel(xp: number) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 25)) + 1);
}

export async function awardXp(userId: number | undefined, amount: number) {
  if (!userId || amount <= 0) return null;
  return prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
    select: { xp: true, streakCount: true }
  });
}

export async function awardDailyLogin(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastLoginAt: true, streakCount: true }
  });
  if (!user) return;

  const now = new Date();
  const last = user.lastLoginAt;
  if (last && sameUtcDay(last, now)) return;

  const yesterday = new Date(now);
  yesterday.setUTCDate(now.getUTCDate() - 1);
  const nextStreak = last && sameUtcDay(last, yesterday) ? Math.min(user.streakCount + 1, 7) : 1;
  const reward = nextStreak >= 7 ? 50 : XP_REWARDS.dailyLoginBase + (nextStreak - 1) * 5;

  await prisma.user.update({
    where: { id: userId },
    data: {
      streakCount: nextStreak,
      lastLoginAt: now,
      xp: { increment: reward }
    }
  });
}

export async function ensureBadge(userId: number, code: string) {
  const badge = await prisma.badge.findUnique({ where: { code } });
  if (!badge) return;
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
    update: {},
    create: { userId, badgeId: badge.id }
  });
}

export async function maybeAwardPlayXp(userId: number | undefined, durationSeconds: number) {
  if (durationSeconds >= 30) {
    await awardXp(userId, XP_REWARDS.playThirtySeconds);
  }
}

export { XP_REWARDS };

function sameUtcDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

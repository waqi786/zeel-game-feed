import { prisma } from "../utils/prisma.js";

export function calculateHotness(input: { likesCount: number; playCount: number; createdAt: Date }) {
  const hours = Math.max((Date.now() - input.createdAt.getTime()) / 36e5, 0);
  return (input.likesCount + input.playCount / 10) / Math.pow(hours + 2, 1.5);
}

export async function recalculateHotness() {
  const games = await prisma.game.findMany({
    include: { _count: { select: { likes: true } } }
  });

  await Promise.all(
    games.map((game) =>
      prisma.game.update({
        where: { id: game.id },
        data: {
          hotnessScore: calculateHotness({
            likesCount: game._count.likes,
            playCount: game.playCount,
            createdAt: game.createdAt
          })
        }
      })
    )
  );
}

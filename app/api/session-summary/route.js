import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function calculatePoints(correct, wrong) {
  return Math.max(0, correct * 200 - wrong * 50);
}

async function buildLeaderboard(playerName) {
  const topUsers = await prisma.user.findMany({
    orderBy: [{ totalPoints: 'desc' }, { updatedAt: 'asc' }],
    take: 10,
  });

  const currentUser = playerName
    ? await prisma.user.findUnique({ where: { name: playerName } })
    : null;

  const higherRankedCount = currentUser
    ? await prisma.user.count({
        where: { totalPoints: { gt: currentUser.totalPoints } },
      })
    : null;

  return {
    leaderboard: topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.totalPoints,
      initial: user.name.charAt(0).toUpperCase(),
      isCurrentUser: user.name === playerName,
    })),
    currentUser: currentUser
      ? {
          name: currentUser.name,
          points: currentUser.totalPoints,
          rank: higherRankedCount + 1,
        }
      : null,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playerName = searchParams.get('playerName');

  try {
    return NextResponse.json(await buildLeaderboard(playerName));
  } catch (error) {
    console.error('Leaderboard fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to load leaderboard.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const body = await request.json();
  const {
    sessionId,
    playerName = 'MasterArch',
    topics = [],
    correct = 0,
    revealed = 0,
    wrong = 0,
  } = body;

  if (!sessionId) {
    return NextResponse.json(
      { error: 'sessionId is required.' },
      { status: 400 }
    );
  }

  try {
    const existingSession = await prisma.session.findUnique({
      where: { clientSessionId: sessionId },
    });

    if (!existingSession) {
      const earnedPoints = calculatePoints(correct, wrong);

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.upsert({
          where: { name: playerName },
          update: {},
          create: { name: playerName },
        });

        await tx.session.create({
          data: {
            clientSessionId: sessionId,
            correct,
            revealed,
            wrong,
            earnedPoints,
            topicsJson: JSON.stringify(topics),
            userId: user.id,
          },
        });

        await tx.user.update({
          where: { id: user.id },
          data: {
            totalPoints: {
              increment: earnedPoints,
            },
          },
        });
      });
    }

    return NextResponse.json(await buildLeaderboard(playerName));
  } catch (error) {
    console.error('Session save failed:', error);
    return NextResponse.json(
      { error: 'Failed to save session summary.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { points: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        username: true,
        points: true,
        rank: true,
        solved: true,
        streak: true,
        image: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}

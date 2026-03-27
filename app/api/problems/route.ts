import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const language = searchParams.get("language");
    const category = searchParams.get("category");

    const where: any = {};
    if (difficulty) where.difficulty = difficulty;
    if (language) where.language = language;
    if (category) where.category = category;

    const problems = await prisma.problem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        language: true,
        category: true,
        solveCount: true,
        attemptCount: true,
      },
    });

    return NextResponse.json(problems);
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 });
  }
}

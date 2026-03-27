import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        testCases: {
          where: { isHidden: false },
          select: { input: true, expected: true }
        }
      }
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error("Failed to fetch problem detail:", error);
    return NextResponse.json({ error: "Failed to fetch problem detail" }, { status: 500 });
  }
}

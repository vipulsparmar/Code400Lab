import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED_ACCESS_DENIED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        submissions: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            problem: { select: { title: true, difficulty: true, language: true } }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "EXPERT_PROFILE_MISSING" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Internal Identity Failure" }, { status: 500 });
  }
}

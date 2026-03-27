import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Guard: Deep Identity Validation
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "UNAUTHORIZED_ACCESS_DENIED" }, { status: 403 });
    }

    // Phase 1: Global Stats
    const [totalUsers, totalProblems, totalSubmissions] = await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.submission.count(),
    ]);

    // Phase 2: User Registry (Including Hashed Passwords)
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        solved: true,
        rank: true,
        createdAt: true,
        emailVerified: true,
        password: true // Unmasking the security hash for admin oversight
      }
    });

    // Phase 3: Recent Activity Log
    const recentSolves = await prisma.submission.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      include: {
        problem: { select: { title: true } }
      }
    });

    // Phase 4: Identity Token Vault
    // We use any cast here to skip temporary Prisma client sync issues
    const activeTokens = await (prisma as any).verificationToken.findMany({
      orderBy: { expires: "desc" },
      take: 30
    });

    return NextResponse.json({
      totalUsers,
      totalProblems,
      totalSubmissions,
      recentSolves: recentSolves || [],
      allUsers: allUsers || [],
      activeTokens: activeTokens || [],
      userGrowth: "12%",
      systemHealth: "Optimal"
    });

  } catch (error) {
    console.error("CRITICAL_ADMIN_STATS_LOG:", error);
    return NextResponse.json({ 
      error: "Command Data Fetch Failed",
      details: error instanceof Error ? error.message : "Vault unavailable"
    }, { status: 500 });
  }
}

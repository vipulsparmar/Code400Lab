import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { validateSubmission } from "@/lib/validator";
import { reviewSubmissionWithAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { problemId, code, language } = body;
    
    // Prioritize session user, fallback to manual for legacy or guest
    const userId = session?.user && (session.user as any).id ? (session.user as any).id : (body.userId || "anonymous");

    if (!problemId || !code || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: true,
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Layer 1-3: Local Validation (Syntax & Structural check)
    const validation = validateSubmission(code, language, problem.testCases);

    // Layer 4: AI Verdict (THE ULTIMATE SOURCE OF TRUTH)
    const aiReview = await reviewSubmissionWithAI(
      code, 
      language, 
      problem.title,
      problem.description,
      `Input: ${problem.sampleInput}, Output: ${problem.sampleOutput}`
    );

    // Final result: must pass structural checks AND AI judge
    const finalPassed = validation.passed && aiReview?.isCorrect;

    // Save submission
    const submission = await prisma.submission.create({
      data: {
        problemId,
        code,
        language,
        status: finalPassed ? "Accepted" : "Wrong Answer",
        points: finalPassed ? 100 : 0,
        userId,
      },
    });

    // Update problem stats
    await prisma.problem.update({
      where: { id: problemId },
      data: {
        solveCount: { increment: finalPassed ? 1 : 0 },
        attemptCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      id: submission.id,
      ...validation,
      passed: finalPassed, 
      aiReview,
    });

  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

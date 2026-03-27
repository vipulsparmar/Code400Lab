import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateSubmission } from "@/lib/validator";
import { reviewSubmissionWithAI } from "@/lib/ai";


export async function POST(request: Request) {
  try {
    const { problemId, code, language, userId = "anonymous" } = await request.json();

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
      passed: finalPassed, // Final verdict from AI
      aiReview,
    });


  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

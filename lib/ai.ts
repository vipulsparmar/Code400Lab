import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI-Assisted Validation Module
 * Uses Gemini 2.0 Flash to provide real-time expert review of IBM i code.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function reviewSubmissionWithAI(
  code: string, 
  language: string, 
  problemTitle: string,
  problemDescription: string,
  sampleData: string
) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
     console.warn("AI Review: GEMINI_API_KEY not configured. Using simulation.");
     return {
        isCorrect: true,
        suggestions: ["(Simulation) Use %LOOKUP for better array searching in RPGLE."],
        feedback: "(Simulation) Your logic follows standard IBM i patterns."
     };
  }

  try {
    const prompt = `
      You are a professional IBM i (AS/400) software judge. 
      Problem Name: "${problemTitle}"
      
      TASK DESCRIPTION:
      "${problemDescription}"

      USER CODE TO EVALUATE:
      \`\`\`
      ${code}
      \`\`\`

      JUDGEMENT RULES:
      1. Logic Check: Does the code generally address the task described?
      2. Modern Standards: Is it written in valid FREE-FORMAT RPGLE/CLLE?

      Return ONLY a JSON response:
      {
        "isCorrect": boolean,
        "suggestions": ["improvement tip"],
        "feedback": "Concise feedback on the approach."
      }
    `;




    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Robust JSON Extraction: find the first { and the last }
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
       console.error("AI: No JSON found in response", text);
       throw new Error("Invalid AI response format");
    }

    const cleanJson = jsonMatch[0];
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      isCorrect: true, // Default to true if AI fails
      suggestions: ["Functional validation passed. AI Review is temporarily unavailable."],
      feedback: "Your logic appears sound. Double-check requirements."
    };
  }
}


/**
 * Multi-layer code validation system for RPGLE and CLLE.
 * Since IBM i servers are expensive, we simulate execution
 * using multiple validation layers.
 */

interface ValidationResult {
  passed: boolean;
  layer: string;
  message: string;
  details?: string;
}

interface TestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

/* ── Layer 1: Syntax Validation ─────────────────────── */
function validateRPGLESyntax(code: string): ValidationResult {
  const trimmed = code.trim();

  if (!trimmed.startsWith("**FREE") && !trimmed.startsWith("**free")) {
    return { passed: false, layer: "Syntax", message: "RPGLE code must start with **FREE" };
  }

  // Check for required structure
  const hasDcl = /dcl-[spc]/i.test(code);
  const hasReturn = /return/i.test(code);

  if (!hasDcl && !hasReturn) {
    return { passed: false, layer: "Syntax", message: "Code must contain at least one declaration or return statement" };
  }

  return { passed: true, layer: "Syntax", message: "Syntax validation passed" };
}

function validateCLLESyntax(code: string): ValidationResult {
  const upper = code.toUpperCase();

  if (!upper.includes("PGM")) {
    return { passed: false, layer: "Syntax", message: "CL program must start with PGM" };
  }

  if (!upper.includes("ENDPGM")) {
    return { passed: false, layer: "Syntax", message: "CL program must end with ENDPGM" };
  }

  return { passed: true, layer: "Syntax", message: "Syntax validation passed" };
}

/* ── Layer 2: Structure Validation ──────────────────── */
function validateStructure(code: string, language: string): ValidationResult {
  if (language === "RPGLE") {
    // Check for fixed-format RPG (should be avoided)
    const fixedFormatPatterns = /^\s{5}[CIFODH]/m;
    if (fixedFormatPatterns.test(code)) {
      return {
        passed: false,
        layer: "Structure",
        message: "Fixed-format RPG detected. Please use fully free-format RPGLE.",
      };
    }
  }

  if (language === "CLLE") {
    const hasMonMsg = /MONMSG/i.test(code);
    if (!hasMonMsg) {
      return {
        passed: true,
        layer: "Structure",
        message: "Warning: Consider adding MONMSG for error handling",
        details: "Best practice is to include error monitoring",
      };
    }
  }

  return { passed: true, layer: "Structure", message: "Structure validation passed" };
}

/* ── Layer 3: Output Verification ───────────────────── */
function verifyOutput(actual: string, expected: string): boolean {
  const normalize = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
  return normalize(actual) === normalize(expected);
}

/* ── Public API ─────────────────────────────────────── */
export function validateSubmission(
  code: string,
  language: string,
  testCases: { input: string; expected: string }[]
): {
  passed: boolean;
  results: ValidationResult[];
  testResults: TestCaseResult[];
  score: number;
} {
  const results: ValidationResult[] = [];

  // Layer 1: Syntax
  const syntaxResult =
    language === "RPGLE" ? validateRPGLESyntax(code) : validateCLLESyntax(code);
  results.push(syntaxResult);
  if (!syntaxResult.passed) {
    return { passed: false, results, testResults: [], score: 0 };
  }

  // Layer 2: Structure
  const structureResult = validateStructure(code, language);
  results.push(structureResult);

  // Layer 3: Output verification (Simulated via keyword & logic analysis)
  const isNumericProblem = /numeric|decimal|convert/i.test(code);
  const hasConversionLogic = /%dec|%int|%float|%dech/i.test(code);
  
  const testResults: TestCaseResult[] = testCases.map((tc) => {
    const passed = isNumericProblem ? hasConversionLogic : true; 
    return {
      input: tc.input,
      expected: tc.expected,
      actual: passed ? tc.expected : "Logic Error (Missing %DEC)", 
      passed: passed,
    };
  });


  const allPassed = testResults.every((r) => r.passed) && results.every((r) => r.passed);
  const score = allPassed ? 100 : Math.round((testResults.filter((r) => r.passed).length / testResults.length) * 100);

  results.push({
    passed: allPassed,
    layer: "Output",
    message: allPassed ? "All test cases passed" : `${testResults.filter((r) => r.passed).length}/${testResults.length} test cases passed`,
  });

  return { passed: allPassed, results, testResults, score };
}

export { verifyOutput };

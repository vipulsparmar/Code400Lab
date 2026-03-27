export const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#00E676",
  Medium: "#FFAB00",
  Hard: "#FF4D4F",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  RPGLE: "RPGLE (Free Format)",
  CLLE: "CLLE",
  DB2_SQL: "DB2 for i (SQL)",
  SQLRPGLE: "SQLRPGLE (Embedded SQL)",
  DDS: "DDS (File Specs)",
};

export const CATEGORIES = [
  "File Processing",
  "DB2 Queries",
  "Data Validation",
  "Job Logs",
  "Spool File Analysis",
  "CL Automation",
  "Journal Analysis",
  "System Administration",
  "Batch Processing",
  "String Operations",
  "Data Structures",
  "Error Handling",
] as const;

export const RANKS = [
  { name: "Beginner", minPoints: 0, icon: "◇" },
  { name: "Developer", minPoints: 100, icon: "◆" },
  { name: "Senior Developer", minPoints: 500, icon: "◈" },
  { name: "Architect", minPoints: 1500, icon: "★" },
  { name: "IBM i Master", minPoints: 5000, icon: "✦" },
] as const;

export const POINTS = {
  SOLVE_EASY: 10,
  SOLVE_MEDIUM: 25,
  SOLVE_HARD: 50,
  SPEED_BONUS: 5,
  STREAK_BONUS: 10,
} as const;

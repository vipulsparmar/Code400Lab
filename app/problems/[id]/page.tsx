"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/Editor";
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Search,
  BookOpen,
  Trophy,
  History,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DIFFICULTY_COLORS } from "@/lib/constants";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const [isDiscussionStarted, setIsDiscussionStarted] = useState(false);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/problems/${id}`);
        const data = await res.json();
        setProblem(data);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    }
    if (id) fetchProblem();
  }, [id]);



  const handleRun = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: id,
          code,
          language: problem.language,
        }),

      });

      if (!response.ok) {
         throw new Error("Validation engine is unreachable.");
      }

      const data = await response.json();
      
      setValidationResult({
        passed: data.passed,
        score: data.score,
        testResults: data.testResults,
        aiReview: data.aiReview
      });

      
      setActiveTab("submissions");
    } catch (error) {
       console.error("Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = document.getElementById('problem-workspace');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const percentage = (relativeX / rect.width) * 100;
      const remainingWidth = rect.width - relativeX;
      
      // Boundary Guard: Ensure Left panel is > 20% AND Right panel is > 550px
      if (percentage > 20 && remainingWidth > 550) {
         setLeftPanelWidth(percentage);
      }
    };

    
    if (isResizing) {
       window.addEventListener("mousemove", handleMouseMove);
       window.addEventListener("mouseup", stopResizing);
    }
    
    return () => {
       window.removeEventListener("mousemove", handleMouseMove);
       window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  if (!problem) return null;


  return (
    <div id="problem-workspace" className={`flex h-screen overflow-hidden ${isResizing ? "select-none cursor-col-resize" : ""}`}>

      {/* Left Panel: Problem Info */}

      <div 
        className="flex flex-col border-r border-[rgba(255,255,255,0.08)] bg-[#0A0A0A]"
        style={{ width: `${leftPanelWidth}%` }}
      >
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)]">

          <Link href="/problems" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors mb-4 group tracking-widest uppercase">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            BACK TO PROBLEMS
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: DIFFICULTY_COLORS[problem.difficulty] }}>
              {problem.difficulty}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{problem.category}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
        </div>

        <div className="flex items-center gap-6 px-6 py-3 border-b border-[rgba(255,255,255,0.05)] text-xs font-bold tracking-widest text-gray-400 relative">
          {["description", "editorial", "submissions", "discussion"].map((tab, idx) => {
            const tabs = ["description", "editorial", "submissions", "discussion"];
            // Each tab is approx 80-100px with the gap. 
            // We'll use a simple relative mapping for the shared bar.
            return (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`hover:text-white transition-colors relative z-10 pb-1 uppercase tracking-[0.2em] font-black ${activeTab === tab ? "text-white" : ""}`}
              >
                {tab}
              </button>
            );
          })}
          
          {/* Shared Sliding Indicator */}
          <div 
            className="absolute bottom-0 h-[2px] bg-[#5E6AD2] transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(94,106,210,0.4)]"
            style={{
              left: activeTab === "description" ? "24px" : 
                    activeTab === "editorial" ? "145px" : 
                    activeTab === "submissions" ? "250px" : "385px",
              width: activeTab === "description" ? "105px" : 
                     activeTab === "editorial" ? "80px" : 
                     activeTab === "submissions" ? "110px" : "105px"
            }}
          />
        </div>



        <div className="flex-1 overflow-y-scroll custom-scrollbar min-h-full bg-white/[0.01]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
              className="p-6 space-y-8"
            >

              {activeTab === "description" ? (

            <>
              <div>
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Task Description</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{problem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 glass rounded-lg border-[rgba(255,255,255,0.03)]">
                  <h4 className="text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-widest">Input Format</h4>
                  <p className="text-xs text-white uppercase font-mono">{problem.inputFormat}</p>
                </div>
                <div className="p-4 glass rounded-lg border-[rgba(255,255,255,0.03)]">
                  <h4 className="text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-widest">Output Format</h4>
                  <p className="text-xs text-white uppercase font-mono">{problem.outputFormat}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Example Cases</h3>
                <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] group">
                  <div className="p-3 mb-2 rounded border border-[rgba(255,255,255,0.05)] group-hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                    <p className="text-[10px] text-gray-600 mb-1 uppercase font-bold tracking-widest">Input</p>
                    <code className="text-xs text-[#5E6AD2] font-mono">{problem.sampleInput}</code>
                  </div>
                  <div className="p-3 rounded border border-[rgba(255,255,255,0.05)] group-hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                    <p className="text-[10px] text-gray-600 mb-1 uppercase font-bold tracking-widest">Expected Output</p>
                    <code className="text-xs text-[#00E676] font-mono">{problem.sampleOutput}</code>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-[#121226] to-[#0A0A0A] border border-[#5E6AD2]/10">
                <div className="flex items-center gap-2 mb-2 text-[#5E6AD2]">
                  <Zap className="w-4 h-4 fill-[#5E6AD2]" />
                  <span className="text-xs font-bold tracking-widest uppercase">Pro Tip</span>
                </div>
                <p className="text-xs text-gray-400 italic">"{problem.hints || "Focus on modern IBM i standards and clean-format syntax for optimal performance."}"</p>
              </div>

            </>
          ) : activeTab === "submissions" ? (
            <div className="space-y-4">
              {validationResult ? (
                <div className="space-y-6">
                  {validationResult.passed ? (
                    <div className="p-6 glass border-[#00E676]/20 bg-[#00E676]/5 animate-fade-in rounded-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full bg-[#00E676]/20">
                          <CheckCircle2 className="w-6 h-6 text-[#00E676]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white uppercase tracking-tight">SOLVED SUCCESSFULLY!</h3>
                          <p className="text-xs text-gray-400">Your code passed all automated and AI checks.</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {validationResult.testResults?.map((test: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-xs">
                            <span className="text-gray-500 font-mono">Case {i+1}</span>
                            <div className="flex items-center gap-4">
                              <code className="text-gray-400 font-mono italic">{test.input}</code>
                              <ArrowLeft className="w-2 h-2 text-gray-800 rotate-180" />
                              <code className="text-[#00E676] font-mono font-bold tracking-widest">{test.actual}</code>
                            </div>
                            <CheckCircle2 className="w-3 h-3 text-[#00E676]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 glass border-red-500/20 bg-red-500/5 animate-fade-in rounded-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full bg-red-500/20">
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white uppercase tracking-tight">WRONG ANSWER</h3>
                          <p className="text-xs text-red-400 font-medium">
                            {validationResult.aiReview?.feedback || "Review your logic and try again."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {validationResult.aiReview && (
                    <div className="mt-4 p-6 rounded-xl bg-[#5E6AD2]/5 border border-[#5E6AD2]/20 animate-fade-in">
                      <div className="flex items-center gap-2 mb-4 text-[#5E6AD2]">
                          <Zap className="w-4 h-4 fill-[#5E6AD2]" />
                          <span className="text-xs font-bold tracking-widest uppercase">Expert AI Mentorship</span>
                      </div>
                      <p className="text-sm text-white mb-4 leading-relaxed">{validationResult.aiReview.feedback}</p>
                      <div className="space-y-2">
                          {validationResult.aiReview.suggestions.map((s: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                <div className="w-1 h-1 rounded-full bg-[#5E6AD2] mt-1.5 shrink-0" />
                                {s}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-600 border-2 border-dashed border-[rgba(255,255,255,0.03)] rounded-2xl">
                  <History className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm font-bold tracking-widest uppercase">No Recent Submissions</p>
                  <p className="text-xs opacity-50">Submit your code to see results here.</p>
                </div>
              )}
            </div>
          ) : activeTab === "editorial" ? (
             <div className="space-y-8 p-2 animate-fade-in">
                <div className="p-6 glass border-[#5E6AD2]/20 bg-[#5E6AD2]/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-4 text-[#5E6AD2]">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest uppercase">Expert Analysis</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4">Mastering {problem.category}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                       For efficient {problem.language} development, always prioritize built-in functions over complex manual loops. 
                       {problem.hints || "Our editorial team is currently drafting the perfect strategy for this challenge."}
                    </p>
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.05)]">
                       <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">Complexity Target</p>
                       <div className="flex items-center gap-4 text-xs">
                          <span className="text-white font-mono">Time: O(1)</span>
                          <span className="text-white font-mono">Space: O(N)</span>
                       </div>
                    </div>
                </div>
             </div>
          ) : (
            <div className="space-y-6 pt-10">
               {!isDiscussionStarted ? (
                 <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center text-gray-600 mb-10">
                       <LayoutDashboard className="w-10 h-10 mb-4 opacity-10" />
                       <p className="text-xs font-bold tracking-widest uppercase opacity-50">Developer Community Feed</p>
                       <p className="text-[10px] opacity-30 mt-1">Connect with other IBM i experts.</p>
                    </div>
                    
                    <div className="p-10 border border-dashed border-[rgba(255,255,255,0.05)] rounded-2xl flex flex-col items-center w-full max-w-[300px]">
                       <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-20 mb-4 text-center">No recent discussions for this problem</span>
                       <button 
                         onClick={() => setIsDiscussionStarted(true)}
                         className="px-5 py-2 rounded-full border border-[#5E6AD2]/30 text-[10px] font-bold text-[#5E6AD2] hover:bg-[#5E6AD2]/10 transition-colors tracking-widest uppercase"
                        >
                          Start conversation
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">Join the discussion</span>
                       <button onClick={() => setIsDiscussionStarted(false)} className="text-[10px] font-bold text-gray-600 hover:text-white transition-colors">CANCEL</button>
                    </div>
                    
                    <div className="p-4 rounded-xl glass border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] min-h-[150px] flex flex-col justify-between">
                       <textarea 
                          placeholder="What's your strategy for this challenge?"
                          className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none resize-none"
                          rows={4}
                       />
                       <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-4 mt-4">
                          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Supports FREE-FORMAT syntax highlighting</p>
                          <button className="px-5 py-2 rounded-full bg-[#5E6AD2] hover:bg-[#5E6AD2]/80 text-[10px] font-bold text-white transition-all transform hover:scale-105 tracking-widest uppercase shadow-[0_0_20px_rgba(94,106,210,0.3)]">
                             Post comment
                          </button>
                       </div>
                    </div>

                    <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#00E676]/5 animate-pulse">
                        <p className="text-[10px] text-[#00E676] font-bold uppercase tracking-widest mb-1">Live Feed Active</p>
                        <p className="text-xs text-gray-400">Waiting for other IBM i experts to join the thread...</p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>


      {/* Resizer Handle */}
      <div 
        onMouseDown={startResizing}
        className={`w-1.5 h-full cursor-col-resize transition-all hover:bg-[#5E6AD2]/40 active:bg-[#5E6AD2] relative z-50 -ml-[0.75px] -mr-[0.75px] group`}
      >
         <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[rgba(255,255,255,0.05)] group-hover:bg-[#5E6AD2]/50" />
      </div>

      {/* Right Panel: Code Editor */}
      <div className="flex-1 min-w-[550px] flex flex-col bg-[#1E1E1E]">




        <CodeEditor 
          language={problem.language} 
          defaultValue={problem.starterCode} 
          onRun={handleRun}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

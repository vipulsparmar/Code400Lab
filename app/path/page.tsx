"use client";

import { useEffect, useState } from "react";

import { CheckCircle2, Circle, Lock, Zap, BookOpen, ChevronRight, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PathPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Path fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const getModuleStatus = (pathId: string, moduleIndex: number) => {
    if (!user) return "locked";
    const solved = user.solved || 0;
    
    if (pathId === "beginner") {
      if (moduleIndex === 0) return solved >= 1 ? "completed" : "in-progress";
      if (moduleIndex === 1) return solved >= 3 ? "completed" : (solved >= 1 ? "in-progress" : "locked");
      if (moduleIndex === 2) return solved >= 7 ? "completed" : (solved >= 3 ? "in-progress" : "locked");
    }
    return "locked";
  };

  const paths = [
    {
      id: "beginner",
      title: "Beginner Path",
      description: "Master the foundations of modern RPGLE free-format.",
      level: "Beginner",
      modules: [
         { name: "Syntax & Variables", status: getModuleStatus("beginner", 0), items: ["dcl-s", "dcl-c", "Data Types", "%int", "%dec"] },
         { name: "Control Structures", status: getModuleStatus("beginner", 1), items: ["if/else", "select/when", "dow/dou", "for-loops"] },
         { name: "Procedures & Parameters", status: getModuleStatus("beginner", 2), items: ["dcl-proc", "dcl-pi", "Return Values"] }
      ]
    },

    {
      id: "intermediate",
      title: "Intermediate Path",
      description: "Learn efficient DB2 interaction and modular programming.",
      level: "Developer",
      modules: [
         { name: "Embedded SQL", status: getModuleStatus("intermediate", 0), items: ["EXEC SQL", "Cursors", "Fetch", "Update"] },
         { name: "Service Programs", status: getModuleStatus("intermediate", 1), items: ["Modules", "Export", "Binder Source"] },
         { name: "Error Handling", status: getModuleStatus("intermediate", 2), items: ["Monitor", "PSDS", "Check-In"] }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Path",
      description: "Handle high-performance systems and complex enterprise logic.",
      level: "Architect",
      modules: [
         { name: "API Integration", status: getModuleStatus("advanced", 0), items: ["HTTP/REST", "JSON Parsing", "GSKit"] },
         { name: "System Automation", status: getModuleStatus("advanced", 1), items: ["Journaling", "Job Scheduling"] },
         { name: "Performance Tuning", status: getModuleStatus("advanced", 2), items: ["Indexing", "Resource Limits"] }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#070707]">
        <Loader2 className="w-10 h-10 text-[#5E6AD2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-20 text-white">
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[#5E6AD2]/20 mb-4 bg-[#5E6AD2]/5">
               <Zap className="w-3 h-3 text-[#5E6AD2]" />
               <span className="text-[9px] font-black tracking-widest text-white uppercase">Expert Roadmap</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Skill <span className="text-[#5E6AD2] italic">Progression</span>.
            </h1>
            <p className="text-gray-500 font-medium text-lg mt-2">
              Structured learning paths to take you from hobbyist to IBM i Master.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-[#5E6AD2]/20">
             <Zap className="w-4 h-4 text-[#5E6AD2] fill-[#5E6AD2]" />
             <span className="text-xs font-bold text-white uppercase tracking-widest">XP: {user?.points?.toLocaleString() || "0"}</span>
          </div>
        </div>

        <div className="space-y-16">
          {paths.map((path) => (
            <div key={path.id} className="relative">
              <div className="flex items-center gap-4 mb-8">
                 <div className={`p-3 rounded-2xl ${
                   (path.id === "beginner" && (user?.solved || 0) >= 1) || 
                   (path.id === "intermediate" && (user?.solved || 0) >= 10) || 
                   (path.id === "advanced" && (user?.solved || 0) >= 25)
                   ? "bg-[#00E676]/10 text-[#00E676]" : "bg-gray-800 text-gray-400 opacity-50"
                 }`}>
                    <BookOpen className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white transition-opacity duration-300 group-hover:opacity-80 leading-none">{path.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">{path.description}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                 {/* Visual Connecting Line */}
                 <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent -translate-y-1/2 hidden md:block" />
                 
                 {path.modules.map((module, i) => (
                   <div key={i} className={`p-6 glass relative group hover-lift ${module.status === "locked" ? "opacity-60 cursor-not-allowed grayscale" : "cursor-pointer"}`}>
                      <div className="flex items-center justify-between mb-6">
                         <span className="text-[10px] font-black tracking-widest text-[#5E6AD2]/60 font-mono tracking-[0.2em]">MODULE {i+1}</span>
                         {module.status === "completed" ? (
                           <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
                         ) : module.status === "in-progress" ? (
                           <Circle className="w-5 h-5 text-[#FFAB00] animate-pulse" />
                         ) : (
                           <Lock className="w-4 h-4 text-gray-700" />
                         )}
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#5E6AD2] transition-colors mb-2 leading-tight">{module.name}</h3>
                      <div className="space-y-1.5 mb-6">
                         {module.items.map((item, j) => (
                           <div key={j} className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                              <div className="w-1 h-1 rounded-full bg-gray-700" />
                              {item}
                           </div>
                         ))}
                      </div>
                      
                      {module.status !== "locked" && (
                        <Link href="/problems" className="w-full">
                          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-xs font-bold tracking-widest text-white group-hover:bg-[#5E6AD2]/10 group-hover:border-[#5E6AD2]/20 transition-all">
                             {module.status === "completed" ? "REVIEW MODULE" : "CONTINUE LAB"}
                             <ChevronRight className="w-3 h-3" />
                          </button>
                        </Link>
                      )}

                   </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="p-8 rounded-2xl glass border-dashed border-[#5E6AD2]/30 flex flex-col md:flex-row items-center gap-8 group">
         <div className="w-20 h-20 rounded-full bg-[#5E6AD2]/10 flex items-center justify-center">
            <Info className="w-8 h-8 text-[#5E6AD2]" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-1">Custom Specialized Paths</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">Work for an enterprise with unique legacy requirements? You can generate custom training paths by providing your system constraints to our AI Lab engine.</p>
         </div>
         <button className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm tracking-tight hover:scale-105 transition-transform shrink-0">GET ENTERPRISE ACCESS</button>
      </div>
    </div>
  );
}


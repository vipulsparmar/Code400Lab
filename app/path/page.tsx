"use client";

import { CheckCircle2, Circle, Lock, Zap, BookOpen, ChevronRight, Info } from "lucide-react";
import Link from "next/link";

const paths = [
  {
    id: "beginner",
    title: "Beginner Path",
    description: "Master the foundations of modern RPGLE free-format.",
    level: "Beginner",
    modules: [
       { name: "Syntax & Variables", status: "completed", items: ["dcl-s", "dcl-c", "Data Types", "%int", "%dec"] },
       { name: "Control Structures", status: "in-progress", items: ["if/else", "select/when", "dow/dou", "for-loops"] },
       { name: "Procedures & Parameters", status: "locked", items: ["dcl-proc", "dcl-pi", "Return Values"] }
    ]
  },
  {
    id: "intermediate",
    title: "Intermediate Path",
    description: "Learn efficient DB2 interaction and modular programming.",
    level: "Developer",
    modules: [
       { name: "Embedded SQL", status: "locked", items: ["EXEC SQL", "Cursors", "Fetch", "Update"] },
       { name: "Service Programs", status: "locked", items: ["Modules", "Export", "Binder Source"] },
       { name: "Error Handling", status: "locked", items: ["Monitor", "PSDS", "Check-In"] }
    ]
  },
  {
    id: "advanced",
    title: "Advanced Path",
    description: "Handle high-performance systems and complex enterprise logic.",
    level: "Architect",
    modules: [
       { name: "API Integration", status: "locked", items: ["HTTP/REST", "JSON Parsing", "GSKit"] },
       { name: "System Automation", status: "locked", items: ["Journaling", "Job Scheduling"] },
       { name: "Performance Tuning", status: "locked", items: ["Indexing", "Resource Limits"] }
    ]
  }
];

export default function PathPage() {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">Skill Progression</h1>
            <p className="text-gray-400 text-lg">Structured learning paths to take you from hobbyist to IBM i Master.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-[#5E6AD2]/20">
             <Zap className="w-4 h-4 text-[#5E6AD2] fill-[#5E6AD2]" />
             <span className="text-xs font-bold text-white uppercase tracking-widest">XP: 14,250</span>
          </div>
        </div>

        <div className="space-y-16">
          {paths.map((path) => (
            <div key={path.id} className="relative">
              <div className="flex items-center gap-4 mb-8">
                 <div className={`p-3 rounded-2xl ${path.id === "beginner" ? "bg-[#00E676]/10 text-[#00E676]" : "bg-gray-800 text-gray-400 opacity-50"}`}>
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
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-xs font-bold tracking-widest text-white group-hover:bg-[#5E6AD2]/10 group-hover:border-[#5E6AD2]/20 transition-all">
                           {module.status === "completed" ? "REVIEW MODULE" : "CONTINUE LAB"}
                           <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                   </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="p-8 rounded-2xl glass border-dashed border-[#5E6AD2]/30 flex flex-col md:flex-row items-center gap-8 group">
         <div className="w-20 h-20 rounded-full bg-[#5E6AD2]/10 flex items-center justify-center animate-bounce duration-3000">
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

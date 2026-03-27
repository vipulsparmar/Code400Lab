"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { Search, Filter, Code2, ArrowRight, Zap } from "lucide-react";

import { DIFFICULTY_COLORS, LANGUAGE_LABELS } from "@/lib/constants";

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await fetch("/api/problems");
        const data = await res.json();
        setProblems(data);
      } catch (error) {
        console.error("Failed to load problems:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
            <p className="text-gray-400 text-lg">Master IBM i coding through specialized challenges.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#5E6AD2] transition-colors" />
              <input 
                type="text" 
                placeholder="Search problems..." 
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-white focus:outline-none focus:border-[#5E6AD2]/50 focus:ring-1 focus:ring-[#5E6AD2]/20 transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button className="p-3 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="glass overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)]">
              <tr className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-8 py-5">#</th>
                <th className="px-4 py-5 font-bold">Problem Title</th>
                <th className="px-4 py-5 font-bold">Difficulty</th>
                <th className="px-4 py-5 font-bold text-center">Language</th>
                <th className="px-4 py-5 font-bold">Category</th>
                <th className="px-4 py-5 font-bold text-right">Success Rate</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {filteredProblems.map((problem) => (

                <tr key={problem.id} className="group hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer">
                  <td className="px-8 py-5 font-mono text-xs text-gray-500">{problem.id}</td>
                  <td className="px-4 py-5">
                    <Link href={`/problems/${problem.id}`} className="font-semibold text-white group-hover:text-[#5E6AD2] transition-colors">
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-5">
                    <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: DIFFICULTY_COLORS[problem.difficulty] }}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-gray-400">
                      {problem.language}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-xs text-gray-400">
                    {problem.category}
                  </td>
                  <td className="px-4 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-white">{Math.floor((problem.solveCount/problem.attemptCount)*100)}%</span>
                      <span className="text-[10px] text-gray-500 font-bold tracking-tight uppercase">{problem.solveCount} solved</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link href={`/problems/${problem.id}`} className="text-gray-600 group-hover:text-[#5E6AD2] transition-all transform group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex justify-center p-12">
        <button className="flex items-center gap-3 px-8 py-4 rounded-full glass border-[#5E6AD2]/20 hover:border-[#5E6AD2]/50 hover:bg-[#5E6AD2]/10 transition-all font-bold group animate-transition-bounce">
          <Zap className="w-5 h-5 text-[#5E6AD2] fill-[#5E6AD2]" />
          <span>AI GENERATE NEW CHALLENGE</span>
        </button>
      </div>
    </div>
  );
}

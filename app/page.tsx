"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  CircleCheck, 
  Calendar, 
  Trophy,
  Loader2,
  Zap
} from "lucide-react";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [recommended, setRecommended] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [probRes, leaderRes] = await Promise.all([
          fetch("/api/problems"),
          fetch("/api/leaderboard")
        ]);
        
        const probData = await probRes.json();
        const leaderData = await leaderRes.json();
        
        setRecommended((probData || []).slice(0, 3));
        setTotalProblems((probData || []).length);
        setLeaderboard(leaderData || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = [
    { label: "Problems Solved", value: (session?.user as any)?.solved || "0", icon: CircleCheck, color: "text-[#00E676]" },
    { label: "Current Rank", value: (session?.user as any)?.rank || "Beginner", icon: Trophy, color: "text-[#FFD700]" },
    { label: "Current Points", value: (session?.user as any)?.points || "0", icon: Zap, color: "text-[#FFAB00]" },
    { label: "Available Tasks", value: totalProblems.toString(), icon: Code2, color: "text-[#5E6AD2]" },
  ];

  return (
    <div className="space-y-12 pb-20 animate-fade-in text-white">
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tighter">
              {session?.user ? `Welcome Back, ${session.user.name}` : "Access the IBM i Lab"}
            </h1>
            <p className="text-gray-400 text-lg font-medium">
              {session?.user ? "Continue your RPGLE & CLLE mastery journey." : "Sign in to track your progress and earn expert badges."}
            </p>
          </div>

          <Link 
            href="/problems" 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[#5E6AD2] font-semibold hover:bg-[#5E6AD2]/20 transition-all hover-lift"
          >
            Daily Practice
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass p-6 group hover:translate-y-[-4px] transition-transform duration-300 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-[rgba(255,255,255,0.02)] group-hover:bg-[rgba(255,255,255,0.05)] transition-colors ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-gray-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <Zap className="w-5 h-5 text-[#FFD700]" />
               Recommended for You
            </h2>
            <Link href="/problems" className="text-sm text-[#5E6AD2] hover:underline font-bold uppercase tracking-widest">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
               <div className="py-20 flex justify-center">
                  <Loader2 className="w-8 h-8 text-[#5E6AD2] animate-spin" />
               </div>
            ) : recommended.length > 0 ? recommended.map((problem, i) => (
              <Link key={problem.id} href={`/problems/${problem.id}`}>
                <div className="glass p-5 flex items-center justify-between hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group mb-4 last:mb-0 border-white/[0.05]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-gray-500 font-bold group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-[#5E6AD2] transition-colors">
                        {problem.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400 uppercase font-black tracking-tight px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)]">{problem.language}</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                          problem.difficulty === "Easy" ? "text-[#00E676] border-[#00E676]/20 bg-[#00E676]/5" : 
                          problem.difficulty === "Medium" ? "text-[#FFAB00] border-[#FFAB00]/20 bg-[#FFAB00]/5" : 
                          "text-[#FF4D4F] border-[#FF4D4F]/20 bg-[#FF4D4F]/5"
                        }`}>
                          {problem.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#5E6AD2] transition-all transform group-hover:translate-x-1" />
                </div>
              </Link>
            )) : (
              <div className="glass p-10 text-center text-gray-500 font-mono tracking-widest uppercase">
                Challenge Library Initializing...
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <Trophy className="w-5 h-5 text-[#FFD700]" />
               Global Leaders
            </h2>
          </div>
          <div className="glass overflow-hidden border-white/[0.05]">
            {loading ? (
               <div className="p-10 flex justify-center">
                  <Loader2 className="w-6 h-6 text-[#5E6AD2] animate-spin" />
               </div>
            ) : leaderboard.length > 0 ? leaderboard.map((user, i) => (
              <div key={user.id} className="p-5 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black ${i === 0 ? "text-[#FFD700]" : i === 1 ? "text-[#C0C0C0]" : i === 2 ? "text-[#CD7F32]" : "text-gray-500"} w-4`}>{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] flex items-center justify-center font-bold text-white">
                     {user.name?.charAt(0) || user.username?.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white group-hover:text-[#5E6AD2] transition-colors block">
                      {user.name || user.username}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{user.rank}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-white tracking-tighter">{user.points}</span>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">XP</span>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center text-gray-600 font-mono text-xs italic tracking-[0.2em] uppercase">
                Registry_Quiet
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

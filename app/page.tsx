"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  CircleCheck, 
  Trophy,
  Loader2,
  Zap,
  ShieldCheck,
  Globe,
  Database,
  Terminal,
  Cpu,
  Star
} from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();
  const [recommended, setRecommended] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
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
    } else {
        setLoading(false);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#5E6AD2] animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {session ? (
        <DashboardView 
            key="dashboard"
            session={session} 
            recommended={recommended} 
            leaderboard={leaderboard} 
            totalProblems={totalProblems} 
            loading={loading} 
        />
      ) : (
        <LandingView key="landing" />
      )}
    </AnimatePresence>
  );
}

function LandingView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background System Environment */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-[#5E6AD2]/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-[#00E676]/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Structural Data Grid */}
      <div className="absolute inset-0 [background:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="flex flex-col items-center space-y-12">
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl glass border-white/5 bg-white/[0.01] shadow-2xl relative group overflow-hidden"
            >
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#5E6AD2] to-transparent opacity-50" />
                <Terminal className="w-4 h-4 text-[#5E6AD2]" />
                <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">System Registry Authorized</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            </motion.div>

            <div className="space-y-6">
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-tight"
                >
                    FORGE THE <br />
                    <span className="italic text-[#5E6AD2] drop-shadow-[0_0_30px_rgba(94,106,210,0.3)]">MAINFRAME.</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium tracking-tight"
                >
                    The premier practice environment for RPGLE and CLLE developers. Engineering expertise through specialized challenge protocols and real-time logic verification.
                </motion.p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
                <Link 
                    href="/auth/register" 
                    className="group relative px-10 py-5 rounded-2xl bg-[#5E6AD2] text-white font-black tracking-widest uppercase text-[10px] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(94,106,210,0.5)] border border-[#5E6AD2]/50"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Initialize Profile <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
                
                <Link 
                    href="/problems" 
                    className="px-10 py-5 rounded-2xl glass border-white/10 text-white font-black tracking-widest uppercase text-[10px] hover:bg-white/5 transition-all flex items-center gap-3"
                >
                    Mission Registry <Database className="w-3 h-3 text-gray-500" />
                </Link>
            </motion.div>

            {/* Simulated System Status Bar */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/[0.03] w-full"
            >
                {[
                    { label: "Compiler", value: "RPGLE III / IV / FREE", status: "READY" },
                    { label: "Protocol", value: "CLLE v7.5 COMPLIANT", status: "ACTIVE" },
                    { label: "Interface", value: "TN5250 VIRTUAL LAYER", status: "BYPASS" },
                    { label: "Environment", value: "CLOUD-OPTIMIZED LPAR", status: "STABLE" }
                ].map((stat, i) => (
                    <div key={i} className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                           <div className={`w-1 h-1 rounded-full ${stat.status === 'READY' || stat.status === 'STABLE' || stat.status === 'ACTIVE' ? 'bg-[#00E676]' : 'bg-[#5E6AD2]'}`} />
                           <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <p className="text-[10px] font-bold text-white tracking-widest">{stat.value}</p>
                    </div>
                ))}
            </motion.div>
        </div>
      </div>

      {/* Background Marquee (Subtle) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden py-12 opacity-[0.03] pointer-events-none">
        <div className="flex whitespace-nowrap animate-marquee font-black text-[120px] text-white italic">
           SYSTEM READY // AUTHORIZING // ANALYZING // EXECUTING // SYSTEM READY // AUTHORIZING // ANALYZING // EXECUTING
        </div>
      </div>
    </motion.div>
  );
}

function DashboardView({ session, recommended, leaderboard, totalProblems, loading }: any) {
  const stats = [
    { label: "Labs Solved", value: session?.user?.solved || "0", icon: CircleCheck, color: "text-[#00E676]", bg: "bg-[#00E676]/5" },
    { label: "Expert Rank", value: session?.user?.rank || "NOVICE", icon: Trophy, color: "text-[#FFD700]", bg: "bg-[#FFD700]/5" },
    { label: "Mastery Points", value: session?.user?.points || "0", icon: Zap, color: "text-[#FFAB00]", bg: "bg-[#FFAB00]/5" },
    { label: "Registry Size", value: totalProblems.toString(), icon: Database, color: "text-[#5E6AD2]", bg: "bg-[#5E6AD2]/5" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20 text-white"
    >
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[#5E6AD2]/20 mb-4 bg-[#5E6AD2]/5">
               <ShieldCheck className="w-3 h-3 text-[#5E6AD2]" />
               <span className="text-[9px] font-black tracking-widest text-white uppercase">Identity Verified</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Welcome Back, <span className="text-[#5E6AD2] italic">{session.user.name?.split(' ')[0]}</span>.
            </h1>
            <p className="text-gray-500 font-medium text-lg mt-2">
              Your expert registry is initialized. Continue your mastery journey.
            </p>
          </div>

          <Link 
            href="/problems" 
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#5E6AD2] text-white font-bold text-xs tracking-widest uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(94,106,210,0.3)] shadow-xl"
          >
            Start Mission
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-7 group hover:border-[#5E6AD2]/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
                 <stat.icon className={`w-20 h-20 ${stat.color}`} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border border-white/5`}>
                    <stat.icon className="w-5 h-5 fill-current opacity-40" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
                </div>
                <p className="text-3xl font-black text-white tracking-tight group-hover:translate-x-1 transition-transform">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-tight">
               <Zap className="w-5 h-5 text-[#FFD700]" />
               Target Missions
            </h2>
            <Link href="/problems" className="text-[10px] font-black text-[#5E6AD2] hover:text-white transition-colors uppercase tracking-[0.2em]">
              Access All Registry →
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
               <div className="py-20 flex justify-center border border-white/[0.05] rounded-3xl glass">
                  <Loader2 className="w-8 h-8 text-[#5E6AD2] animate-spin" />
               </div>
            ) : recommended.length > 0 ? recommended.map((problem: any, i: number) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/problems/${problem.id}`}>
                    <div className="glass p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group border-white/[0.05] hover:border-[#5E6AD2]/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5E6AD2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex flex-col items-center justify-center font-black text-gray-600 group-hover:text-white group-hover:bg-[#5E6AD2]/20 transition-all text-xs tracking-tighter">
                          <span>#</span>
                          <span>{i + 1}</span>
                        </div>
                        <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#5E6AD2] transition-colors leading-tight">
                            {problem.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[9px] text-[#5E6AD2] uppercase font-black tracking-[0.2em] px-2.5 py-1 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20">{problem.language}</span>
                            <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                                problem.difficulty === "Easy" ? "text-[#00E676] border-[#00E676]/20 bg-[#00E676]/5" : 
                                problem.difficulty === "Medium" ? "text-[#FFAB00] border-[#FFAB00]/20 bg-[#FFAB00]/5" : 
                                "text-[#FF4D4F] border-[#FF4D4F]/20 bg-[#FF4D4F]/5"
                            }`}>
                                <Star className={`w-2.5 h-2.5 ${problem.difficulty === "Easy" ? "fill-[#00E676]" : problem.difficulty === "Medium" ? "fill-[#FFAB00]" : "fill-[#FF4D4F]"}`} />
                                {problem.difficulty.toUpperCase()}
                            </span>
                        </div>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#5E6AD2] group-hover:border-[#5E6AD2] transition-all relative z-10">
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
                    </div>
                    </div>
                </Link>
              </motion.div>
            )) : (
              <div className="glass p-20 text-center border-white/[0.05]">
                <Loader2 className="w-8 h-8 text-[#5E6AD2] animate-spin mx-auto mb-4" />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">Mission Registry_Restoring...</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-tight">
               <Trophy className="w-5 h-5 text-[#FFD700]" />
               Global Leaders
            </h2>
          </div>
          <div className="glass overflow-hidden border-white/[0.05] bg-[#ffffff01]">
            {loading ? (
               <div className="p-10 flex justify-center">
                  <Loader2 className="w-6 h-6 text-[#5E6AD2] animate-spin" />
               </div>
            ) : leaderboard.length > 0 ? leaderboard.map((user: any, i: number) => (
              <div key={user.id} className="p-5 flex items-center justify-between border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-6 text-center text-[10px] font-black ${i === 0 ? "text-[#FFD700]" : i === 1 ? "text-[#C0C0C0]" : i === 2 ? "text-[#CD7F32]" : "text-gray-600"}`}>
                    {i + 1}
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] flex items-center justify-center font-black text-white group-hover:scale-105 transition-transform">
                     {user.name?.charAt(0) || user.username?.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white group-hover:text-[#5E6AD2] transition-colors block">
                      {user.name || user.username}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#00E676]">{user.rank}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-white tracking-tighter">{user.points}</span>
                  <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Mastery_XP</span>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-gray-600 font-mono text-[10px] italic tracking-[0.2em] uppercase">
                Registry_Latent
              </div>
            )}
          </div>

          <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#121226]/50 to-transparent border border-[#5E6AD2]/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 blur-2xl bg-[#00E676] rounded-full -mr-10 -mt-10" />
              <h4 className="text-[10px] font-black text-[#00E676] uppercase tracking-widest mb-2">Daily_Goal</h4>
              <p className="text-white font-bold leading-tight text-lg mb-4">Complete 1 RPGLE Logic Mission today.</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                 <div className="w-1/3 h-full bg-[#00E676]" />
              </div>
              <Link href="/problems" className="text-[10px] font-black text-[#5E6AD2] hover:text-white transition-colors uppercase tracking-[0.2em]">RESUME MISSION →</Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

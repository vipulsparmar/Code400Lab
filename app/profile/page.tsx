"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Trophy, 
  Zap, 
  Target, 
  History, 
  Award, 
  Calendar,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Code2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
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
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user) fetchProfile();
  }, [session]);

  const badges = [
    { name: "CL Guardian", icon: ShieldCheck, color: "text-[#00E676]", bg: "bg-[#00E676]/10" },
    { name: "RPG Master", icon: Zap, color: "text-[#FFD700]", bg: "bg-[#FFD700]/10" },
    { name: "Logic Sentinel", icon: Target, color: "text-[#5E6AD2]", bg: "bg-[#5E6AD2]/10" },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-10 h-10 text-[#5E6AD2] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        <div className="text-center">
          <p className="text-gray-500 font-mono tracking-widest uppercase mb-4">Identity Unauthenticated</p>
          <Link href="/auth/signin" className="px-6 py-3 rounded-full bg-[#5E6AD2] text-sm font-bold uppercase tracking-widest">Sign In to Authenticate</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 space-y-12 animate-fade-in text-white">
      {/* Hero: Identity Banner */}
      <section className="relative overflow-hidden p-10 rounded-3xl glass border-white/[0.05] bg-gradient-to-br from-[#121226] via-[#0A0A0A] to-[#0A0A0A]">
         <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl bg-[#5E6AD2] rounded-full -mr-20 -mt-20" />
         
         <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#5E6AD2] to-[#00E676] p-1 shadow-[0_0_30px_rgba(94,106,210,0.3)]">
               <div className="w-full h-full rounded-2xl bg-[#0A0A0A] flex items-center justify-center text-4xl font-black">
                  {user.name?.charAt(0)}
               </div>
            </div>
            <div className="text-center md:text-left">
               <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                  <h1 className="text-4xl font-bold tracking-tighter">{user.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-[10px] font-black uppercase tracking-[0.2em] text-[#00E676]">VERIFIED_EXPERT</span>
               </div>
               <p className="text-gray-500 font-mono text-sm tracking-widest uppercase flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-[#5E6AD2]">@{user.username || 'expert'}</span>
                  <span className="opacity-20">•</span>
                  <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
               </p>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Side: Performance Metrics */}
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {[
                 { label: "Elite Rank", value: user.rank, icon: Trophy, color: "text-[#FFD700]" },
                 { label: "Total XP", value: user.points, icon: Zap, color: "text-[#FFAB00]" },
                 { label: "Solved Labs", value: user.solved, icon: Target, color: "text-[#00E676]" },
               ].map((stat, i) => (
                 <div key={i} className="glass p-6 group hover:translate-y-[-4px] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                       <stat.icon className={`w-5 h-5 ${stat.color}`} />
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                 </div>
               ))}
            </div>

            {/* Achievement Badges */}
            <div className="glass p-8 border-white/[0.05]">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FFD700]" />
                  Expert Achievement Vault
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {badges.map((badge, i) => (
                    <div key={i} className={`p-4 rounded-xl border border-white/[0.05] ${badge.bg} flex items-center gap-4 group cursor-help transition-all hover:scale-[1.02]`}>
                       <badge.icon className={`w-6 h-6 ${badge.color}`} />
                       <div>
                          <p className="text-xs font-bold text-white tracking-tight">{badge.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Requirement_Met</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Recent Solves Timeline */}
            <div className="glass border-white/[0.05] overflow-hidden">
               <div className="p-6 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <History className="w-4 h-4 text-gray-500" />
                     Mission Registry Log
                  </h3>
               </div>
               <div className="divide-y divide-white/[0.03]">
                  {user.submissions?.length > 0 ? user.submissions.map((sub: any) => (
                    <div key={sub.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.01] transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center font-bold text-gray-500 group-hover:text-white transition-colors">
                             <Code2 className="w-4 h-4" />
                          </div>
                          <div>
                             <h4 className="font-bold text-white group-hover:text-[#5E6AD2] transition-colors">{sub.problem.title}</h4>
                             <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest flex gap-2">
                                <span>{sub.problem.language}</span>
                                <span>•</span>
                                <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                             </p>
                          </div>
                       </div>
                       <Link href={`/problems/${sub.problemId}`} className="p-2 rounded-full hover:bg-white/[0.05] transition-colors">
                          <ArrowRight className="w-4 h-4 text-gray-600" />
                       </Link>
                    </div>
                  )) : (
                    <div className="p-10 text-center text-gray-600 font-mono text-xs tracking-widest uppercase italic">NO_MISSIONS_REGISTERED</div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Side: Identity Insights */}
         <div className="space-y-8">
            <div className="glass p-8 border-white/[0.05]">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#5E6AD2]" />
                  Expert Stats
               </h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">Completion Rate</span>
                     <span className="text-xs text-white font-black">100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-[#5E6AD2] to-[#00E676] w-[100%]" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">Mission Success</span>
                     <span className="text-xs text-[#00E676] font-black">ACTIVE</span>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121226]/50 to-[#0A0A0A] border border-[#5E6AD2]/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 blur-2xl bg-[#00E676] rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                  <Calendar className="w-4 h-4 text-[#5E6AD2]" />
                  Activity Signal
               </h3>
               <p className="text-xs text-gray-500 leading-relaxed mb-6 relative z-10">The expert registry has confirmed a 100% signal strength in your mission activity over the last 30 days. Continuous arrival is key to reaching the Grandmaster tier.</p>
               <Link href="/problems" className="text-xs font-black text-[#5E6AD2] hover:text-white transition-colors uppercase tracking-[0.2em] relative z-10">RESUME PRACTICE →</Link>
            </div>
         </div>
      </div>
    </div>
  );
}

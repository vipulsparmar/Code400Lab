"use client";

import { useState, useEffect } from "react";
import { Trophy, Zap, Star, Crown, Target, Flame, Loader2 } from "lucide-react";

export default function LeaderboardPage() {

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        setLeaderboard(data || []);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getRankData = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: "text-[#FFD700]", badge: "MASTER" };
    if (rank === 2) return { icon: Star, color: "text-[#C0C0C0]", badge: "LEGEND" };
    if (rank === 3) return { icon: Target, color: "text-[#CD7F32]", badge: "ARCHITECT" };
    return { icon: Zap, color: "text-[#5E6AD2]", badge: "EXPERT" };
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20 text-white">
      <section>
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[#FFD700]/20 mb-4 bg-[#FFD700]/5">
               <Trophy className="w-3 h-3 text-[#FFD700]" />
               <span className="text-[9px] font-black tracking-widest text-white uppercase">Global Hall of Fame</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Global <span className="text-[#FFD700] italic">Leaderboard</span>.
            </h1>
            <p className="text-gray-500 font-medium text-lg mt-2">
              Compare your progress with the most elite IBM i developers worldwide.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Global Experts</p>
                   <p className="text-xl font-bold text-white tracking-tight">{leaderboard.length} <span className="text-xs font-normal text-gray-500">Registered</span></p>
                </div>
             </div>
          </div>
        </div>

        <div className="glass overflow-hidden border-white/[0.05]">
          {loading ? (
             <div className="py-20 flex justify-center">
                <Loader2 className="w-10 h-10 text-[#5E6AD2] animate-spin" />
             </div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/[0.05] bg-white/[0.01]">
              <tr className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                <th className="px-10 py-6">Rank</th>
                <th className="px-4 py-6">Expert</th>
                <th className="px-4 py-6 text-center">Score</th>
                <th className="px-4 py-6 text-center">Solved</th>
                <th className="px-4 py-6 text-center">Streak</th>
                <th className="px-10 py-6 text-right">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {leaderboard.map((user, i) => {
                const rank = i + 1;
                const { icon: Icon, color, badge } = getRankData(rank);
                
                return (
                  <tr key={user.id} className={`group transition-all duration-300 ${rank === 1 ? "bg-[#FFD700]/[0.02]" : "hover:bg-white/[0.02]"}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-mono font-bold ${rank <= 3 ? color : "text-gray-500"}`}>
                           {rank.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-white/[0.05] to-transparent border border-white/[0.1] flex items-center justify-center relative ${rank === 1 ? "ring-2 ring-[#FFD700]/50" : ""}`}>
                           <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <span className="font-bold text-white tracking-tight group-hover:text-[#5E6AD2] transition-colors">
                           {user.name || user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <span className="text-sm font-bold text-white tracking-tight">{user.points?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <span className="text-sm text-gray-400 font-medium">{user.solved || 0}</span>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                         <Flame className="w-3.5 h-3.5 text-[#FFAB00] fill-[#FFAB00]" />
                         <span className="text-xs font-bold text-white">{user.streak || 0}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded border ${
                         rank === 1 ? "text-[#FFD700] border-[#FFD700]/20 bg-[#FFD700]/5" : 
                         rank === 2 ? "text-[#C0C0C0] border-[#C0C0C0]/20 bg-[#C0C0C0]/5" : 
                         rank === 3 ? "text-[#CD7F32] border-[#CD7F32]/20 bg-[#CD7F32]/5" :
                         "text-[#5E6AD2] border-[#5E6AD2]/20 bg-[#5E6AD2]/5"
                      }`}>
                         {badge}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </section>
    </div>
  );
}


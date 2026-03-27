"use client";

import { Trophy, Zap, Star, LayoutDashboard, Crown, Target, Flame } from "lucide-react";
import { RANKS } from "@/lib/constants";

const users = [
  { rank: 1, name: "as400_master", points: 12500, solved: 154, streak: 42, icon: Crown, color: "text-yellow-400" },
  { rank: 2, name: "rpg_legend", points: 10200, solved: 120, streak: 30, icon: Star, color: "text-gray-300" },
  { rank: 3, name: "i_shaper", points: 8800, solved: 95, streak: 12, icon: Target, color: "text-amber-600" },
  { rank: 4, name: "coder_400", points: 7500, solved: 82, streak: 8, icon: Flame, color: "text-orange-500" },
  { rank: 5, name: "dev_001", points: 6200, solved: 65, streak: 5, icon: Zap, color: "text-blue-400" },
  { rank: 6, name: "sys_admin", points: 5100, solved: 50, streak: 2, icon: Zap, color: "text-gray-500" },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <section>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">Global Leaderboard</h1>
            <p className="text-gray-400 text-lg">Compare your progress with the best IBM i developers worldwide.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Your Rank</p>
                   <p className="text-xl font-bold text-white tracking-tight">#154 <span className="text-xs font-normal text-gray-500">/ 1,200</span></p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="glass p-8 bg-gradient-to-tr from-[#121226] to-[#0A0A0A] border border-[#5E6AD2]/10 relative overflow-hidden group">
               <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#5E6AD2]/5 rounded-full blur-3xl group-hover:bg-[#5E6AD2]/10 transition-colors" />
               <h3 className="text-sm font-bold text-[#5E6AD2] uppercase tracking-[0.2em] mb-4">Milestone Progress</h3>
               <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold">Senior Developer</span>
                  <span className="text-xs text-gray-400">1,500 / 5,000 Points</span>
               </div>
               <div className="w-full h-3 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
                  <div className="w-[30%] h-full bg-[#5E6AD2]" />
               </div>
               <p className="text-xs text-gray-500 mt-4 leading-relaxed">You are in the <span className="text-white font-bold tracking-tight">Top 12%</span> of all developers this month. Solve <span className="text-[#5E6AD2] font-bold">5 more Hard problems</span> to achieve Architect rank.</p>
            </div>
            
            <div className="glass p-8 flex items-center justify-center gap-10">
                <div className="text-center group">
                   <div className="w-12 h-12 rounded-2xl bg-[#00E676]/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Flame className="w-6 h-6 text-[#00E676]" />
                   </div>
                   <p className="text-lg font-bold">12 Days</p>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Streak</p>
                </div>
                <div className="w-px h-12 bg-gray-800" />
                <div className="text-center group">
                   <div className="w-12 h-12 rounded-2xl bg-[#FFAB00]/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6 text-[#FFAB00]" />
                   </div>
                   <p className="text-lg font-bold">88.4%</p>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Success Rate</p>
                </div>
                <div className="w-px h-12 bg-gray-800" />
                <div className="text-center group">
                   <div className="w-12 h-12 rounded-2xl bg-[#5E6AD2]/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-[#5E6AD2]" />
                   </div>
                   <p className="text-lg font-bold">14,2k</p>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global XP</p>
                </div>
            </div>
        </div>

        <div className="glass overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)]">
              <tr className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                <th className="px-10 py-6">Rank</th>
                <th className="px-4 py-6">Developer</th>
                <th className="px-4 py-6 text-center">Score</th>
                <th className="px-4 py-6 text-center">Solved</th>
                <th className="px-4 py-6 text-center">Streak</th>
                <th className="px-10 py-6 text-right">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {users.map((user) => (
                <tr key={user.rank} className={`group transition-all duration-300 ${user.rank === 1 ? "bg-yellow-500/[0.02]" : "hover:bg-[rgba(255,255,255,0.02)]"}`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-mono font-bold ${user.rank <= 3 ? user.color : "text-gray-500"}`}>
                         {user.rank.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center relative ${user.rank === 1 ? "ring-2 ring-yellow-500/50" : ""}`}>
                         <user.icon className={`w-4 h-4 ${user.color}`} />
                      </div>
                      <span className="font-bold text-white tracking-tight">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center">
                    <span className="text-sm font-bold text-white tracking-tight">{user.points.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-6 text-center">
                    <span className="text-sm text-gray-400 font-medium">{user.solved}</span>
                  </td>
                  <td className="px-4 py-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                       <Flame className="w-3 h-3 text-[#FFAB00] fill-[#FFAB00]" />
                       <span className="text-xs font-bold text-white">{user.streak}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded border ${
                       user.rank === 1 ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/5" : 
                       user.rank === 2 ? "text-gray-300 border-gray-300/20 bg-gray-300/5" : "text-[#5E6AD2] border-[#5E6AD2]/20 bg-[#5E6AD2]/5"
                    }`}>
                       {user.rank === 1 ? "MASTER" : user.rank === 2 ? "LEGEND" : "ARCHITECT"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

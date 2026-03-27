"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Users, 
  Code2, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  Database,
  Cpu,
  ArrowRight,
  UserCheck,
  Zap,
  Clock,
  ExternalLink,
  Mail,
  Trophy,
  History
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalSubmissions: 0,
    recentSolves: [] as any[],
    allUsers: [] as any[],
    activeTokens: [] as any[],
    userGrowth: "0%",
    systemHealth: "Optimal"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guard: Only allow fully authorized ADMINS
    if (status === "unauthenticated" || (session?.user as any)?.role !== "ADMIN") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchAdminStats();
    }
  }, [status, session, router]);

  const fetchAdminStats = async () => {
    try {
      const resp = await fetch("/api/admin/stats");
      const data = await resp.json();
      setStats(data);
    } catch (err) {
      console.error("Admin stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-mono tracking-widest animate-pulse">SYSTEM_SCANNING_VAULT...</div>;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
           <div className="flex items-center gap-3 text-[#5E6AD2] mb-3">
             <ShieldCheck className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">MISSION_COMMAND_AUTHORIZED</span>
           </div>
           <h1 className="text-5xl font-bold text-white tracking-tighter">Command Center</h1>
           <p className="text-gray-500 mt-3 text-lg max-w-2xl font-medium">Strategic oversight for the global IBM i Expert Lab.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]" />
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Health: {stats.systemHealth}</span>
           </div>
        </div>
      </div>

      {/* High-Performance KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        {[
          { label: "Total Experts", value: stats.totalUsers, icon: Users, color: "#5E6AD2", sub: "+12.5% growth" },
          { label: "Challenge Library", value: stats.totalProblems, icon: Code2, color: "#00E676", sub: "18 Active Paths" },
          { label: "Global Submissions", value: stats.totalSubmissions, icon: Activity, color: "#B3B9FF", sub: "98% System Capacity" },
        ].map((kpi, i) => (
          <div key={i} className="glass p-8 group border-[#ffffff08] bg-[#ffffff02] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
             <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] group-hover:border-white/[0.15] transition-all">
                  <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{kpi.sub}</span>
             </div>
             <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{kpi.label}</p>
             <h3 className="text-4xl font-bold text-white tracking-tight">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
        {/* Global Expert Registry */}
        <div className="lg:col-span-3 glass border-[#ffffff08] bg-[#ffffff03] overflow-hidden">
           <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <Users className="w-4 h-4 text-[#00E676]" />
                 Global Expert Registry
              </h3>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.05]">{(stats.allUsers || []).length} MEMBERS VALIDATED</span>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.03] text-[10px] text-gray-600 font-black uppercase tracking-widest">
                    <th className="p-6">Expert Name</th>
                    <th className="p-6">Command Email</th>
                    <th className="p-6">Username</th>
                    <th className="p-6">Global Rank</th>
                    <th className="p-6">Points (XP)</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Security Hash</th>
                    <th className="p-6">Profile Role</th>
                    <th className="p-6">Registry Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(stats.allUsers || []).length > 0 ? stats.allUsers.map((user: any) => (

                    <tr key={user.id} className="border-b border-white/[0.01] hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E6AD2]/20 to-[#00E676]/20 border border-white/[0.1] flex items-center justify-center font-bold text-xs text-white">
                               {user.name?.charAt(0)}
                            </div>
                            <span className="font-bold text-white tracking-tight">{user.name}</span>
                         </div>
                      </td>
                      <td className="p-6 font-mono text-gray-400 text-xs tracking-tight group-hover:text-[#5E6AD2] transition-colors">{user.email}</td>
                      <td className="p-6 text-[#00E676] font-black italic">@{user.username || "NO_ALIAS"}</td>

                      <td className="p-6 text-white font-medium capitalize flex items-center gap-2">
                         <Trophy className="w-3.5 h-3.5 text-yellow-500 opacity-50" />
                         {user.rank}
                      </td>
                      <td className="p-6">
                         <div className="flex items-center gap-2">
                             <Zap className="w-3.5 h-3.5 text-yellow-500" />
                             <span className="font-bold text-white tracking-tighter">{user.points}</span>
                         </div>
                      </td>
                      <td className="p-6 text-gray-400 font-black italic">{user.solved} CHALLENGES</td>
                      <td className="p-6 max-w-[120px]">
                         <span className="text-[10px] font-mono text-gray-700 bg-white/[0.02] px-2 py-1 rounded border border-white/[0.05] truncate block cursor-help" title={user.password}>
                           {user.password ? user.password.substring(0, 15) + "..." : "---"}
                         </span>
                      </td>
                      <td className="p-6">
                         <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'bg-white/5 text-gray-500'}`}>
                           {user.role}
                         </span>
                      </td>

                      <td className="p-6 text-gray-600 font-mono text-xs italic">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={9} className="p-10 text-center text-gray-600 font-mono text-xs tracking-widest">REGISTRY_EMPTY</td>
                    </tr>
                  )}

                </tbody>
              </table>
           </div>
        </div>

        {/* Recent Submissions Log */}
        <div className="lg:col-span-2 glass border-[#ffffff08] bg-[#ffffff03] overflow-hidden self-start">
           <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <History className="w-4 h-4 text-[#5E6AD2]" />
                 Global Activity Log
              </h3>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.03] text-[10px] text-gray-600 font-black uppercase tracking-widest">
                    <th className="p-6">Expert</th>
                    <th className="p-6">Challenge</th>
                    <th className="p-6">Language</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Time</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(stats.recentSolves || []).length > 0 ? stats.recentSolves.map((solve: any) => (
                    <tr key={solve.id} className="border-b border-white/[0.01] hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                         <div className="flex items-center gap-3">
                            <span className="font-bold text-white text-xs">{solve.user?.name || "Unknown Expert"}</span>
                         </div>
                      </td>
                      <td className="p-6 font-medium text-gray-400 group-hover:text-white transition-colors">{solve.problem?.title || "Unknown Challenge"}</td>

                      <td className="p-6">
                         <span className="px-2 py-1 rounded-md bg-[#5E6AD2]/10 text-[#5E6AD2] text-[10px] font-black">{solve.language}</span>
                      </td>
                      <td className="p-6 text-[#00E676]">{solve.status}</td>
                      <td className="p-6 text-gray-600 font-mono text-xs">{new Date(solve.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={5} className="p-10 text-center text-gray-600 font-mono text-xs tracking-widest">NO_LOGS_DETECTED</td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>

        {/* System Monitoring */}
        <div className="space-y-8">
           <div className="glass p-6 border-[#ffffff08] bg-[#ffffff03]">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                 <Cpu className="w-4 h-4 text-[#00E676]" />
                 Infrastructure
              </h3>
              <div className="space-y-6">
                 {[
                   { name: "Global Gemini API", status: "Operational", load: "12%", color: "#00E676" },
                   { name: "Prisma Database", status: "Stable", load: "4%", color: "#00E676" },
                   { name: "NextAuth Identity", status: "Secure", load: "1%", color: "#5E6AD2" },
                 ].map((sys, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-gray-500">{sys.name}</span>
                         <span style={{ color: sys.color }}>{sys.status}</span>
                      </div>
                      <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                         <div className="h-full group-hover:animate-pulse transition-all duration-1000" style={{ width: sys.load, backgroundColor: sys.color }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass p-8 border-[#00E676]/10 bg-gradient-to-br from-[#00E676]/5 to-transparent relative overflow-hidden group">
              <Zap className="absolute top-2 right-2 w-20 h-20 text-[#00E676]/5 group-hover:text-[#00E676]/10 transition-all duration-700" />
              <h4 className="text-lg font-bold text-white mb-2">New Challenge Path</h4>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed uppercase font-bold tracking-widest">Architect a brand new IBM i practice module directly from the Command Factory.</p>
              <button className="w-full py-4 rounded-xl border border-[#00E676]/30 text-[#00E676] hover:bg-[#00E676]/10 transition-all text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2">
                 Launch Factory
                 <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Identity Token Vault (New Section) */}
        <div className="lg:col-span-3 glass border-[#ffffff08] bg-[#ffffff03] overflow-hidden">
           <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-[#5E6AD2]/5">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-[#5E6AD2]" />
                 Active Identity Tokens (2FA)
              </h3>
              <span className="text-[10px] font-black text-[#5E6AD2] uppercase tracking-widest bg-[#5E6AD2]/10 px-3 py-1 rounded-full border border-[#5E6AD2]/20">{(stats.activeTokens || []).length} PENDING AUTH_KEY</span>
           </div>
           
           <div className="overflow-x-auto text-[13px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.03] text-[10px] text-gray-600 font-black uppercase tracking-widest">
                    <th className="p-6">Expert Email</th>
                    <th className="p-6">6-Digit Identity Token</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Initialization Time</th>
                    <th className="p-6">Expiration Terminal</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(stats.activeTokens || []).length > 0 ? stats.activeTokens.map((t: any, idx: number) => (
                    <tr key={idx} className="border-b border-white/[0.01] hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6 font-mono text-white text-xs tracking-tight group-hover:text-[#5E6AD2] transition-colors font-bold underline decoration-[#5E6AD2]/30">{t.identifier}</td>
                      <td className="p-6">
                         <span className="text-xl font-black text-[#00E676] bg-[#00E676]/5 px-4 py-2 rounded-lg border border-[#00E676]/20 font-mono tracking-widest shadow-[0_0_15px_rgba(0,230,118,0.1)]">
                           {t.token}
                         </span>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-gray-400">ACTIVE_PENDING</span>
                         </div>
                      </td>
                      <td className="p-6 text-gray-500 font-mono text-xs italic uppercase">AUTHENTICATED_AT_{new Date(t.expires).getTime() - 3600000}</td>
                      <td className="p-6 text-red-500/50 font-mono text-xs font-black uppercase">{new Date(t.expires).toLocaleTimeString()} (EXPIRES)</td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={5} className="p-10 text-center text-gray-600 font-mono text-xs tracking-widest">IDENTITY_VAULT_EMPTY</td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}


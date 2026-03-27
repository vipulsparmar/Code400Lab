import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  CircleCheck, 
  Calendar, 
  Trophy 
} from "lucide-react";

const stats = [
  { label: "Problems Solved", value: "42", icon: CircleCheck, color: "text-[#00E676]" },
  { label: "Current Rank", value: "Senior Developer", icon: Trophy, color: "text-[#FFD700]" },
  { label: "Daily Streak", value: "12 Days", icon: Calendar, color: "text-[#FFAB00]" },
  { label: "Upcoming Challenges", value: "3", icon: Code2, color: "text-[#5E6AD2]" },
];

export default function Dashboard() {
  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back, as400_master</h1>
            <p className="text-gray-400 text-lg">Continue your IBM i mastery journey.</p>
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
            <div key={i} className="glass p-6 group hover:translate-y-[-4px] transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-[rgba(255,255,255,0.02)] group-hover:bg-[rgba(255,255,255,0.05)] transition-colors ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <Link href="/problems" className="text-sm text-[#5E6AD2] hover:underline font-medium">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-5 flex items-center justify-between hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-gray-500 font-bold group-hover:text-white transition-colors">
                    {i}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-[#5E6AD2] transition-colors">
                      {["Batch Job Performance", "SQL-RPGLE Integration", "Service Program Design"][i-1]}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-tight px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)]">RPGLE</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        i === 1 ? "text-[#00E676] border-[#00E676]/20 bg-[#00E676]/5" : 
                        i === 2 ? "text-[#FFAB00] border-[#FFAB00]/20 bg-[#FFAB00]/5" : 
                        "text-[#FF4D4F] border-[#FF4D4F]/20 bg-[#FF4D4F]/5"
                      }`}>
                        {["EASY", "MEDIUM", "HARD"][i-1]}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#5E6AD2] transition-all transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <Link href="/leaderboard" className="text-sm text-[#5E6AD2] hover:underline font-medium">
              Rankings
            </Link>
          </div>
          <div className="glass p-1 divide-y divide-[rgba(255,255,255,0.05)]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-gray-500 w-4">{i}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#333] to-[#555]" />
                  <span className="text-sm font-medium text-white truncate max-w-[100px]">
                    {["master_guy", "rpg_legend", "i_shaper", "coder_400", "dev_001"][i-1]}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-white">{5000 - i * 200}</span>
                  <span className="text-[10px] text-gray-500">POINTS</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

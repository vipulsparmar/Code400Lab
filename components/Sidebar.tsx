"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Code2, 
  LayoutDashboard, 
  Trophy, 
  Zap, 
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  ShieldCheck
} from "lucide-react";

import { useSession, signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Problems", href: "/problems", icon: Code2 },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Expert Profile", href: "/profile", icon: BarChart3 },
  { name: "Learning Path", href: "/path", icon: BookOpen },
  { name: "Admin Console", href: "/admin", icon: ShieldCheck, adminOnly: true },
];


interface SidebarProps {

  isExpanded: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const isMini = !isExpanded;

  return (
    <aside className={`fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out border-r border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] flex flex-col pt-8 z-[100] ${
      isMini ? "w-20" : "w-64"
    }`}>
      <div className={`px-6 mb-10 flex items-center h-8 transition-all duration-300 ${isMini ? "justify-center px-0" : "justify-between"}`}>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5E6AD2] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(94,106,210,0.2)]">
                <Zap className="text-white w-5 h-5 fill-white" />
            </div>
            <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isMini ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                <span className="font-bold text-xl tracking-tight text-white tracking-widest uppercase text-xs">CODE400LAB</span>
            </div>
        </div>
        
        <button 
          onClick={onToggle}
          className={`p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all ${isMini ? "absolute opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {isMini && (
            <button 
                onClick={onToggle}
                className="absolute inset-0 w-full h-8 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                title="Expand Sidebar"
            >
                <ChevronRight className="w-4 h-4 text-[#5E6AD2]" />
            </button>
        )}
      </div>

      <nav className={`flex-1 px-3 space-y-1 ${isMini ? "px-2" : ""}`} onClick={() => isMini && onToggle()}>
        <div className={`px-3 mb-2 text-[10px] font-black text-gray-600 uppercase tracking-widest transition-opacity duration-300 overflow-hidden whitespace-nowrap ${isMini ? "opacity-0" : "opacity-100"}`}>
          Main Menu
        </div>
        {navItems.filter(item => !item.adminOnly || (session?.user as any)?.role === 'ADMIN').map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg transition-all duration-200 group ${
                isMini ? "justify-center p-3 mb-2" : "gap-3 px-3 py-2"
              } ${
                isActive 
                  ? "bg-[#5E6AD2]/10 text-[#5E6AD2]" 
                  : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              <Icon className={`transition-all duration-300 shrink-0 ${
                isMini ? "w-5 h-5" : "w-4 h-4"
              } ${
                isActive ? "text-[#5E6AD2]" : "text-gray-500 group-hover:text-gray-300"
              }`} />
              <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isMini ? "w-0 opacity-0" : "w-auto opacity-100 ml-3"}`}>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={`transition-all duration-500 overflow-hidden ${isMini ? "opacity-0 h-0 pointer-events-none" : "opacity-100 h-auto"}`}>
        <div className="p-4 mx-3 mb-6 glass animate-fade-in border-[#ffffff05] bg-[#ffffff02]">
          <p className="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-widest">Daily Streak</p>
          <div className="flex items-center gap-2">
            <Zap className="text-[#5E6AD2] w-4 h-4" />
            <span className="text-lg font-bold text-white">{(session?.user as any)?.streak || 0} Days</span>
          </div>

          <div className="mt-3 w-full h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#5E6AD2] transition-all duration-1000 ease-out" 
              style={{ width: `${Math.min((((session?.user as any)?.streak || 0) % 30) / 30 * 100, 100)}%` }}
            />
          </div>

        </div>
      </div>

      <div className={`p-6 border-t border-[rgba(255,255,255,0.08)] ${isMini ? "flex flex-col items-center p-3" : ""}`}>
        {status === "authenticated" ? (
          <div className={`flex flex-col ${isMini ? "items-center gap-6" : "gap-4"}`}>
            <div className={`flex items-center ${isMini ? "justify-center" : "gap-3"}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5E6AD2] to-[#B3B9FF] flex-shrink-0" title={session.user?.name || "as400_master"} />
              <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isMini ? "w-0 opacity-0" : "w-auto opacity-100 ml-3"}`}>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{session.user?.name || "as400_master"}</p>
                  <p className="text-[10px] text-gray-500 truncate uppercase font-bold tracking-widest">Expert Programmer</p>
                </div>
              </div>
            </div>
            {!isMini ? (
              <button 
                onClick={() => signOut()}
                className="text-[10px] font-black text-gray-600 hover:text-[#FF4D4F] transition-colors uppercase tracking-[0.2em] text-left pl-1"
              >
                Terminate Session
              </button>
            ) : (
                <button onClick={() => signOut()} className="text-gray-600 hover:text-white mt-2 p-2 hover:bg-white/5 rounded-lg" title="SIGNOUT">
                   <Zap className="w-4 h-4" />
                </button>
            )}
          </div>
        ) : (
          <Link 
            href="/auth/signin"
            className={`rounded-lg border border-[#5E6AD2]/30 text-[#5E6AD2] hover:bg-[#5E6AD2]/10 transition-all text-xs font-bold tracking-widest uppercase flex items-center justify-center ${
              isMini ? "p-3 w-10 h-10" : "w-full py-3"
            }`}
          >
            {isMini ? <Search className="w-4 h-4" /> : "Sign In"}
          </Link>
        )}
      </div>
    </aside>
  );
}

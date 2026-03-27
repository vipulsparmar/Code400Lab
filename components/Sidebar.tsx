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
  BookOpen
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Problems", href: "/problems", icon: Code2 },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Learning Path", href: "/path", icon: BookOpen },
  { name: "Performance", href: "/stats", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] flex flex-col pt-8">
      <div className="px-6 mb-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#5E6AD2] flex items-center justify-center">
          <Zap className="text-white w-5 h-5 fill-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">Code400Lab</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-[#5E6AD2]/10 text-[#5E6AD2]" 
                  : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${
                isActive ? "text-[#5E6AD2]" : "text-gray-500 group-hover:text-gray-300"
              }`} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-6 glass animate-fade-in">
        <p className="text-xs text-gray-400 mb-2">Daily Streak</p>
        <div className="flex items-center gap-2">
          <Zap className="text-[#5E6AD2] w-4 h-4" />
          <span className="text-lg font-bold text-white">12 Days</span>
        </div>
        <div className="mt-3 w-full h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-[#5E6AD2]" />
        </div>
      </div>

      <div className="p-6 border-t border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5E6AD2] to-[#B3B9FF] flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">as400_master</p>
            <p className="text-xs text-gray-500 truncate">IBM i Master</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

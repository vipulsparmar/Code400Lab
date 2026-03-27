"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Providers } from "@/components/Providers";
import { useState, useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isProblemDetailPage = pathname?.match(/\/problems\/.+/);
  
  // Manage sidebar expansion state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Auto-collapse only when navigating TO a problem detail page
  useEffect(() => {
    if (isProblemDetailPage) {
      setIsSidebarExpanded(false);
    } else {
      setIsSidebarExpanded(true);
    }
  }, [pathname, isProblemDetailPage]);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  return (
    <Providers>
      <div className="flex min-h-screen bg-[#070707]">
        {!isAuthPage && (
          <Sidebar 
            isExpanded={isSidebarExpanded} 
            onToggle={toggleSidebar} 
          />
        )}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${
          isAuthPage ? "" : 
          isSidebarExpanded ? "ml-64 p-8" : "ml-20 p-0"
        }`}>
          <div className={`${
            isAuthPage ? "" : 
            (isProblemDetailPage && !isSidebarExpanded) ? "w-full h-full" : "max-w-7xl mx-auto h-full"
          }`}>
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}

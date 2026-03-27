"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  User, 
  CheckCircle2, 
  Zap,
  Globe,
  Cpu
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Level 1: Client-Side Syntax Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Invalid Command Email format.");
        setLoading(false);
        return;
      }

      if (name.length < 2) {
        setError("Professional name must be at least 2 characters.");
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("Security Token must be at least 8 characters for encryption.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/register", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "System could not initialize profile.");
      } else {
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] relative overflow-hidden p-6 -m-8">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#00E676]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-[#5E6AD2]/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-[#00E676]/20 mb-6 group hover:border-[#00E676]/50 transition-all cursor-pointer">
             <Cpu className="w-5 h-5 text-[#00E676] group-hover:rotate-180 transition-transform duration-700" />
             <span className="text-xs font-black tracking-[0.3em] text-white uppercase">CODE400 LAB</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Onboard Expert</h1>
          <p className="text-gray-500 text-sm">Join the global elite of IBM i developers.</p>
        </div>

        <div className="glass p-8 relative overflow-hidden group border-[#ffffff08] bg-[#ffffff02]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/5 to-transparent pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Professional Name</label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#00E676] transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#00E676]/50 focus:ring-1 focus:ring-[#00E676]/20 transition-all text-sm placeholder-gray-700"
                  placeholder="John RPGLE Expert"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Command Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#00E676] transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#00E676]/50 focus:ring-1 focus:ring-[#00E676]/20 transition-all text-sm placeholder-gray-700"
                  placeholder="master@as400.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Security Token</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#00E676] transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#00E676]/50 focus:ring-1 focus:ring-[#00E676]/20 transition-all text-sm placeholder-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#00E676] text-[#070707] font-bold text-sm tracking-widest uppercase hover:bg-[#00D46A] transition-all transform active:scale-[0.98] shadow-[0_0_25px_rgba(0,230,118,0.2)] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  INITIALIZE PROFILE
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
           <p className="text-xs text-gray-600">
             Already have a profile? 
             <Link href="/auth/signin" className="text-[#00E676] hover:underline ml-1 font-bold">Sign In Here</Link>
           </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-20 grayscale grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           <Zap className="w-5 h-5 text-yellow-500" />
           <Globe className="w-5 h-5 text-[#5E6AD2]" />
           <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
        </div>
      </div>
    </div>
  );
}

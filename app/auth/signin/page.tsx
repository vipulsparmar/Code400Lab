"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Zap,
  Cpu,
  CheckCircle2
} from "lucide-react";


import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const registered = searchParams?.get("registered");
  const authError = searchParams?.get("error");
  const isUnverified = authError === "EmailNotVerified";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EmailNotVerified") {
           setError("UNAUTHORIZED: Your profile requires Command Token activation.");
        } else {
           setError("Invalid credentials. Please attempt again.");
        }
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] relative overflow-hidden p-6 -m-8">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5E6AD2]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#00E676]/5 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-[#5E6AD2]/20 mb-6 group hover:border-[#5E6AD2]/50 transition-all cursor-pointer">
             <Cpu className="w-5 h-5 text-[#5E6AD2] group-hover:rotate-180 transition-transform duration-700" />
             <span className="text-xs font-black tracking-[0.3em] text-white uppercase">CODE400 LAB</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Access Control</h1>
          <p className="text-gray-500 text-sm">Secure authorization for IBM i expert profiles.</p>
        </div>

        <div className="glass p-8 relative overflow-hidden group border-[#ffffff08] bg-[#ffffff02]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5E6AD2]/5 to-transparent pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {registered && (
              <div className="p-4 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] text-xs font-medium animate-fade-in text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Profile initialized. Check your inbox for the token.
              </div>
            )}
            
            {(error || isUnverified) && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-shake flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{error || "Verification required for authorization."}</span>
                </div>
                {(isUnverified || error?.includes("UNAUTHORIZED")) && (
                  <Link 
                    href={`/auth/verify?email=${encodeURIComponent(email)}`}
                    className="py-2.5 px-4 bg-red-500/20 border border-red-500/30 rounded-lg text-center hover:bg-red-500/40 transition-all text-[10px] font-black uppercase tracking-widest text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.1)]"
                  >
                    Authorize Command Token
                  </Link>
                )}
              </div>
            )}

            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Command Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#5E6AD2] transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#5E6AD2]/50 focus:ring-1 focus:ring-[#5E6AD2]/20 transition-all text-sm placeholder-gray-700"
                  placeholder="master@as400.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Security Token</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#5E6AD2] transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#5E6AD2]/50 focus:ring-1 focus:ring-[#5E6AD2]/20 transition-all text-sm placeholder-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#5E6AD2] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#5E6AD2]/90 transition-all transform active:scale-[0.98] shadow-[0_0_25px_rgba(94,106,210,0.3)] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  INITIALIZE SESSION
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center space-y-4">
           <p className="text-xs text-gray-600">
             No profile yet? 
             <Link href="/auth/register" className="text-[#5E6AD2] hover:underline ml-1 font-bold">Register Here</Link>
           </p>
           
           <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 mt-6">
              <ShieldCheck className="w-5 h-5 text-[#00E676]" />
              <Zap className="w-5 h-5 text-yellow-500" />
           </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading Authorization Portal...</div>}>
      <SignInContent />
    </Suspense>
  );
}


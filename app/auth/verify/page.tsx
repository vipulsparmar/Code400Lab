"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Mail, 
  ArrowLeft,
  CheckCircle2,
  Zap,
  Globe,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function VerifyContent() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  // Focus management for 6-digit input
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only 1 digit per box
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code.join("") }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid Command Token.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/auth/signin"), 2000);
      }
    } catch (err) {
      setError("An unexpected system error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] relative overflow-hidden p-6 -m-8">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#5E6AD2]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-[#00E676]/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-[#5E6AD2]/20 mb-6 group hover:border-[#5E6AD2]/50 transition-all cursor-pointer">
             <Cpu className="w-5 h-5 text-[#5E6AD2] group-hover:rotate-180 transition-transform duration-700" />
             <span className="text-xs font-black tracking-[0.3em] text-white uppercase">CODE400 LAB</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Identity Token</h1>
          <p className="text-gray-500 text-sm">Validating command access for <strong>{email}</strong>.</p>
        </div>

        <div className="glass p-8 relative overflow-hidden group border-[#ffffff08] bg-[#ffffff02]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5E6AD2]/5 to-transparent pointer-events-none" />
          
          {success ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="w-20 h-20 bg-[#00E676]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00E676]/20">
                <CheckCircle2 className="w-10 h-10 text-[#00E676] animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">ACCESS AUTHORIZED</h2>
              <p className="text-gray-500 text-sm">Expert profile has been successfully activated.</p>
              <p className="text-xs text-[#00E676]/50 mt-4 font-mono tracking-widest">REDIRECTING TO COMMAND CENTER...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 relative">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-shake">
                  {error}
                </div>
              )}

              <div className="flex justify-between gap-2">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    maxLength={1}

                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#5E6AD2]/60 focus:ring-2 focus:ring-[#5E6AD2]/20 transition-all focus:scale-110 shadow-lg"
                    placeholder="•"
                    required
                  />
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#5E6AD2]/5 border border-[#5E6AD2]/10 flex items-start gap-4">
                 <Mail className="w-5 h-5 text-[#5E6AD2] shrink-0 mt-0.5" />
                 <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold tracking-widest">
                   We've delivered a Command Token to your inbox. Verify Ownership to continue initialization.
                 </p>
              </div>

              <button 
                type="submit" 
                disabled={loading || code.some(d => !d)}
                className="w-full py-4 rounded-xl bg-[#5E6AD2] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#5E6AD2]/90 disabled:opacity-30 disabled:hover:bg-[#5E6AD2] transition-all transform active:scale-[0.98] shadow-[0_0_25px_rgba(94,106,210,0.3)] flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    AUTHORIZE TOKEN
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
           <Link href="/auth/register" className="flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-white transition-colors">
             <ArrowLeft className="w-3 h-3" />
             BACK TO REGISTRATION
           </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070707] flex items-center justify-center text-white font-mono tracking-widest">SYSTEM_INITIALIZING...</div>}>
       <VerifyContent />
    </Suspense>
  );
}

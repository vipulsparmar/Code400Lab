"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Trophy, 
  Zap, 
  Target, 
  History, 
  Award, 
  Calendar,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Code2,
  Upload,
  Link as LinkIcon,
  X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Identity Vault State
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setUser(data);
        if (data.image) setPreviewImage(data.image);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user) fetchProfile();
  }, [session]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const authorizeIdentity = async () => {
    const finalImage = activeTab === "url" ? imageUrl : previewImage;
    if (!finalImage) return;

    try {
      const res = await fetch("/api/user/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: finalImage })
      });
      if (res.ok) {
        setUser({ ...user, image: finalImage });
        setIsUpdatingImage(false);
      }
    } catch (err) {
      console.error("Identity update failed:", err);
    }
  };


  const badges = [
    ...(user?.solved >= 1 ? [{ name: "RPGLE Novice", icon: Zap, color: "text-[#00E676]", bg: "bg-[#00E676]/10" }] : []),
    ...(user?.points >= 1000 ? [{ name: "Logic Sentinel", icon: Target, color: "text-[#5E6AD2]", bg: "bg-[#5E6AD2]/10" }] : []),
    ...(user?.solved >= 10 ? [{ name: "CL Guardian", icon: ShieldCheck, color: "text-[#FFD700]", bg: "bg-[#FFD700]/10" }] : []),
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-10 h-10 text-[#5E6AD2] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        <div className="text-center">
          <p className="text-gray-500 font-mono tracking-widest uppercase mb-4">Identity Unauthenticated</p>
          <Link href="/auth/signin" className="px-6 py-3 rounded-full bg-[#5E6AD2] text-sm font-bold uppercase tracking-widest">Sign In to Authenticate</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pb-20 space-y-12 animate-fade-in text-white relative">
        <section className="relative overflow-hidden p-10 rounded-3xl glass border-white/[0.05] bg-gradient-to-br from-[#121226] via-[#0A0A0A] to-[#0A0A0A]">
           <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl bg-[#5E6AD2] rounded-full -mr-20 -mt-20" />
           
           <div className="relative flex flex-col md:flex-row items-center gap-8 text-white">
              <div className="relative group">
                 <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#5E6AD2] to-[#00E676] p-1 shadow-[0_0_30px_rgba(94,106,210,0.3)] overflow-hidden">
                    <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center text-4xl font-black relative overflow-hidden text-white font-mono">
                       {user.image ? (
                         <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                       ) : (
                         user.name?.charAt(0)
                       )}
                       <button 
                          onClick={() => setIsUpdatingImage(!isUpdatingImage)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-black uppercase tracking-widest text-white"
                       >
                          UPDATE_ID
                       </button>
                    </div>
                 </div>
              </div>
              
              <div className="text-center md:text-left">
                 <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">{user.name}</h1>
                    <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-[10px] font-black uppercase tracking-[0.2em] text-[#00E676]">VERIFIED_EXPERT</span>
                 </div>
                 <p className="text-gray-500 font-mono text-sm tracking-widest uppercase flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-[#5E6AD2]">@{user.username || 'expert'}</span>
                    <span className="opacity-20">•</span>
                    <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                 </p>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {[
                   { label: "Elite Rank", value: user.rank, icon: Trophy, color: "text-[#FFD700]" },
                   { label: "Total XP", value: user.points, icon: Zap, color: "text-[#FFAB00]" },
                   { label: "Solved Labs", value: user.solved, icon: Target, color: "text-[#00E676]" },
                 ].map((stat, i) => (
                   <div key={i} className="glass p-6 group hover:translate-y-[-4px] transition-transform duration-300">
                      <div className="flex items-center justify-between mb-4">
                         <stat.icon className={`w-5 h-5 ${stat.color}`} />
                         <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                   </div>
                 ))}
              </div>

              <div className="glass p-8 border-white/[0.05]">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FFD700]" />
                    Expert Achievement Vault
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {badges.map((badge, i) => (
                      <div key={i} className={`p-4 rounded-xl border border-white/[0.05] ${badge.bg} flex items-center gap-4 group cursor-help transition-all hover:scale-[1.02]`}>
                         <badge.icon className={`w-6 h-6 ${badge.color}`} />
                         <div>
                            <p className="text-xs font-bold text-white tracking-tight">{badge.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Requirement_Met</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass border-white/[0.05] overflow-hidden">
                 <div className="p-6 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                       <History className="w-4 h-4 text-gray-500" />
                       Mission Registry Log
                    </h3>
                 </div>
                 <div className="divide-y divide-white/[0.03]">
                    {user.submissions?.length > 0 ? user.submissions.map((sub: any) => (
                      <div key={sub.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.01] transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center font-bold text-gray-500 group-hover:text-white transition-colors">
                               <Code2 className="w-4 h-4" />
                            </div>
                            <div>
                               <h4 className="font-bold text-white group-hover:text-[#5E6AD2] transition-colors">{sub.problem.title}</h4>
                               <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest flex gap-2">
                                  <span>{sub.problem.language}</span>
                                  <span>•</span>
                                  <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                               </p>
                            </div>
                         </div>
                         <Link href={`/problems/${sub.problemId}`} className="p-2 rounded-full hover:bg-white/[0.05] transition-colors">
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                         </Link>
                      </div>
                    )) : (
                      <div className="p-10 text-center text-gray-600 font-mono text-xs tracking-widest uppercase italic">NO_MISSIONS_REGISTERED</div>
                    )}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="glass p-8 border-white/[0.05]">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#5E6AD2]" />
                    Expert Stats
                 </h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">Completion Rate</span>
                       <span className="text-xs text-white font-black">100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[#5E6AD2] to-[#00E676] w-[100%]" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">Mission Success</span>
                       <span className="text-xs text-[#00E676] font-black">ACTIVE</span>
                    </div>
                 </div>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121226]/50 to-[#0A0A0A] border border-[#5E6AD2]/10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-5 blur-2xl bg-[#00E676] rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity" />
                 <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                    <Calendar className="w-4 h-4 text-[#5E6AD2]" />
                    Activity Signal
                 </h3>
                 <p className="text-xs text-gray-500 leading-relaxed mb-6 relative z-10">The expert registry has confirmed a 100% signal strength in your mission activity over the last 30 days. Continuous arrival is key to reaching the Grandmaster tier.</p>
                 <Link href="/problems" className="text-xs font-black text-[#5E6AD2] hover:text-white transition-colors uppercase tracking-[0.2em] relative z-10">RESUME PRACTICE →</Link>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isUpdatingImage && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
             >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Left Side: Identity Preview */}
                  <div className="w-full md:w-5/12 bg-white/[0.02] p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Identity_Preview</h4>
                    <div className="relative">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#5E6AD2] to-[#00E676] p-1 shadow-[0_0_40px_rgba(94,106,210,0.2)]">
                        <div className="w-full h-full rounded-full bg-[#0A0A0A] overflow-hidden flex items-center justify-center text-5xl font-black">
                          {previewImage ? (
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            user.name?.charAt(0)
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#5E6AD2] border-4 border-[#0A0A0F] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="mt-8 text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center leading-relaxed">
                      Verification status: <span className="text-[#00E676]">Authorized</span>
                    </p>
                  </div>

                  {/* Right Side: Authorization Controls */}
                  <div className="flex-1 p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex gap-4">
                          <button 
                            onClick={() => setActiveTab("upload")}
                            className={`text-[10px] font-black uppercase tracking-widest pb-2 transition-all ${activeTab === 'upload' ? 'text-[#5E6AD2] border-b-2 border-[#5E6AD2]' : 'text-gray-500 hover:text-white'}`}
                          >
                            Local_Upload
                          </button>
                          <button 
                            onClick={() => setActiveTab("url")}
                            className={`text-[10px] font-black uppercase tracking-widest pb-2 transition-all ${activeTab === 'url' ? 'text-[#5E6AD2] border-b-2 border-[#5E6AD2]' : 'text-gray-500 hover:text-white'}`}
                          >
                            Remote_URL
                          </button>
                       </div>
                       <button onClick={() => setIsUpdatingImage(false)} className="text-gray-600 hover:text-white transition-colors">
                          <X className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="min-h-[160px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {activeTab === "upload" ? (
                          <motion.div 
                            key="upload"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4"
                          >
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="tab-upload-v3" />
                            <label 
                              htmlFor="tab-upload-v3"
                              className="w-full p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-[#5E6AD2]/5 hover:border-[#5E6AD2]/30 transition-all cursor-pointer flex flex-col items-center gap-3 group"
                            >
                              <Upload className="w-6 h-6 text-gray-600 group-hover:text-[#5E6AD2] transition-colors" />
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white">Choose Expert Media</span>
                            </label>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="url"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4"
                          >
                             <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input 
                                   type="text" 
                                   value={imageUrl}
                                   onChange={(e) => {
                                      setImageUrl(e.target.value);
                                      setPreviewImage(e.target.value);
                                   }}
                                   placeholder="https://registry.ibm-expert.com/avatar.jpg"
                                   className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-4 pl-12 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#5E6AD2]/50"
                                />
                             </div>
                             <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Supports direct image links from verified registries.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-10 flex gap-3">
                       <button 
                         onClick={authorizeIdentity}
                         className="flex-1 py-4 rounded-xl bg-[#5E6AD2] hover:bg-[#5E6AD2]/80 text-xs font-black text-white uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(94,106,210,0.2)]"
                       >
                         Authorize Visual
                       </button>
                       <button 
                         onClick={() => setIsUpdatingImage(false)}
                         className="px-6 py-4 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all"
                       >
                         Abort
                       </button>
                    </div>
                  </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

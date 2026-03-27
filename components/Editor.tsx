"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Zap, Play, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface EditorProps {
  language: string;
  defaultValue: string;
  onRun: (code: string) => void;
  isLoading?: boolean;
}

export default function CodeEditor({ language, defaultValue, onRun, isLoading }: EditorProps) {
  const [code, setCode] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full bg-[#1E1E1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5E6AD2] animate-spin" />
      </div>
    );
  }

  // Map IBM i languages to Monaco equivalents
  const monacoLanguage = language === "RPGLE" ? "cpp" : "shell"; 

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.05)] bg-[#0A0A0A]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
            <div className="w-2 h-2 rounded-full bg-[#5E6AD2]" />
            <span className="text-xs font-bold text-white tracking-widest">{language}</span>
          </div>
          <span className="text-xs text-gray-500 font-mono italic">**FREE FORMAT ENABLED</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onRun(code)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all text-xs font-bold tracking-widest"
          >
            <Play className="w-3 h-3 fill-gray-400 group-hover:fill-white" />
            RUN TESTS
          </button>
          <button 
            onClick={() => onRun(code)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#5E6AD2] text-white hover:opacity-90 transition-all text-xs font-bold tracking-widest"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 fill-white" />}
            SUBMIT
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={monacoLanguage}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            minimap: { enabled: false },
            padding: { top: 20 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </div>
  );
}

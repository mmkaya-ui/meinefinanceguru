"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ViewType = "dashboard" | "financial-picture" | "monthly" | "amazon" | "salary" | "ask-ai" | "deep-dive" | "report" | "upload" | "settings";
export type LangType = "en" | "de" | "tr";

interface AppContextType {
  data: any;
  setData: (data: any) => void;
  lang: LangType;
  setLang: (lang: LangType) => void;
  apiSecret: string;
  setApiSecret: (secret: string) => void;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
  aiStatus: string;
  setAiStatus: (status: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [lang, setLang] = useState<LangType>("en");
  const [apiSecret, setApiSecret] = useState("");
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiStatus, setAiStatus] = useState("");

  useEffect(() => {
    const storedLang = localStorage.getItem("mfg_lang");
    if (storedLang === "en" || storedLang === "de" || storedLang === "tr") {
      setLang(storedLang);
    }
    const storedKey = localStorage.getItem("mfg_apikey");
    if (storedKey) setApiSecret(storedKey);
  }, []);

  return (
    <AppContext.Provider value={{
      data, setData, lang, setLang, apiSecret, setApiSecret,
      activeView, setActiveView, isUnlocked, setIsUnlocked,
      loading, setLoading, error, setError, aiStatus, setAiStatus
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

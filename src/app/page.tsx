"use client";

import { useEffect } from "react";
import { useApp, AppProvider } from "../context/AppContext";
import { Sidebar } from "../components/layout/Sidebar";
import { MobileHeader } from "../components/layout/MobileHeader";
import { MobileNav } from "../components/layout/MobileNav";
import { PinScreen } from "../components/layout/PinScreen";
import { DashboardView } from "../components/layout/DashboardView";
import { SettingsView } from "../components/layout/SettingsView";
import { UploadView } from "../components/layout/UploadView";

import { t } from "../utils/i18n";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ErrorBoundary from "../components/ErrorBoundary";

const MonthlyBreakdown = dynamic(() => import("../components/MonthlyBreakdown"), { ssr: false });
const AmazonBreakdown = dynamic(() => import("../components/AmazonBreakdown"), { ssr: false });
const SalaryBreakdown = dynamic(() => import("../components/SalaryBreakdown").then(mod => mod.SalaryBreakdown), { ssr: false });
const FinancialPicture = dynamic(() => import("../components/FinancialPicture"), { ssr: false });
const AskAI = dynamic(() => import("../components/AskAI"), { ssr: false });

function AppContent() {
  const { isUnlocked, activeView, lang, data } = useApp();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  if (!isUnlocked) {
    return <PinScreen />;
  }

  let reportContent = data ? data[`report_${lang}`] || "Report translation pending." : "";
  reportContent = reportContent.replace(/\[!IMPORTANT\]/gi, `**${t("IMPORTANT", lang)}:**`);
  reportContent = reportContent.replace(/\[!NOTE\]/gi, `**${t("NOTE", lang)}:**`);
  reportContent = reportContent.replace(/\[!WARNING\]/gi, `**${t("WARNING", lang)}:**`);
  
  let deepDiveContent = data ? data[`deep_dive_${lang}`] || "Deep dive translation pending." : "";
  deepDiveContent = deepDiveContent.replace(/\[!IMPORTANT\]/gi, `**${t("IMPORTANT", lang)}:**`);
  deepDiveContent = deepDiveContent.replace(/\[!NOTE\]/gi, `**${t("NOTE", lang)}:**`);
  deepDiveContent = deepDiveContent.replace(/\[!WARNING\]/gi, `**${t("WARNING", lang)}:**`);
  deepDiveContent = deepDiveContent.replace(/\[!TIP\]/gi, `**${t("TIP", lang)}:**`);

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row bg-transparent">
      <Sidebar />
      <MobileHeader />

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 lg:p-12 z-10 pb-28 md:pb-12 scroll-smooth">
        <AnimatePresence mode="wait">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "financial-picture" && (
            <motion.div key="financial-picture" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <FinancialPicture />
            </motion.div>
          )}
          {activeView === "monthly" && (
            <motion.div key="monthly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{t("Monthly Breakdown", lang)}</h2>
                <p className="text-slate-400">{t("Historical analysis of your cashflow, income, and detailed expenses.", lang)}</p>
              </div>
              <ErrorBoundary><MonthlyBreakdown /></ErrorBoundary>
            </motion.div>
          )}
          {activeView === "amazon" && (
            <motion.div key="amazon" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ErrorBoundary><AmazonBreakdown /></ErrorBoundary>
            </motion.div>
          )}
          {activeView === "salary" && (
            <motion.div key="salary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ErrorBoundary><SalaryBreakdown /></ErrorBoundary>
            </motion.div>
          )}
          {activeView === "ask-ai" && (
            <motion.div key="ask-ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
              <ErrorBoundary><AskAI /></ErrorBoundary>
            </motion.div>
          )}
          {activeView === "upload" && <UploadView />}
          {activeView === "settings" && <SettingsView />}
          {activeView === "report" && (
            <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({node, ...props}) => (
                        <div className="not-prose bg-slate-900/80 border border-slate-700 rounded-2xl p-6 overflow-x-auto my-8 shadow-inner">
                          <pre {...props} className="bg-transparent p-0 m-0 text-sm md:text-base leading-loose font-mono text-emerald-300/90" />
                        </div>
                      ),
                      code: ({node, inline, className, children, ...props}: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!inline && match) {
                          return <code className={className} {...props}>{children}</code>;
                        } else if (!inline) {
                          return <code {...props}>{children}</code>;
                        }
                        return <code {...props} className="bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded-md text-sm font-mono whitespace-nowrap">{children}</code>;
                      }
                    }}
                  >
                    {reportContent}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
          {activeView === "deep-dive" && (
            <motion.div key="deep-dive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl border-l-4 border-l-rose-500">
                <div className="prose prose-invert max-w-none prose-rose">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({node, ...props}) => (
                        <div className="not-prose bg-slate-900/80 border border-slate-700 rounded-2xl p-6 overflow-x-auto my-8 shadow-inner">
                          <pre {...props} className="bg-transparent p-0 m-0 text-sm md:text-base leading-loose font-mono text-emerald-300/90" />
                        </div>
                      ),
                      code: ({node, inline, className, children, ...props}: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!inline && match) {
                          return <code className={className} {...props}>{children}</code>;
                        } else if (!inline) {
                          return <code {...props}>{children}</code>;
                        }
                        return <code {...props} className="bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded-md text-sm font-mono whitespace-nowrap">{children}</code>;
                      }
                    }}
                  >
                    {deepDiveContent}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <MobileNav />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

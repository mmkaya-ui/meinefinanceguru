import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { Upload, RefreshCw, Settings, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { extractTextFromPdf } from "../../utils/pdfExtractor";
import { scrubPII } from "../../utils/scrubber";

export function UploadView() {
  const { lang, data, setData, apiSecret, setActiveView, aiStatus, setAiStatus } = useApp();
  const [successMessage, setSuccessMessage] = useState("");
  const uploadTimeoutRef = useRef<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSuccessMessage("");

    // Fast-path: Direct JSON Import
    if (file.name.endsWith('.json')) {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        setData(parsed);
        setSuccessMessage(t("JSON Backup imported successfully!", lang));
        return;
      } catch (err: any) {
        alert(t("Invalid JSON file.", lang));
        return;
      }
    }

    if (!apiSecret) {
      alert(t("API Key missing. Please navigate to Settings to enter your Gemini API Key (BYOK).", lang));
      setActiveView("settings");
      return;
    }

    setAiStatus(t("Reading statement file & scrubbing PII...", lang));
    try {
      let rawText = "";

      if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
        rawText = await extractTextFromPdf(file);
      } else {
        // Plain text, CSV, TSV
        const text = await file.text();
        rawText = scrubPII(text);
      }

      setAiStatus(t("Semantic parsing via AI (analyzing transactions & categories)...", lang));
      
      uploadTimeoutRef.current = setTimeout(() => {
        setAiStatus(t("Processing large statement... Please wait.", lang));
      }, 15000);

      const res = await fetch('/api/ai/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiSecret}`
        },
        body: JSON.stringify({
          text: rawText,
          currentData: data,
          lang
        })
      });

      clearTimeout(uploadTimeoutRef.current);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to parse statement.");
      }
      
      setData({ ...data, ...result.data });
      setAiStatus("");
      setSuccessMessage(t("Transactions parsed and dashboard updated successfully!", lang));
    } catch (err: any) {
      clearTimeout(uploadTimeoutRef.current);
      setAiStatus("");
      alert(err.message || "Failed to parse or sync statement.");
    }
  };

  return (
    <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto h-full flex flex-col justify-center py-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{t("Universal Bank Statement Import", lang)}</h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          {t("Drop any bank statement (PDF, CSV, TXT, JSON). Our AI semantically interprets dates, amounts, and categories across any bank worldwide.", lang)}
        </p>
      </div>

      {!apiSecret ? (
        <div className="glass-panel border-2 border-amber-500/30 rounded-3xl p-8 flex items-start gap-4">
          <Settings className="w-6 h-6 mt-1 flex-shrink-0 text-amber-500" />
          <div>
            <h3 className="text-xl font-bold text-amber-500 mb-2">{t("BYOK (Bring Your Own Key) Required", lang)}</h3>
            <p className="text-slate-300 text-sm mb-4">
              {t("To use semantic AI statement parsing without a central server, please enter your free Google Gemini API key in Settings.", lang)}
            </p>
            <button 
              onClick={() => setActiveView("settings")}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              {t("Go to Settings", lang)} &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel border-2 border-dashed border-slate-700/50 rounded-3xl p-12 text-center hover:border-emerald-500/50 hover:bg-slate-800/30 transition-all cursor-pointer relative group">
           <input 
             type="file" 
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
             id="statement-upload" 
             accept=".pdf,.csv,.tsv,.txt,.json" 
             onChange={handleFileUpload} 
             disabled={!!aiStatus} 
           />
           <div className="flex flex-col items-center pointer-events-none">
             {aiStatus ? (
               <>
                 <RefreshCw className="w-16 h-16 text-emerald-400 mb-6 animate-spin" />
                 <span className="text-lg font-medium text-emerald-300 max-w-md">{aiStatus}</span>
               </>
             ) : (
               <>
                 <div className="p-6 bg-slate-800/50 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                   <Upload className="w-12 h-12 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                 </div>
                 <span className="text-xl font-semibold text-slate-200">{t("Drop Bank Statement Here", lang)}</span>
                 <span className="text-sm text-slate-400 mt-2 font-medium">{t("Supports PDF, CSV, TXT, JSON exports", lang)}</span>
                 <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                   <FileText className="w-3.5 h-3.5 text-emerald-400" />
                   <span>Sparkasse, Deutsche Bank, N26, Revolut, Garanti, İş Bankası, Chase & more</span>
                 </div>
               </>
             )}
           </div>
        </div>
      )}

      {successMessage && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

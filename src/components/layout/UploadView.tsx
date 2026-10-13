import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { Upload, RefreshCw, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { extractTextFromPdf } from "../../utils/pdfExtractor";

export function UploadView() {
  const { lang, data, setData, apiSecret, setActiveView, aiStatus, setAiStatus } = useApp();
  const uploadTimeoutRef = useRef<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!apiSecret) {
      alert("API Secret missing. Please configure it in Settings first.");
      return;
    }

    setAiStatus(t("Reading PDF Document...", lang));
    try {
      const text = await extractTextFromPdf(file);
      setAiStatus(t("Syncing new data via AI...", lang));
      
      uploadTimeoutRef.current = setTimeout(() => {
        setAiStatus(t("This is taking longer than usual... Please wait.", lang));
      }, 15000);

      const res = await fetch('/api/ai/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiSecret}`
        },
        body: JSON.stringify({
          text,
          currentData: data
        })
      });

      clearTimeout(uploadTimeoutRef.current);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to sync data.");
      }
      
      setData({ ...data, ...result.data });
      setAiStatus("");
      alert(t("Data synced successfully!", lang));
    } catch (err: any) {
      clearTimeout(uploadTimeoutRef.current);
      setAiStatus("");
      alert(err.message || "Failed to parse or sync PDF.");
    }
  };

  return (
    <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      {!apiSecret ? (
        <div className="glass-panel border-2 border-amber-500/30 rounded-3xl p-8 flex items-start gap-4">
          <Settings className="w-6 h-6 mt-1 flex-shrink-0 text-amber-500" />
          <div>
            <h3 className="text-xl font-bold text-amber-500 mb-2">{t("Configuration Required", lang)}</h3>
            <p className="text-slate-300">{t("Please navigate to Settings and enter your API Secret to enable AI sync features.", lang)}</p>
          </div>
        </div>
      ) : (
        <div className="glass-panel border-2 border-dashed border-slate-700/50 rounded-3xl p-16 text-center hover:border-emerald-500/50 hover:bg-slate-800/30 transition-all cursor-pointer relative group">
           <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="pdf-upload" accept="application/pdf" onChange={handleFileUpload} disabled={!!aiStatus} />
           <div className="flex flex-col items-center pointer-events-none">
             {aiStatus ? (
               <>
                 <RefreshCw className="w-16 h-16 text-emerald-400 mb-6 animate-spin" />
                 <span className="text-xl font-medium text-emerald-300">{aiStatus}</span>
               </>
             ) : (
               <>
                 <div className="p-6 bg-slate-800/50 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                   <Upload className="w-12 h-12 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                 </div>
                 <span className="text-xl font-semibold text-slate-200">{t("Drop DB Statement PDF here", lang)}</span>
                 <span className="text-sm text-slate-500 mt-3 font-medium">{t("Automatic Delta Extraction & JSON Hydration", lang)}</span>
               </>
             )}
           </div>
        </div>
      )}
    </motion.div>
  );
}

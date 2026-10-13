import { useRef } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { Download, Upload, Lock, RefreshCcw, ExternalLink, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { sampleDemoFinancialData } from "../../utils/demoData";

export function SettingsView() {
  const { lang, setLang, apiSecret, setApiSecret, data, setData, setIsUnlocked } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meinefinanceguru_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setData(parsed);
        alert(t("Backup restored successfully!", lang));
      } catch (err) {
        alert(t("Failed to parse JSON backup file.", lang));
      }
    };
    reader.readAsText(file);
  };

  const handleLoadDemo = () => {
    if (confirm(t("Replace current data with sample demo data?", lang))) {
      setData(sampleDemoFinancialData);
    }
  };

  const handleLockVault = () => {
    setData(null);
    setIsUnlocked(false);
  };

  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-xl space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{t("Vault Settings", lang)}</h2>
        <p className="text-slate-400">{t("Configure AI keys, import/export data, and security preferences.", lang)}</p>
      </div>

      {/* Language Selector */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">{t("Language & Region", lang)}</h3>
        </div>
        <p className="text-slate-400 text-xs mb-4">
          {t("Select your preferred interface and AI reporting language.", lang)}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { code: "en", label: "English 🇬🇧" },
            { code: "de", label: "Deutsch 🇩🇪" },
            { code: "tr", label: "Türkçe 🇹🇷" }
          ].map(item => (
            <button
              key={item.code}
              onClick={() => {
                setLang(item.code as any);
                localStorage.setItem("mfg_lang", item.code);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                lang === item.code
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* BYOK Authentication */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">{t("BYOK: Google Gemini API Key", lang)}</h3>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <span>Get Free Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-slate-400 text-xs mb-4 leading-relaxed">
          {t("Your API key is stored 100% locally in your browser's localStorage and enables client-side statement parsing and Ask AI. Never sent to any central server.", lang)}
        </p>
        <div className="flex flex-col gap-2">
          <input 
            type="password" 
            value={apiSecret} 
            onChange={(e) => {
              setApiSecret(e.target.value);
              localStorage.setItem("mfg_apikey", e.target.value);
            }}
            placeholder="AIzaSy..."
            className="bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all w-full text-xs font-mono"
          />
          {apiSecret && (
            <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1 font-medium">
              <span>✓ API Key stored securely in browser.</span>
            </p>
          )}
        </div>
      </div>
      
      {/* Documentation & User Manual */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📘</span>
            <h3 className="text-lg font-bold text-white">{t("User Manual & Documentation", lang)}</h3>
          </div>
          <a
            href="https://github.com/mmkaya-ui/meinefinanceguru/blob/main/USER_MANUAL.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors"
          >
            <span>{t("Open Guide", lang)}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          {t("Learn how to decrypt your vault, import bank statements (PDF, CSV, TXT), set up free Gemini AI, and track your wealth.", lang)}
        </p>
      </div>

      {/* Data Management */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">{t("Data Management", lang)}</h3>
        <p className="text-slate-400 text-xs mb-6">{t("Export a complete backup or import your personal JSON dataset.", lang)}</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImportJson} 
          accept=".json" 
          className="hidden" 
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleBackup} 
            className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors text-xs"
          >
            <Download className="w-4 h-4" />
            {t("Download Backup", lang)}
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 text-sky-300 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors text-xs"
          >
            <Upload className="w-4 h-4" />
            {t("Import Backup", lang)}
          </button>
        </div>

        <div className="border-t border-slate-800/80 mt-6 pt-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button 
            onClick={handleLoadDemo} 
            className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            {t("Reset to Sample Demo Data", lang)}
          </button>

          <button 
            onClick={handleLockVault} 
            className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1.5 transition-colors font-medium"
          >
            <Lock className="w-3.5 h-3.5" />
            {t("Lock & Clear Memory", lang)}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

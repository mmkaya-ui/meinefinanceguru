import { useRef } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { Download, Upload, Lock, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { sampleDemoFinancialData } from "../../utils/demoData";

export function SettingsView() {
  const { lang, apiSecret, setApiSecret, data, setData, setIsUnlocked } = useApp();
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

      <div className="glass-panel rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-4">{t("API Authentication", lang)}</h3>
        <p className="text-slate-400 text-sm mb-4">
          {t("Enter your Gemini API key to enable statement parsing and Ask AI features. Stored strictly in your browser's local storage.", lang)}
        </p>
        <div className="flex flex-col gap-2">
          <input 
            type="password" 
            value={apiSecret} 
            onChange={(e) => {
              setApiSecret(e.target.value);
              localStorage.setItem("mfg_apikey", e.target.value);
            }}
            placeholder={t("Enter API Secret...", lang)}
            className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all w-full text-sm font-mono"
          />
        </div>
      </div>
      
      <div className="glass-panel rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-2">{t("Data Management", lang)}</h3>
        <p className="text-slate-400 text-sm mb-6">{t("Export a complete backup or import your personal JSON dataset.", lang)}</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImportJson} 
          accept=".json" 
          className="hidden" 
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleBackup} 
            className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            {t("Download Backup", lang)}
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 text-sky-300 px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            {t("Import Backup", lang)}
          </button>
        </div>

        <div className="border-t border-slate-800/80 mt-6 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
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

import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { Lock, RefreshCw, Upload, Sparkles, PlusCircle } from "lucide-react";
import { decryptPayload } from "../../utils/crypto";
import { sampleDemoFinancialData, emptyFinancialData } from "../../utils/demoData";

export function PinScreen() {
  const { lang, setLang, setData, setIsUnlocked, loading, setLoading, error, setError } = useApp();
  const [password, setPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/encrypted_data.json');
      if (!res.ok) throw new Error("Could not load vault payload.");
      const payload = await res.json();

      const decrypted = await decryptPayload(password, payload);
      setData(decrypted);
      setIsUnlocked(true);
      setPassword(""); // Clear password from memory
    } catch (err) {
      setError(t("Invalid PIN or corrupted vault.", lang) + " (Demo PIN: 123456)");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUnlock = () => {
    setData(sampleDemoFinancialData);
    setIsUnlocked(true);
  };

  const handleEmptyUnlock = () => {
    setData(emptyFinancialData);
    setIsUnlocked(true);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setData(parsed);
        setIsUnlocked(true);
      } catch (err) {
        setError(t("Failed to parse JSON file.", lang));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4">
      <div className="glass-panel p-8 md:p-12 max-w-md w-full rounded-[2rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Lock className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center border border-slate-700/50 shadow-inner">
              <Lock className="w-7 h-7 text-emerald-400" />
            </div>
            {/* Language Switcher */}
            <div className="flex gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              {(["de", "en", "tr"] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLang(l);
                    localStorage.setItem("mfg_lang", l);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                    lang === l ? "bg-emerald-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{t("Vault Locked", lang)}</h2>
          <p className="text-slate-400 mb-6 text-sm">{t("Enter your master PIN to decrypt your financial vault, or import your personal backup.", lang)}</p>
          
          <form onSubmit={handleUnlock} className="space-y-4 mb-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Master PIN (Demo: 123456)", lang)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-center tracking-widest text-xl"
                autoFocus
              />
            </div>
            {error && <p className="text-rose-400 text-sm font-medium text-center bg-rose-500/10 py-2 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : t("Decrypt Vault", lang)}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider font-medium">{t("or explore", lang)}</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="mt-4 space-y-2.5">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportJson} 
              accept=".json" 
              className="hidden" 
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium py-3 rounded-xl border border-slate-700/60 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              {t("Import JSON Backup", lang)}
            </button>

            <button
              type="button"
              onClick={handleDemoUnlock}
              className="w-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-medium py-3 rounded-xl border border-sky-500/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              {t("Load Demo Data (1-Click)", lang)}
            </button>

            <button
              type="button"
              onClick={handleEmptyUnlock}
              className="w-full bg-slate-900/40 hover:bg-slate-800/60 text-slate-400 hover:text-slate-300 font-medium py-2.5 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              {t("Start with Empty Vault", lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

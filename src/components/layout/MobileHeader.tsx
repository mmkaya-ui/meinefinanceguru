import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { TOP_NAV_ITEMS } from "../../constants/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";

export function MobileHeader() {
  const { lang, setLang, activeView, setActiveView, setIsUnlocked, setData } = useApp();

  const handleLock = () => {
    setIsUnlocked(false);
    setData(null);
  };

  return (
    <header className="md:hidden glass-panel border-b border-slate-800/50 flex flex-col shrink-0 sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight leading-tight">MeineFinanceGuru</h1>
              <p className="text-[10px] text-slate-500 tracking-wider font-semibold">Financial Intelligence</p>
            </div>
        </div>
        <div className="flex gap-2">
          {(["de", "en", "tr"] as const).map(l => (
            <button
              key={l}
              aria-label={`Switch to ${l} language`}
              onClick={() => {
                setLang(l);
                localStorage.setItem("mfg_lang", l);
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${lang === l ? "bg-slate-700 text-white shadow-inner" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex overflow-x-auto px-4 pb-3 gap-2 hide-scrollbar w-full">
        {TOP_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-xl transition-all font-medium text-xs border ${activeView === item.id ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-inner" : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30"}`}
          >
            <item.icon className="w-3.5 h-3.5" />
            {t(item.labelKey, lang)}
          </button>
        ))}
        <button 
          onClick={handleLock} 
          className="flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-xl transition-all font-medium text-xs border border-transparent text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
        >
          <LogOut className="w-3.5 h-3.5" />
          {t("Lock Vault", lang)}
        </button>
      </nav>
    </header>
  );
}

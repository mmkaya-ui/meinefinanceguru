import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { BOTTOM_NAV_ITEMS, TOP_NAV_ITEMS } from "../../constants/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";

export function Sidebar() {
  const { lang, setLang, activeView, setActiveView, setIsUnlocked, setData } = useApp();

  const handleLock = () => {
    setIsUnlocked(false);
    setData(null);
  };

  const allNavItems = [...BOTTOM_NAV_ITEMS, ...TOP_NAV_ITEMS];

  return (
    <aside className="hidden md:flex w-64 glass-panel h-full border-r border-slate-800/50 flex-col z-20 shrink-0 pt-safe pb-safe">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight leading-tight">MeineFinanceGuru</h1>
            <p className="text-xs text-slate-500 tracking-wider font-semibold">Financial Intelligence</p>
          </div>
      </div>
      
      <nav className="p-4 space-y-2 flex-grow">
        {allNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeView === item.id ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"}`}
          >
            <item.icon className="w-4 h-4" />
            {t(item.labelKey, lang)}
          </button>
        ))}
      </nav>
      <div className="px-4 pb-4">
        <button onClick={handleLock} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
          <LogOut className="w-4 h-4" />
          {t("Lock Vault", lang)}
        </button>
      </div>

      <div className="p-6 border-t border-slate-800/50">
        <div className="flex gap-2">
          {(["de", "en", "tr"] as const).map(l => (
            <button
              key={l}
              aria-label={`Switch to ${l} language`}
              onClick={() => {
                setLang(l);
                localStorage.setItem("mfg_lang", l);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${lang === l ? "bg-slate-700 text-white shadow-inner" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

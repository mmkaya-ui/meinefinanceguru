import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { BOTTOM_NAV_ITEMS } from "../../constants/navigation";

export function MobileNav() {
  const { lang, activeView, setActiveView } = useApp();

  return (
    <nav className="md:hidden glass-panel border-t border-slate-800/50 fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {BOTTOM_NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all flex-1 ${activeView === item.id ? "text-emerald-400 scale-110" : "text-slate-500 hover:text-slate-300 active:scale-95"}`}
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium tracking-tight truncate w-full text-center">{t(item.labelKey, lang)}</span>
        </button>
      ))}
    </nav>
  );
}

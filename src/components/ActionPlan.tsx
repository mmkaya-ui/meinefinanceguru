"use client";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ActionPlan() {
  const { lang, data } = useApp();
  const tTitle = { en: "Top 5 Action Items", de: "Die Top-5-Maßnahmen", tr: "En Önemli 5 Eylem Adımı" };
  const tSub = { en: "Priority steps to optimize cashflow & buffers", de: "Prioritäre Schritte zur Cashflow-Optimierung", tr: "Nakit akışını optimize etmek için öncelikli adımlar" };
  const tTotal = { en: "Estimated Impact", de: "Geschätzter Effekt", tr: "Tahmini Etki" };
  const tOutlookTitle = { en: "Strategic Outlook:", de: "Strategischer Ausblick:", tr: "Stratejik Bakış:" };
  const tOutlook = { 
    en: "By trimming unused recurring subscriptions, placing a strict cap on discretionary online shopping, and routing surplus cashflow to high-interest balances, you systematically build an automated emergency buffer.",
    de: "Durch die Kündigung ungenutzter Abonnements, eine feste Obergrenze für Konsumausgaben und die konsequente Tilgung hochverzinster Verbindlichkeiten bauen Sie einen stabilen Notgroschen auf.",
    tr: "Kullanılmayan abonelikleri iptal ederek, keyfi online harcamalara disiplinli bir tavan koyarak ve nakit fazlasını borç kapamaya yönlendirerek sağlam bir acil durum fonu oluşturabilirsiniz."
  };

  const defaultActions = {
    en: [
      { id: 1, title: "Audit Recurring Subscriptions", effect: "+€45/month", priority: "IMMEDIATE", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
      { id: 2, title: "Cap Discretionary Online Purchases", effect: "+€180/month", priority: "IMMEDIATE", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
      { id: 3, title: "Optimize Utilities & Energy Tariffs", effect: "+€35/month", priority: "Month 1", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
      { id: 4, title: "Targeted High-Interest Debt Paydown", effect: "Accelerated", priority: "Month 1-3", icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-400/10" },
      { id: 5, title: "Automate Monthly Emergency Buffer", effect: "+€200/month", priority: "Ongoing", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" }
    ],
    de: [
      { id: 1, title: "Wiederkehrende Abonnements prüfen", effect: "+45 €/Monat", priority: "SOFORT", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
      { id: 2, title: "Konsumausgaben im Internet begrenzen", effect: "+180 €/Monat", priority: "SOFORT", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
      { id: 3, title: "Energie- und Telefontarife optimieren", effect: "+35 €/Monat", priority: "Monat 1", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
      { id: 4, title: "Gezielte Tilgung teurer Kredite", effect: "Beschleunigt", priority: "Monat 1-3", icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-400/10" },
      { id: 5, title: "Automatischen Notgroschen ansparen", effect: "+200 €/Monat", priority: "Laufend", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" }
    ],
    tr: [
      { id: 1, title: "Tekrarlayan Abonelikleri Denetle", effect: "+€45/Ay", priority: "HEMEN", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
      { id: 2, title: "Online Keyfi Alışverişe Limit Koy", effect: "+€180/Ay", priority: "HEMEN", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
      { id: 3, title: "Fatura ve Tarife Optimizasyonu", effect: "+€35/Ay", priority: "1. Ay", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
      { id: 4, title: "Yüksek Faizli Borçları Öncelikli Kapat", effect: "Hızlandırılmış", priority: "1-3. Ay", icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-400/10" },
      { id: 5, title: "Aylık Acil Durum Fonunu Otomatikleştiri", effect: "+€200/Ay", priority: "Sürekli", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" }
    ]
  };

  const currentActions = data?.action_plan?.[lang] || defaultActions[lang] || defaultActions.en;
  const totalImpact = { en: "~€460/month", de: "~460 €/Monat", tr: "~€460/Ay" };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{tTitle[lang]}</h3>
          <p className="text-sm text-slate-400">{tSub[lang]}</p>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">{tTotal[lang]}</div>
          <div className="text-xl font-bold text-emerald-300">{totalImpact[lang]}</div>
        </div>
      </div>

      <div className="space-y-3 flex-grow">
        {currentActions.map((action: any, index: number) => {
          const Icon = action.icon || CheckCircle2;
          return (
            <motion.div 
              key={action.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              <div className={`p-3 rounded-lg mr-4 ${action.bg || "bg-emerald-400/10"}`}>
                <Icon className={`w-5 h-5 ${action.color || "text-emerald-400"}`} />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-medium text-sm md:text-base">{action.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                    {action.priority}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold tracking-tight">{action.effect}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl">
        <p className="text-sm text-sky-200">
          <TrendingUp className="w-4 h-4 inline-block mr-2 mb-0.5" />
          <strong>{tOutlookTitle[lang]}</strong> {tOutlook[lang]}
        </p>
      </div>
    </div>
  );
}

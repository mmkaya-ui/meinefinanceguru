import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../utils/i18n";
import { Wallet, TrendingUp, ArrowDownRight, BarChart3, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CashflowPieChart from "../CashflowPieChart";
import ActionPlan from "../ActionPlan";
import ErrorBoundary from "../ErrorBoundary";

const KPICard = ({ title, value, subtext, icon: Icon, trend, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -4 }} 
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={`glass-card p-6 rounded-2xl relative overflow-hidden group ${onClick ? 'cursor-pointer hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]' : ''}`}
  >
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className="w-16 h-16 text-emerald-400" />
    </div>
    <div className="flex items-center gap-2 text-slate-400 mb-2">
      <Icon className="w-5 h-5" />
      <h3 className="font-medium text-sm tracking-wide uppercase">{title}</h3>
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="flex items-center gap-2 text-sm">
      {trend === "up" && <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
      {trend === "down" && <ArrowDownRight className="w-4 h-4 text-sky-400" />}
      <span className={trend === "up" ? "text-emerald-400" : trend === "down" ? "text-sky-400" : "text-slate-400"}>
        {subtext}
      </span>
    </div>
  </motion.div>
);

export function DashboardView() {
  const { data, lang } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal]);

  const kpis = data?.data?.kpis || {};
  const debtsList = Object.entries(kpis.debts || {});
  const salaryData = data?.salary_data || [];
  const latestSalary = salaryData.length > 0 ? salaryData[salaryData.length - 1] : null;

  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{t("Financial Overview", lang)}</h2>
        <p className="text-slate-400">{t("High-level metrics and projections based on the latest data.", lang)}</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard 
          title={t("Net Income", lang)} 
          value={`€${kpis.netIncome?.toLocaleString(lang === "de" ? "de-DE" : "en-US") ?? "0"}`} 
          subtext={kpis.targetBudget ? `${t("Target Budget:", lang)} €${kpis.targetBudget.toLocaleString()}` : t("Monthly Baseline", lang)} 
          icon={Wallet} 
          trend="up" 
          onClick={() => setActiveModal('income')} 
        />
        <KPICard 
          title={t("Free Cashflow", lang)} 
          value={`€${kpis.freeCashflow?.toLocaleString(lang === "de" ? "de-DE" : "en-US") ?? "0"}`} 
          subtext={t("Monthly Buffer", lang)} 
          icon={TrendingUp} 
          trend="up" 
          onClick={() => setActiveModal('cashflow')} 
        />
        <KPICard 
          title={t("Total Debt", lang)} 
          value={`€${kpis.totalDebt?.toLocaleString(lang === "de" ? "de-DE" : "en-US") ?? "0"}`} 
          subtext={t("Active liabilities", lang)} 
          icon={ArrowDownRight} 
          trend="down" 
          onClick={() => setActiveModal('debt')} 
        />
        <KPICard 
          title={debtsList[0] ? debtsList[0][0] : t("Primary Liability", lang)} 
          value={debtsList[0] ? `€${Number(debtsList[0][1]).toLocaleString()}` : "€0"} 
          subtext={t("Priority Paydown", lang)} 
          icon={BarChart3} 
          trend="neutral" 
          onClick={() => setActiveModal('debt')} 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">{t("Cashflow Breakdown", lang)}</h3>
          <ErrorBoundary>
            <div className="h-[300px] w-full">
              <CashflowPieChart />
            </div>
          </ErrorBoundary>
        </div>
        
        <ErrorBoundary><ActionPlan /></ErrorBoundary>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModal(null)} 
                aria-label="Close modal"
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>
              
              {activeModal === 'debt' && (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <ArrowDownRight className="text-sky-400" /> 
                    {t("Debt Breakdown", lang)}
                  </h3>
                  <div className="space-y-4">
                    {debtsList.length > 0 ? (
                      debtsList.map(([title, amount]: any, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                          <span className="text-slate-300 font-medium">{t(title, lang)}</span>
                          <span className="text-white font-bold">€{Number(amount).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm py-4 text-center">{t("No active liabilities recorded.", lang)}</p>
                    )}
                    <div className="border-t border-slate-700 pt-4 mt-4 flex justify-between items-center">
                      <span className="text-emerald-400 font-bold">{t("Total Debt", lang)}</span>
                      <span className="text-2xl text-white font-bold">€{kpis.totalDebt?.toLocaleString() ?? 0}</span>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'income' && (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Wallet className="text-emerald-400" /> 
                    {t("Income Streams", lang)}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                      <span className="text-slate-300 font-medium">{t("Net Monthly Income", lang)}</span>
                      <span className="text-emerald-400 font-bold">€{kpis.netIncome?.toLocaleString() ?? 0}</span>
                    </div>
                    {latestSalary && (
                      <>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                          <span className="text-slate-300 font-medium text-sm">{t("Gross Salary", lang)}</span>
                          <span className="text-slate-400 font-bold text-sm">€{latestSalary.gross?.toLocaleString() ?? 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                          <span className="text-slate-300 font-medium text-sm">{t("Deductions & Taxes", lang)}</span>
                          <span className="text-slate-400 font-bold text-sm">€{(latestSalary.taxes + latestSalary.social_security)?.toLocaleString() ?? 0}</span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {activeModal === 'cashflow' && (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="text-emerald-400" /> 
                    {t("Free Cashflow", lang)}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                      <span className="text-slate-300 font-medium">{t("Net Monthly Income", lang)}</span>
                      <span className="text-emerald-400 font-bold">€{kpis.netIncome?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                      <span className="text-slate-300 font-medium">{t("Target Budget (Expenses)", lang)}</span>
                      <span className="text-rose-400 font-bold">€{kpis.targetBudget?.toLocaleString() ?? ((kpis.netIncome || 0) - (kpis.freeCashflow || 0)).toLocaleString()}</span>
                    </div>
                    <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                        {t("This represents your unallocated buffer every month after all basic living expenses, loans, and discretionary spending are covered.", lang)}
                      </p>
                    </div>
                    <div className="border-t border-slate-700 pt-4 mt-4 flex justify-between items-center">
                      <span className="text-emerald-400 font-bold">{t("Monthly Buffer", lang)}</span>
                      <span className="text-2xl text-white font-bold">€{kpis.freeCashflow?.toLocaleString() ?? 0}</span>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

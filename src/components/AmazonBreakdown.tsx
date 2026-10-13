import { t } from '../utils/i18n';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import { ShoppingCart, RefreshCcw, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useApp } from "../context/AppContext";

export default function AmazonBreakdown() {
  const { data, lang } = useApp();
  const amazonData = data?.amazon_data || [];
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  if (!amazonData || amazonData.lifetime_orders === 0) {
    return <div className="text-slate-400 p-8 text-center">{t("No Amazon data available.", lang)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{t("Amazon Dashboard", lang)}</h2>
        <p className="text-slate-400">{t("Detailed overview of lifetime orders, returns, and net expenditure.", lang)}</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-16 h-16 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Package className="w-5 h-5" />
            <h3 className="font-medium text-sm tracking-wide uppercase">{t("Gross Spent", lang)}</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">€{(amazonData?.lifetime_orders || 0).toLocaleString(lang === "de" ? "de-DE" : "en-US")}</div>
        </motion.div>

        <motion.div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <RefreshCcw className="w-16 h-16 text-rose-400" />
          </div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <RefreshCcw className="w-5 h-5" />
            <h3 className="font-medium text-sm tracking-wide uppercase">{t("Total Refunded", lang)}</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">€{(amazonData?.lifetime_refunds || 0).toLocaleString(lang === "de" ? "de-DE" : "en-US")}</div>
        </motion.div>

        <motion.div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(14,165,233,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart className="w-16 h-16 text-sky-400" />
          </div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <ShoppingCart className="w-5 h-5" />
            <h3 className="font-medium text-sm tracking-wide uppercase">{t("Net Expenditure", lang)}</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">€{(amazonData?.lifetime_net || 0).toLocaleString(lang === "de" ? "de-DE" : "en-US")}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6">{t("Yearly Breakdown", lang)}</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={amazonData?.yearly || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `€${value}`} />
                <RechartsTooltip 
                  allowEscapeViewBox={{ x: false, y: false }}
                  cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: any, name: any) => [`€${Number(value).toLocaleString()}`, t(name as string, lang)]}
                />
                <Legend formatter={(value) => t(value as string, lang)} />
                <Bar dataKey="orders" name={t("Gross Orders", lang)} fill="#34d399" radius={[4, 4, 0, 0]} onClick={(data: any) => setSelectedYear(data.year)} cursor="pointer" />
                <Bar dataKey="refunds" name={t("Refunds", lang)} fill="#fb7185" radius={[4, 4, 0, 0]} onClick={(data: any) => setSelectedYear(data.year)} cursor="pointer" />
                <Bar dataKey="net" name={t("Net Spend", lang)} fill="#38bdf8" radius={[4, 4, 0, 0]} onClick={(data: any) => setSelectedYear(data.year)} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">{t("Yearly Data", lang)}</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">{t("YEAR", lang)}</th>
                  <th className="px-4 py-3 text-right">{t("NET", lang)}</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">{t("REFUNDS", lang)}</th>
                </tr>
              </thead>
              <tbody>
                {[...(amazonData?.yearly || [])].reverse().map((y: any) => (
                  <tr 
                    key={y.year} 
                    onClick={() => setSelectedYear(y.year)} 
                    onKeyDown={(e) => { if(e.key === 'Enter') setSelectedYear(y.year); }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select year ${y.year}`}
                    className={`border-b border-slate-700/50 hover:bg-slate-800/80 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${selectedYear === y.year ? 'bg-slate-800/80 ring-1 ring-sky-500/50' : 'bg-transparent'}`}
                  >
                    <td className="px-4 py-3 font-medium text-white">{y.year}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">€{(y.net || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-rose-400">€{(y.refunds || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedYear && amazonData.yearly_items && amazonData.yearly_items[selectedYear] && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel rounded-2xl overflow-hidden mt-6"
          >
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-sky-400" />
                  {t("Purchased Items for", lang)} {selectedYear}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{t("Excludes fully returned items. Partial returns are proportionally reduced.", lang)}</p>
              </div>
              <button 
                onClick={() => setSelectedYear(null)}
                aria-label="Close details"
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                {(!amazonData?.yearly_items || !amazonData?.yearly_items[selectedYear] || amazonData.yearly_items[selectedYear].length === 0) ? (
                  <div className="text-center py-10 text-slate-400">{t("No items found for this year.", lang)}</div>
                ) : (
                  amazonData.yearly_items[selectedYear].map((item: any, idx: number) => (
                    <div key={`${item.name}-${idx}`} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-slate-800/20 border border-slate-700/50 hover:bg-slate-800/50 transition-colors gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-200 line-clamp-2">{item.name}</h4>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="text-slate-500">{item.date}</span>
                          {Math.abs(item.price - (item.original_price || item.price)) > 0.05 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-medium">
                              {t("Partially Refunded (Original: €", lang)}{(item.original_price || 0).toFixed(2)})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-emerald-400 whitespace-nowrap">
                        €{(item.price || 0).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

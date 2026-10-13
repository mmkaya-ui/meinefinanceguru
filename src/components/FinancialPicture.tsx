// @ts-nocheck
import { t } from '../utils/i18n';
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const COLORS = [
  "#34d399", "#38bdf8", "#fbbf24", "#f87171", "#c084fc", 
  "#a3e635", "#f472b6", "#2dd4bf", "#fb923c", "#818cf8",
  "#64748b", "#94a3b8", "#cbd5e1"
];

interface MonthlyDataEntry {
  month: string;
  income: number;
  expenses: Record<string, number>;
  net: number;
}

interface TransactionEntry {
  date: string;
  name: string;
  category: string;
  amount: number;
}

interface FinancialPictureProps {
  lang?: string;
  monthlyData: MonthlyDataEntry[];
  transactionsData?: TransactionEntry[];
}

import { useApp } from "../context/AppContext";

export default function FinancialPicture() {
  const { data, lang } = useApp();
  const monthlyData = data?.monthly_data || [];
  const transactionsData = data?.transactions_data || [];
  const [activeIndex, setActiveIndex] = useState(-1);
  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Get all unique months sorted
  const allMonths = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return [];
    return [...new Set(monthlyData.map(d => d.month))].sort();
  }, [monthlyData]);

  // Default to the last 12 months, or all available if less
  const defaultStart = useMemo(() => {
    if (allMonths.length === 0) return "";
    return allMonths.length >= 12 ? allMonths[allMonths.length - 12] : allMonths[0];
  }, [allMonths]);

  const defaultEnd = useMemo(() => {
    if (allMonths.length === 0) return "";
    return allMonths[allMonths.length - 1];
  }, [allMonths]);

  const [startMonth, setStartMonth] = useState<string>(defaultStart);
  const [endMonth, setEndMonth] = useState<string>(defaultEnd);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Initialize state once months are loaded if they were empty initially
  React.useEffect(() => {
    if (allMonths.length > 0) {
      if (!startMonth) setStartMonth(defaultStart);
      if (!endMonth) setEndMonth(defaultEnd);
    }
  }, [allMonths, startMonth, endMonth, defaultStart, defaultEnd]);

  // Filter and aggregate data
  const { aggregatedExpenses, totalIncome, totalExpenses, sortedExpenses } = useMemo(() => {
    if (!monthlyData || !startMonth || !endMonth) {
      return { aggregatedExpenses: [], totalIncome: 0, totalExpenses: 0, sortedExpenses: [] };
    }

    const filtered = monthlyData.filter(d => d.month >= startMonth && d.month <= endMonth);

    let inc = 0;
    const expMap: Record<string, number> = {};

    filtered.forEach(entry => {
      inc += entry.income || 0;
      if (entry.expenses) {
        Object.entries(entry.expenses).forEach(([category, amount]) => {
          if (amount > 0) {
            expMap[category] = (expMap[category] || 0) + amount;
          }
        });
      }
    });

    const expArr = Object.entries(expMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Highest to lowest

    // Add colors
    const withColors = expArr.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length]
    }));

    const totExp = expArr.reduce((sum, item) => sum + item.value, 0);

    return {
      aggregatedExpenses: withColors,
      totalIncome: inc,
      totalExpenses: totExp,
      sortedExpenses: expArr
    };
  }, [monthlyData, startMonth, endMonth]);

  if (!monthlyData || monthlyData.length === 0) {
    return <div className="text-slate-400">{t("Loading data...", lang)}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{t("Financial Picture", lang)}</h2>
          <p className="text-slate-400">{t("Analyze your earnings and expenditures over time.", lang)}</p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">{t("From", lang)}</label>
            <select 
              value={startMonth} 
              onChange={(e) => setStartMonth(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
            >
              {allMonths.map(m => (
                <option key={m} value={m} disabled={m > endMonth}>{m}</option>
              ))}
            </select>
          </div>
          <div className="text-slate-600 mt-5">→</div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">{t("To", lang)}</label>
            <select 
              value={endMonth} 
              onChange={(e) => setEndMonth(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
            >
              {allMonths.map(m => (
                <option key={m} value={m} disabled={m < startMonth}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">{t("TOTAL EARNINGS", lang)}</h3>
            <div className="text-3xl font-bold text-emerald-400">€{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">{t("TOTAL EXPENDITURE", lang)}</h3>
            <div className="text-3xl font-bold text-rose-400">€{totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">{t("NET BALANCE", lang)}</h3>
            <div className={`text-3xl font-bold ${(totalIncome - totalExpenses) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              €{(totalIncome - totalExpenses).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">{t("Expenditure Breakdown", lang)}</h3>
            {aggregatedExpenses.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {/* @ts-ignore: recharts types are incomplete */}
                    <Pie 
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={aggregatedExpenses} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={90} 
                      paddingAngle={2} 
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      onMouseLeave={onPieLeave}
                    >
                      {aggregatedExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any, name: any) => [`€${Number(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, t(name as string, lang)]}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} 
                      itemStyle={{ color: '#f8fafc' }} 
                      allowEscapeViewBox={{ x: false, y: false }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500 italic">{t("No expenditures found in this timeframe.", lang)}</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl h-full">
            <h3 className="text-lg font-semibold text-white mb-4">{t("Expenditure List (Highest to Lowest)", lang)}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="py-3 px-4 font-semibold text-slate-300">{t("Category", lang)}</th>
                    <th className="py-3 px-4 font-semibold text-slate-300 text-right">{t("Amount", lang)}</th>
                    <th className="py-3 px-4 font-semibold text-slate-300 text-right">{t("% of Total", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedExpenses.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr 
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer group"
                        onClick={() => setExpandedCategory(expandedCategory === item.name ? null : item.name)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={expandedCategory === item.name}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setExpandedCategory(expandedCategory === item.name ? null : item.name);
                          }
                        }}
                      >
                        <td className="py-3 px-4 text-slate-200 flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                          <span className="font-medium">{t(item.name, lang)}</span>
                          <span className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            {expandedCategory === item.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-rose-400 text-right font-medium">
                          €{item.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-right text-sm">
                          {totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                      
                      {/* Expanded Transaction Row */}
                      <AnimatePresence>
                        {expandedCategory === item.name && (
                          <tr className="bg-slate-900/30">
                            <td colSpan={3} className="p-0 border-b border-slate-800/50">
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pl-10">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="text-slate-500 border-b border-slate-800">
                                        <th className="text-left font-medium pb-2 w-1/4">{t("Date", lang)}</th>
                                        <th className="text-left font-medium pb-2 w-1/2">{t("Description", lang)}</th>
                                        <th className="text-right font-medium pb-2 w-1/4">{t("Amount", lang)}</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                      {transactionsData
                                        .filter(tx => tx.category === item.name && tx.date >= `${startMonth}-01` && tx.date <= `${endMonth}-31`)
                                        .sort((a, b) => b.amount - a.amount)
                                        .map((tx, idx) => (
                                          <tr key={idx} className="hover:bg-slate-800/20">
                                            <td className="py-2 text-slate-400">{tx.date}</td>
                                            <td className="py-2 text-slate-300 truncate max-w-[200px]" title={tx.name}>{tx.name}</td>
                                            <td className="py-2 text-rose-400/80 text-right font-medium">
                                              €{tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                            </td>
                                          </tr>
                                      ))}
                                      {transactionsData.filter(tx => tx.category === item.name && tx.date >= `${startMonth}-01` && tx.date <= `${endMonth}-31`).length === 0 && (
                                        <tr>
                                          <td colSpan={3} className="py-4 text-center text-slate-500 italic">{t("No detailed transactions available.", lang)}</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                  {aggregatedExpenses.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-500 italic">{t("No data available for selected period.", lang)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

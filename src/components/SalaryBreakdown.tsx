import { t } from '../utils/i18n';
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

import { useApp } from "../context/AppContext";

export function SalaryBreakdown() {
  const { data, lang } = useApp();
  const salaryData = data?.salary_data || [];
  const annualData = data?.annual_salary_data || [];
  const locale = lang === 'de' ? 'de-DE' : (lang === 'tr' ? 'tr-TR' : 'en-US');

  const chartData = useMemo(() => {
    // Sort chronological for charts
    const sorted = [...salaryData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map(d => {
      const dateObj = new Date(d.date);
      return {
        ...d,
        monthLabel: dateObj.toLocaleDateString(locale, { month: 'short', year: '2-digit' }),
        net: d.net,
        taxes: d.taxes,
        socialSecurity: d.social_security
      };
    });
  }, [salaryData]);

  if (!salaryData || salaryData.length === 0) {
    return <div className="text-slate-400 p-8 text-center">{t("No salary data available. Please run the salary parser.", lang)}</div>;
  }

  // Sort descending (latest first) to ensure we always grab the most recent for KPIs
  const sortedDesc = [...salaryData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = sortedDesc[0];
  const totalGross = salaryData.reduce((sum: number, d: any) => sum + d.gross, 0);
  const totalNet = salaryData.reduce((sum: number, d: any) => sum + d.net, 0);
  const avgNet = totalNet / salaryData.length;
  
  const taxRate = latest.gross > 0 ? (((latest.gross - latest.net) / latest.gross) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
          <div className="text-slate-400 text-sm font-medium mb-1">{t("Latest Gross Pay", lang)}</div>
          <div className="text-3xl font-bold text-white">€{latest.gross.toLocaleString(locale, {minimumFractionDigits: 2})}</div>
          <div className="text-xs text-slate-500 mt-2">{new Date(latest.date).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
          <div className="text-slate-400 text-sm font-medium mb-1">{t("Latest Net Pay", lang)}</div>
          <div className="text-3xl font-bold text-emerald-400">€{latest.net.toLocaleString(locale, {minimumFractionDigits: 2})}</div>
          <div className="text-xs text-emerald-400/70 mt-2 bg-emerald-500/10 px-2 py-1 rounded-full">{t("Take home", lang)}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
          <div className="text-slate-400 text-sm font-medium mb-1">{t("Avg Net Income", lang)}</div>
          <div className="text-3xl font-bold text-sky-400">€{avgNet.toLocaleString(locale, {minimumFractionDigits: 2})}</div>
          <div className="text-xs text-sky-400/70 mt-2 bg-sky-500/10 px-2 py-1 rounded-full">
            {lang === 'tr' ? `${salaryData.length} ay ortalaması` : lang === 'de' ? `Über ${salaryData.length} Monate` : `Over ${salaryData.length} months`}
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
          <div className="text-slate-400 text-sm font-medium mb-1">{t("Effective Tax Rate", lang)}</div>
          <div className="text-3xl font-bold text-rose-400">{taxRate}%</div>
          <div className="text-xs text-rose-400/70 mt-2 bg-rose-500/10 px-2 py-1 rounded-full">{t("Taxes & Social", lang)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">{t("Income vs Deductions Over Time", lang)}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(val: number) => `€${val/1000}k`} />
                <Tooltip 
                  allowEscapeViewBox={{ x: false, y: false }}
                  cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                  formatter={(value: any) => `€${Number(value).toLocaleString(locale, {minimumFractionDigits: 2})}`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="net" name={t("Net Pay", lang)} stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="socialSecurity" name={t("Social Security", lang)} stackId="a" fill="#3b82f6" />
                <Bar dataKey="taxes" name={t("Taxes", lang)} stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">{t("Gross Pay Trend", lang)}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(val: number) => `€${val/1000}k`} />
                <Tooltip 
                  allowEscapeViewBox={{ x: false, y: false }}
                  formatter={(value: any) => `€${Number(value).toLocaleString(locale, {minimumFractionDigits: 2})}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="gross" name="Gross Pay" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGross)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {annualData.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl mt-6">
          <h3 className="text-lg font-semibold text-white mb-6">{t("Historical Annual Income (ELB/ELF)", lang)}</h3>
          <div className="text-sm text-slate-400 mb-6">{t("Complementary overview of annual tax summaries for prior years.", lang)}</div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...annualData].reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(val: number) => `€${val/1000}k`} />
                <Tooltip 
                  allowEscapeViewBox={{ x: false, y: false }}
                  cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                  formatter={(value: any) => `€${Number(value).toLocaleString(locale, {minimumFractionDigits: 2})}`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="gross" name={t("Annual Gross", lang)} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" name={t("Annual Net", lang)} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/80">
          <h3 className="text-lg font-semibold text-white">{t("Payslip History", lang)}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 font-semibold">{t("Month", lang)}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("Gross Pay", lang)}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("Taxes", lang)}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("Social Security", lang)}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("Net Pay", lang)}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("Effective Tax Rate", lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedDesc.map((d: any, i: number) => (
                <tr key={i} className="hover:bg-slate-800/70 transition-colors border-b border-slate-700/50 last:border-0">
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {new Date(d.date).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300">
                    €{d.gross.toLocaleString(locale, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-right text-rose-400">
                    -€{d.taxes.toLocaleString(locale, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-right text-sky-400">
                    -€{d.social_security.toLocaleString(locale, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                    €{d.net.toLocaleString(locale, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400">
                    {d.gross > 0 ? (((d.gross - d.net) / d.gross) * 100).toFixed(1) : "—"}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

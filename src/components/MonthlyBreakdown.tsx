"use client";
import { t } from '../utils/i18n';

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from "recharts";

interface MonthData {
  month: string;
  income: number;
  expenses: Record<string, number>;
  net: number;
}

interface MonthlyBreakdownProps {
  data: MonthData[];
}

import { useApp } from "../context/AppContext";

export default function MonthlyBreakdown() {
  const { data: appData, lang } = useApp();
  const data = appData?.monthly_data;
  if (!data || data.length === 0) {
    return <div className="text-slate-400 p-8 text-center">{t("No monthly data available.", lang)}</div>;
  }

  // Prepare data for the chart by flattening expenses and extract dynamic categories
  const { chartData, categories } = useMemo(() => {
    const cats = new Set<string>();
    const preparedData = data.map((d: any) => {
      let totalExpenses = 0;
      Object.entries(d.expenses || {}).forEach(([key, val]) => {
        totalExpenses += val as number;
        cats.add(key);
      });
      
      return {
        name: d.month,
        Income: d.income,
        TotalExpenses: totalExpenses,
        Net: d.net,
        ...d.expenses
      };
    });
    return { chartData: preparedData, categories: Array.from(cats) };
  }, [data]);
  
  // A simple predefined color palette for dynamic categories
  const colors = ["#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#eab308", "#475569", "#64748b", "#f43f5e", "#10b981", "#84cc16", "#06b6d4"];

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-3xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">{t("Net Cashflow Trend (Income vs Expenses)", lang)}</h2>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                allowEscapeViewBox={{ x: false, y: false }}
                cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px" }}
                itemStyle={{ color: "#f8fafc" }}
              />
              <Legend formatter={(value) => t(value as string, lang)} />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="TotalExpenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="Net" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">{t("Expense Categories by Month", lang)}</h2>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                allowEscapeViewBox={{ x: false, y: false }}
                cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px" }}
                itemStyle={{ color: "#f8fafc" }}
              />
              <Legend formatter={(value) => t(value as string, lang)} />
              {categories.map((cat, idx) => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={colors[idx % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

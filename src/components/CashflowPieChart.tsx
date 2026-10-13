// @ts-nocheck
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";

import { useApp } from "../context/AppContext";

export default function CashflowPieChart() {
  const { data, lang } = useApp();
  const budgetData = data?.data?.budgetBreakdown || [];
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        {/* @ts-ignore: recharts types are incomplete */}
        <Pie 
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={budgetData} 
          cx="50%" 
          cy="50%" 
          innerRadius={80} 
          outerRadius={110} 
          paddingAngle={2} 
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {budgetData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
          ))}
        </Pie>
        <Tooltip allowEscapeViewBox={{ x: false, y: false }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

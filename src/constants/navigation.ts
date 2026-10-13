import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Activity, FileText, ShoppingCart, Wallet, Bot, Upload, Settings } from "lucide-react";
import { ViewType } from "../context/AppContext";

export const BOTTOM_NAV_ITEMS: { id: ViewType, icon: any, labelKey: string }[] = [
  { id: "dashboard", icon: BarChart3, labelKey: "Dashboard" },
  { id: "financial-picture", icon: PieChartIcon, labelKey: "Picture" },
  { id: "monthly", icon: LineChartIcon, labelKey: "Monthly" },
  { id: "deep-dive", icon: Activity, labelKey: "Leaks" },
  { id: "report", icon: FileText, labelKey: "Report" }
];

export const TOP_NAV_ITEMS: { id: ViewType, icon: any, labelKey: string }[] = [
  { id: "amazon", icon: ShoppingCart, labelKey: "Amazon Dashboard" },
  { id: "salary", icon: Wallet, labelKey: "Salary & Tax" },
  { id: "ask-ai", icon: Bot, labelKey: "Ask AI" },
  { id: "upload", icon: Upload, labelKey: "AI Sync" },
  { id: "settings", icon: Settings, labelKey: "Settings" }
];

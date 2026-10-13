/**
 * Background Pro Analytics Modules
 * Ready for future UI activation.
 */

export interface TaxDeductionItem {
  category: string;
  name: string;
  estimatedAmount: number;
  taxWriteOffReason: string;
}

export function detectTaxDeductions(transactions: any[] = []): {
  totalEstimatedDeductions: number;
  items: TaxDeductionItem[];
} {
  const items: TaxDeductionItem[] = [];

  const taxKeywords = [
    { pattern: /(telekom|vodafone|internet|dsl)/i, category: "Work From Home / Utilities", reason: "50% Home-Office telecommunications allowance" },
    { pattern: /(apotheke|arzt|klinik|krankenkasse|dental|optik)/i, category: "Healthcare / Medical", reason: "Extraordinary financial burden (Außergewöhnliche Belastungen)" },
    { pattern: /(bvg|bahn|db|ticket|tankstelle|esso|aral|shell)/i, category: "Commuting / Travel", reason: "Pendlerpauschale (Commuter allowance)" },
    { pattern: /(spende|donation|unicef|rotes kreuz|humanitarian)/i, category: "Donations & Charitable", reason: "Tax-deductible charitable contribution (Sonderausgaben)" },
    { pattern: /(versicherung|allianz|ergo|huk|haftpflicht)/i, category: "Insurance (Liability/Accident)", reason: "Private liability & accident insurance deduction (Vorsorgeaufwand)" }
  ];

  transactions.forEach((tx: any) => {
    const desc = `${tx.name || ''} ${tx.description || ''}`;
    for (const rule of taxKeywords) {
      if (rule.pattern.test(desc)) {
        items.push({
          category: rule.category,
          name: tx.name || "Expense",
          estimatedAmount: Math.abs(Number(tx.amount) || 0),
          taxWriteOffReason: rule.reason
        });
        break;
      }
    }
  });

  const total = items.reduce((sum, item) => sum + item.estimatedAmount, 0);
  return { totalEstimatedDeductions: total, items };
}

export interface SubscriptionLeakItem {
  name: string;
  monthlyAmount: number;
  annualCost: number;
  cancellationNoticeDays: number;
}

export function detectSubscriptionLeaks(transactions: any[] = []): {
  annualLeakTotal: number;
  subscriptions: SubscriptionLeakItem[];
} {
  const recurringMap: Record<string, number> = {};

  transactions.forEach((tx: any) => {
    const amt = Math.abs(Number(tx.amount) || 0);
    if (amt > 0 && tx.name) {
      // Look for identical monthly amounts
      const key = tx.name.trim();
      recurringMap[key] = (recurringMap[key] || 0) + amt;
    }
  });

  const subscriptions: SubscriptionLeakItem[] = [];
  Object.entries(recurringMap).forEach(([name, total]) => {
    if (total > 30) {
      const avgMonthly = total / 3; // approximation over timeframe
      subscriptions.push({
        name,
        monthlyAmount: Math.round(avgMonthly * 100) / 100,
        annualCost: Math.round(avgMonthly * 12 * 100) / 100,
        cancellationNoticeDays: 30
      });
    }
  });

  const annualLeakTotal = subscriptions.reduce((sum, item) => sum + item.annualCost, 0);
  return { annualLeakTotal, subscriptions };
}

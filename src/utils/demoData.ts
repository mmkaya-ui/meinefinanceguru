export const emptyFinancialData = {
  data: {
    kpis: {
      netIncome: 0,
      freeCashflow: 0,
      totalDebt: 0,
      targetBudget: 0,
      debts: {}
    }
  },
  monthly_data: [],
  transactions_data: [],
  amazon_data: {
    lifetime_orders: 0,
    lifetime_refunds: 0,
    lifetime_net: 0,
    yearly: []
  },
  salary_data: [],
  annual_salary_data: [],
  report_en: "# Financial Report\n\nNo report data available. Please import your statement or sync via AI.",
  report_de: "# Finanzbericht\n\nKeine Berichtsdaten verfügbar. Bitte importieren Sie Ihre Kontoauszüge.",
  report_tr: "# Finansal Rapor\n\nHenüz rapor verisi bulunmuyor. Lütfen veri aktarımı yapın veya yapay zeka ile senkronize edin.",
  deep_dive_en: "# Deep Dive Analysis\n\nImport financial statements to generate deep dive insights.",
  deep_dive_de: "# Tiefenanalyse\n\nImportieren Sie Kontoauszüge für detaillierte Einblicke.",
  deep_dive_tr: "# Detaylı İnceleme\n\nFinansal belgelerinizi yükleyerek detaylı analiz oluşturun."
};

export const sampleDemoFinancialData = {
  data: {
    kpis: {
      netIncome: 4250,
      freeCashflow: 620,
      totalDebt: 14500,
      targetBudget: 3630,
      debts: {
        "Personal Loan": 9800,
        "Credit Card Balance": 2700,
        "Overdraft Buffer": 2000
      }
    }
  },
  monthly_data: [
    {
      month: "2026-01",
      income: 4200,
      net: 550,
      expenses: { "Housing & Rent": 1250, "Groceries": 580, "Utilities": 240, "Transportation": 190, "Discretionary": 410, "Debt Repayment": 980 }
    },
    {
      month: "2026-02",
      income: 4200,
      net: 610,
      expenses: { "Housing & Rent": 1250, "Groceries": 540, "Utilities": 230, "Transportation": 180, "Discretionary": 410, "Debt Repayment": 980 }
    },
    {
      month: "2026-03",
      income: 4350,
      net: 720,
      expenses: { "Housing & Rent": 1250, "Groceries": 560, "Utilities": 240, "Transportation": 190, "Discretionary": 410, "Debt Repayment": 980 }
    },
    {
      month: "2026-04",
      income: 4200,
      net: 480,
      expenses: { "Housing & Rent": 1250, "Groceries": 620, "Utilities": 250, "Transportation": 210, "Discretionary": 410, "Debt Repayment": 980 }
    },
    {
      month: "2026-05",
      income: 5800,
      net: 1950,
      expenses: { "Housing & Rent": 1250, "Groceries": 590, "Utilities": 230, "Transportation": 200, "Discretionary": 600, "Debt Repayment": 980 }
    },
    {
      month: "2026-06",
      income: 4250,
      net: 620,
      expenses: { "Housing & Rent": 1250, "Groceries": 570, "Utilities": 240, "Transportation": 190, "Discretionary": 400, "Debt Repayment": 980 }
    }
  ],
  transactions_data: [
    { date: "2026-06-28", name: "Organic Supermarket", category: "Groceries", amount: 64.20 },
    { date: "2026-06-27", name: "Metro Transport Ticket", category: "Transportation", amount: 49.00 },
    { date: "2026-06-25", name: "Municipal Electricity", category: "Utilities", amount: 112.50 },
    { date: "2026-06-24", name: "Bookstore & Stationer", category: "Discretionary", amount: 34.90 },
    { date: "2026-06-20", name: "Local Pharmacy", category: "Healthcare", amount: 28.40 },
    { date: "2026-06-18", name: "Internet Fiber Provider", category: "Utilities", amount: 39.99 },
    { date: "2026-06-15", name: "Monthly Housing Transfer", category: "Housing & Rent", amount: 1250.00 },
    { date: "2026-06-12", name: "Green Grocer Farm Shop", category: "Groceries", amount: 48.75 },
    { date: "2026-06-08", name: "Cloud Storage Subscription", category: "Discretionary", amount: 9.99 },
    { date: "2026-06-01", name: "Employer Monthly Payroll", category: "Income", amount: 4250.00 }
  ],
  amazon_data: {
    lifetime_orders: 4820.50,
    lifetime_refunds: 320.00,
    lifetime_net: 4500.50,
    yearly: [
      { year: "2024", total_orders: 1650, total_refunds: 110, net_orders: 1540 },
      { year: "2025", total_orders: 1820, total_refunds: 140, net_orders: 1680 },
      { year: "2026", total_orders: 1350.50, total_refunds: 70, net_orders: 1280.50 }
    ]
  },
  salary_data: [
    { date: "2026-01-01", gross: 6300, net: 4200, taxes: 1150, social_security: 950, bonus: 0 },
    { date: "2026-02-01", gross: 6300, net: 4200, taxes: 1150, social_security: 950, bonus: 0 },
    { date: "2026-03-01", gross: 6500, net: 4350, taxes: 1180, social_security: 970, bonus: 0 },
    { date: "2026-04-01", gross: 6300, net: 4200, taxes: 1150, social_security: 950, bonus: 0 },
    { date: "2026-05-01", gross: 8800, net: 5800, taxes: 1850, social_security: 1150, bonus: 2500 },
    { date: "2026-06-01", gross: 6350, net: 4250, taxes: 1140, social_security: 960, bonus: 0 }
  ],
  annual_salary_data: [
    { year: "2024", gross: 74000, net: 49500 },
    { year: "2025", gross: 78000, net: 52000 },
    { year: "2026", gross: 81000, net: 54000 }
  ],
  report_en: `# Strategic Financial Intelligence Report

> **Account Status:** Active & Balanced  
> **Model:** Conservative Growth & High-Yield Debt Paydown  
> **Analysis Period:** Last 12 Months Run-rate  

---

## 1. Executive Summary

Your monthly financial profile demonstrates healthy structural discipline. With a net monthly baseline of **€4,250**, fixed living expenses account for approximately **58%** of net income, leaving a solid **€620 monthly buffer** (Free Cashflow).

### Key Recommendations
1. **Targeted Debt Paydown:** Allocate 60% of surplus cashflow to high-interest balances.
2. **Buffer Automation:** Maintain an emergency reserve equal to 3 months of basic living costs.
3. **Discretionary Capping:** Maintain non-essential spending below 15% of net income.
`,
  report_de: `# Strategischer Finanzbericht

> **Kontostatus:** Aktiv & Ausgeglichen  
> **Strategie:** Konservativer Vermögensaufbau & Schuldentilgung  
> **Analysezeitraum:** Letzte 12 Monate  

---

## 1. Zusammenfassung

Ihr monatliches Finanzprofil zeigt eine gesunde Struktur. Bei einem monatlichen Nettoeinkommen von **4.250 €** machen die festen Lebenshaltungskosten rund **58%** aus, was einen verlässlichen **monatlichen Puffer von 620 €** ermöglicht.
`,
  report_tr: `# Stratejik Finansal Rapor

> **Hesap Durumu:** Aktif & Dengeli  
> **Strateji:** Tasarruf & Yüksek Öncelikli Borç Eritme  
> **Dönem:** Son 12 Aylık Projeksiyon  

---

## 1. Yönetici Özeti

Aylık finansal profiliniz güçlü bir nakit akışı sunmaktadır. **€4.250** net gelir tabanında sabit giderleriniz gelirin yaklaşık **%58'ini** oluşturmakta, bu da aylık **€620 serbest nakit fazlası (Free Cashflow)** sağlamaktadır.
`
};

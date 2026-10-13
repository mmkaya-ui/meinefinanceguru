import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  amount: z.number().finite(),
  category: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const SalaryEntrySchema = z.object({
  date: z.string(),
  gross: z.number().finite().nonnegative().optional(),
  net: z.number().finite().nonnegative().optional(),
  taxes: z.number().finite().nonnegative().optional(),
  social_security: z.number().finite().nonnegative().optional(),
  bonus: z.number().finite().optional(),
});

export const KPIsSchema = z.object({
  totalIncome: z.number().finite().optional(),
  totalExpenses: z.number().finite().optional(),
  netIncome: z.number().finite().optional(),
  freeCashflow: z.number().finite().optional(),
  totalDebt: z.number().finite().optional(),
  targetBudget: z.number().finite().optional(),
  debts: z.record(z.string(), z.number().finite()).optional(),
});

export const BudgetBreakdownSchema = z.object({
  name: z.string(),
  value: z.number().finite()
});

export const MonthlySchema = z.object({
  month: z.string(),
  income: z.number().finite().optional(),
  expenses: z.any().optional(),
  net: z.number().finite().optional()
});

export const FinancialDataSchema = z.object({
  data: z.object({
    kpis: KPIsSchema.optional(),
  }).optional(),
  kpis: KPIsSchema.optional(),
  budgetBreakdown: z.array(BudgetBreakdownSchema).optional(),
  monthly_data: z.array(z.any()).optional(),
  monthly: z.array(z.any()).optional(),
  salary_data: z.array(z.any()).optional(),
  transactions_data: z.array(z.any()).optional(),
  transactions: z.array(z.any()).optional(),
  amazon_data: z.any().optional(),
  amazon: z.any().optional(),
  annual_salary_data: z.any().optional(),
  report_en: z.string().optional(),
  report_de: z.string().optional(),
  report_tr: z.string().optional(),
  deep_dive_en: z.string().optional(),
  deep_dive_de: z.string().optional(),
  deep_dive_tr: z.string().optional()
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type SalaryEntry = z.infer<typeof SalaryEntrySchema>;
export type KPIs = z.infer<typeof KPIsSchema>;
export type FinancialData = z.infer<typeof FinancialDataSchema>;

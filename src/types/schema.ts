import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  amount: z.number().finite(),
  category: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const SalaryEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}(?:-\d{2})?$/, "Invalid date format"),
  gross: z.number().finite().nonnegative(),
  net: z.number().finite().nonnegative(),
  taxes: z.number().finite().nonnegative(),
  social_security: z.number().finite().nonnegative(),
});

export const KPIsSchema = z.object({
  totalIncome: z.number().finite().optional(),
  totalExpenses: z.number().finite().optional(),
  netIncome: z.number().finite().optional(),
  freeCashflow: z.number().finite().optional(),
  totalDebt: z.number().finite().optional(),
  debts: z.record(z.string(), z.number().finite()).optional(),
});

export const BudgetBreakdownSchema = z.object({
  name: z.string(),
  value: z.number().finite()
});

export const MonthlySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Invalid month format"),
  income: z.number().finite(),
  expenses: z.number().finite()
});

export const FinancialDataSchema = z.object({
  kpis: KPIsSchema.optional(),
  budgetBreakdown: z.array(BudgetBreakdownSchema).optional(),
  monthly: z.array(MonthlySchema).optional(),
  salary_data: z.array(SalaryEntrySchema).optional(),
  transactions: z.array(TransactionSchema).optional(),
  amazon: z.any().optional(),
  annual_salary_data: z.any().optional()
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type SalaryEntry = z.infer<typeof SalaryEntrySchema>;
export type KPIs = z.infer<typeof KPIsSchema>;
export type FinancialData = z.infer<typeof FinancialDataSchema>;


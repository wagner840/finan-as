/**
 * @fileoverview Zod schemas for finance data validation with branded types
 * @module features/finance/schemas/financeSchemas
 */

import { z } from 'zod';

/**
 * Branded type for Transaction IDs to ensure type safety
 */
export const TransactionIdSchema = z.string().uuid().brand<'TransactionId'>();

/**
 * Branded type for Category IDs to ensure type safety
 */
export const CategoryIdSchema = z.string().min(1).brand<'CategoryId'>();

/**
 * Transaction type enum schema
 */
export const TransactionTypeSchema = z.enum(['income', 'expense']);

/**
 * Category schema with validation rules
 * 
 * @example
 * ```typescript
 * const category = CategorySchema.parse({
 *   id: 'cat-1',
 *   name: 'Alimentação',
 *   color: '#FF6B6B'
 * });
 * ```
 */
export const CategorySchema = z.object({
  id: CategoryIdSchema,
  name: z.string()
    .min(1, 'Nome da categoria é obrigatório')
    .max(50, 'Nome da categoria deve ter no máximo 50 caracteres'),
  color: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal #RRGGBB'),
});

/**
 * Transaction schema with comprehensive validation
 * 
 * Financial amounts are stored in cents (integers) to avoid floating point precision issues.
 * 
 * @example
 * ```typescript
 * const transaction = TransactionSchema.parse({
 *   id: crypto.randomUUID(),
 *   amount: 80000, // R$ 800,00 em centavos
 *   type: 'expense',
 *   categoryId: 'cat-1',
 *   description: 'Supermercado',
 *   date: '2024-01-02'
 * });
 * ```
 */
export const TransactionSchema = z.object({
  id: TransactionIdSchema,
  amount: z.number()
    .int('Valor deve ser um número inteiro (em centavos)')
    .positive('Valor deve ser positivo')
    .max(999999999, 'Valor máximo excedido'), // R$ 9.999.999,99
  type: TransactionTypeSchema,
  categoryId: CategoryIdSchema,
  description: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      return parsedDate <= today;
    }, 'Data não pode ser no futuro'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Schema for creating a new transaction (without generated fields)
 */
export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating a transaction
 */
export const UpdateTransactionSchema = CreateTransactionSchema.partial();

/**
 * Complete finance data structure schema
 */
export const FinanceDataSchema = z.object({
  transactions: z.array(TransactionSchema),
  categories: z.array(CategorySchema),
  version: z.string().default('1.0'),
  lastModified: z.string().datetime().optional(),
});

/**
 * Schema for transaction filters
 */
export const TransactionFiltersSchema = z.object({
  categoryId: CategoryIdSchema.optional(),
  type: TransactionTypeSchema.optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  search: z.string().optional(),
});

/**
 * Schema for financial summary calculations
 */
export const FinancialSummarySchema = z.object({
  totalIncome: z.number().int().nonnegative(),
  totalExpenses: z.number().int().nonnegative(),
  balance: z.number().int(),
  expensesByCategory: z.record(CategoryIdSchema, z.number().int().nonnegative()),
  incomeByCategory: z.record(CategoryIdSchema, z.number().int().nonnegative()),
});

/**
 * Default categories with predefined colors and IDs
 */
export const defaultCategories = [
  { id: 'cat-alimentacao' as const, name: 'Alimentação', color: '#FF6B6B' },
  { id: 'cat-transporte' as const, name: 'Transporte', color: '#4ECDC4' },
  { id: 'cat-lazer' as const, name: 'Lazer', color: '#45B7D1' },
  { id: 'cat-saude' as const, name: 'Saúde', color: '#96CEB4' },
  { id: 'cat-moradia' as const, name: 'Moradia', color: '#FECA57' },
  { id: 'cat-educacao' as const, name: 'Educação', color: '#FF9FF3' },
  { id: 'cat-salario' as const, name: 'Salário', color: '#10B981' },
  { id: 'cat-outros' as const, name: 'Outros', color: '#54A0FF' },
] as const;

/**
 * Validation helper to ensure category exists
 */
export const validateCategoryExists = (
  categoryId: string,
  categories: z.infer<typeof CategorySchema>[]
): boolean => {
  return categories.some(cat => cat.id === categoryId);
};

/**
 * Helper to convert currency input to cents
 * 
 * @param currencyString - String like "123.45" or "123,45"
 * @returns Amount in cents
 */
export const currencyToCents = (currencyString: string): number => {
  // Replace comma with dot for parsing
  const normalized = currencyString.replace(',', '.');
  const amount = parseFloat(normalized);
  
  if (isNaN(amount)) {
    throw new Error('Valor inválido');
  }
  
  return Math.round(amount * 100);
};

/**
 * Helper to convert cents to currency display
 * 
 * @param cents - Amount in cents
 * @returns Formatted currency string
 */
export const centsToDisplay = (cents: number): string => {
  return (cents / 100).toFixed(2).replace('.', ',');
};
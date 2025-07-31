/**
 * @fileoverview TypeScript types derived from Zod schemas for finance domain
 * @module features/finance/types/financeTypes
 */

import { z } from 'zod';
import {
  TransactionIdSchema,
  CategoryIdSchema,
  TransactionTypeSchema,
  CategorySchema,
  TransactionSchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
  FinanceDataSchema,
  TransactionFiltersSchema,
  FinancialSummarySchema,
} from '../schemas/financeSchemas';

/**
 * Branded type for Transaction IDs
 */
export type TransactionId = z.infer<typeof TransactionIdSchema>;

/**
 * Branded type for Category IDs
 */
export type CategoryId = z.infer<typeof CategoryIdSchema>;

/**
 * Transaction type enum
 */
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

/**
 * Category interface with validation
 * 
 * @interface Category
 * @property id - Unique identifier for the category
 * @property name - Display name of the category
 * @property color - Hex color code for visual representation
 */
export type Category = z.infer<typeof CategorySchema>;

/**
 * Transaction interface with all required fields
 * 
 * @interface Transaction
 * @property id - Unique identifier for the transaction
 * @property amount - Amount in cents (to avoid floating point issues)
 * @property type - Whether this is income or expense
 * @property categoryId - Reference to the category
 * @property description - User description of the transaction
 * @property date - Date in YYYY-MM-DD format
 * @property createdAt - Timestamp when transaction was created
 * @property updatedAt - Timestamp when transaction was last updated
 */
export type Transaction = z.infer<typeof TransactionSchema>;

/**
 * Data for creating a new transaction (excludes generated fields)
 */
export type CreateTransactionData = z.infer<typeof CreateTransactionSchema>;

/**
 * Data for updating an existing transaction (all fields optional)
 */
export type UpdateTransactionData = z.infer<typeof UpdateTransactionSchema>;

/**
 * Complete finance data structure
 * 
 * @interface FinanceData
 * @property transactions - Array of all transactions
 * @property categories - Array of all categories
 * @property version - Data format version for migration purposes
 * @property lastModified - Timestamp of last modification
 */
export type FinanceData = z.infer<typeof FinanceDataSchema>;

/**
 * Filters for transaction queries
 * 
 * @interface TransactionFilters
 * @property categoryId - Filter by specific category
 * @property type - Filter by transaction type (income/expense)
 * @property dateFrom - Start date for date range filter
 * @property dateTo - End date for date range filter
 * @property search - Text search in description
 */
export type TransactionFilters = z.infer<typeof TransactionFiltersSchema>;

/**
 * Financial summary with calculated totals
 * 
 * @interface FinancialSummary
 * @property totalIncome - Sum of all income transactions in cents
 * @property totalExpenses - Sum of all expense transactions in cents
 * @property balance - Net balance (income - expenses) in cents
 * @property expensesByCategory - Expenses grouped by category ID
 * @property incomeByCategory - Income grouped by category ID
 */
export type FinancialSummary = z.infer<typeof FinancialSummarySchema>;

/**
 * Chart data for visualization components
 */
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

/**
 * Props for transaction form component
 */
export interface TransactionFormProps {
  transaction?: Transaction;
  categories: Category[];
  onSubmit: (data: CreateTransactionData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Props for transaction list component
 */
export interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: TransactionId) => void;
  filters?: TransactionFilters;
  onFiltersChange?: (filters: TransactionFilters) => void;
}

/**
 * Props for category manager component
 */
export interface CategoryManagerProps {
  categories: Category[];
  onCreate: (categoryData: Omit<Category, 'id'>) => void;
  onUpdate: (categoryId: CategoryId, categoryData: Partial<Category>) => void;
  onDelete: (categoryId: CategoryId) => void;
  transactionCounts: Record<CategoryId, number>;
}

/**
 * Props for dashboard component
 */
export interface DashboardProps {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  categories: Category[];
  onAddTransaction: () => void;
  onManageCategories: () => void;
}

/**
 * Props for charts component
 */
export interface ChartsProps {
  summary: FinancialSummary;
  categories: Category[];
  className?: string;
}

/**
 * Hook return type for finance data management
 */
export interface UseFinanceDataReturn {
  data: FinanceData;
  summary: FinancialSummary;
  isLoading: boolean;
  error: string | null;
  
  // Transaction operations
  addTransaction: (transaction: CreateTransactionData) => Promise<void>;
  updateTransaction: (id: TransactionId, transaction: UpdateTransactionData) => Promise<void>;
  deleteTransaction: (id: TransactionId) => Promise<void>;
  getTransaction: (id: TransactionId) => Transaction | undefined;
  
  // Category operations
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: CategoryId, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: CategoryId) => Promise<void>;
  getCategory: (id: CategoryId) => Category | undefined;
  
  // Utility operations
  filterTransactions: (filters: TransactionFilters) => Transaction[];
  calculateSummary: (transactions?: Transaction[]) => FinancialSummary;
  resetData: () => Promise<void>;
  exportData: () => string;
  importData: (data: string) => Promise<void>;
}

/**
 * Hook return type for localStorage management
 */
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  loading: boolean;
  error: string | null;
  remove: () => void;
}

/**
 * Application state management types
 */
export type AppView = 'dashboard' | 'transactions' | 'categories' | 'reports';

export interface AppState {
  currentView: AppView;
  isTransactionFormOpen: boolean;
  isCategoryManagerOpen: boolean;
  editingTransaction: Transaction | null;
}

/**
 * Error types for better error handling
 */
export interface FinanceErrorInfo {
  name: string;
  message: string;
  code: string;
  details?: unknown;
}

export interface ValidationErrorInfo extends FinanceErrorInfo {
  code: 'VALIDATION_ERROR';
}

export interface StorageErrorInfo extends FinanceErrorInfo {
  code: 'STORAGE_ERROR';
}
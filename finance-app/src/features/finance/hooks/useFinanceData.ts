/**
 * @fileoverview Main hook for managing finance data with CRUD operations and calculations
 * @module features/finance/hooks/useFinanceData
 */

import { useState, useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import {
  FinanceDataSchema,
  TransactionSchema,
  CategorySchema,
  CreateTransactionSchema,
  defaultCategories,
} from "../schemas/financeSchemas";
import type {
  FinanceData,
  Transaction,
  Category,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionFilters,
  FinancialSummary,
  UseFinanceDataReturn,
  TransactionId,
  CategoryId,
} from "../types/financeTypes";

/**
 * Main hook for managing personal finance data
 *
 * Provides CRUD operations for transactions and categories, automatic calculations,
 * filtering, and localStorage persistence. Follows the financial calculation rules
 * specified in the PRP (using cents for precision).
 *
 * @returns Complete finance data management interface
 *
 * @example
 * ```typescript
 * const {
 *   data,
 *   summary,
 *   addTransaction,
 *   addCategory,
 *   filterTransactions
 * } = useFinanceData();
 *
 * // Add a new expense
 * await addTransaction({
 *   amount: 80000, // R$ 800,00 in cents
 *   type: 'expense',
 *   categoryId: 'cat-alimentacao',
 *   description: 'Supermercado',
 *   date: '2024-01-15'
 * });
 * ```
 */
// Default data structure (moved outside to prevent recreation)
const createDefaultData = (): FinanceData => ({
  transactions: [],
  categories: defaultCategories.map((cat) => CategorySchema.parse(cat)),
  version: "1.0",
  lastModified: new Date().toISOString(),
});

const defaultData: FinanceData = createDefaultData();

export function useFinanceData(): UseFinanceDataReturn {

  // Persistent storage with validation
  const {
    value: data,
    setValue: setData,
    loading: isLoading,
    error: storageError,
  } = useLocalStorage("finance-data", defaultData);

  const [error, setError] = useState<string | null>(null);

  // Combine storage and operation errors
  const currentError = useMemo(() => {
    return storageError || error;
  }, [storageError, error]);

  // Update data with validation and timestamp
  const updateData = useCallback(
    (updater: (currentData: FinanceData) => FinanceData): void => {
      try {
        setData((currentData) => {
          const newData = updater(currentData);
          const dataWithTimestamp = {
            ...newData,
            lastModified: new Date().toISOString(),
          };

          // Validate entire data structure
          const validatedData = FinanceDataSchema.parse(dataWithTimestamp);
          return validatedData;
        });
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(`Erro ao atualizar dados: ${errorMessage}`);
        console.error("Error updating finance data:", err);
      }
    },
    [setData]
  );

  // Transaction operations
  const addTransaction = useCallback(
    async (transactionData: CreateTransactionData): Promise<void> => {
      try {
        console.log('🔥 addTransaction called with:', transactionData);
        console.log('🔥 Current data before update:', data);
        
        // Validate transaction data
        const validatedData = CreateTransactionSchema.parse(transactionData);
        console.log('🔥 Validated transaction data:', validatedData);

        updateData((currentData) => {
          console.log('🔥 updateData callback - currentData:', currentData);
          
          // Check if category exists
          const categoryExists = currentData.categories.some(
            (cat) => cat.id === validatedData.categoryId
          );
          if (!categoryExists) {
            throw new Error("Categoria não encontrada");
          }

          // Create transaction with generated ID and timestamps
          const newTransaction: Transaction = {
            id: crypto.randomUUID() as TransactionId,
            ...validatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Validate complete transaction
          const validatedTransaction = TransactionSchema.parse(newTransaction);
          console.log('🔥 Created transaction:', validatedTransaction);

          const updatedData = {
            ...currentData,
            transactions: [...currentData.transactions, validatedTransaction],
          };
          
          console.log('🔥 Updated data to return:', updatedData);
          console.log('🔥 localStorage after update:', localStorage.getItem('finance-data'));
          
          return updatedData;
        });
        
        console.log('🔥 addTransaction completed successfully');
      } catch (err) {
        console.error('🔥 addTransaction error:', err);
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao adicionar transação";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateData]
  );

  const updateTransaction = useCallback(
    async (
      id: TransactionId,
      updates: UpdateTransactionData
    ): Promise<void> => {
      try {
        updateData((currentData) => {
          const transactionIndex = currentData.transactions.findIndex(
            (t) => t.id === id
          );
          if (transactionIndex === -1) {
            throw new Error("Transação não encontrada");
          }

          const existingTransaction = currentData.transactions[transactionIndex];
          const updatedTransaction = {
            ...existingTransaction,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          // Validate updated transaction
          const validatedTransaction =
            TransactionSchema.parse(updatedTransaction);

          // Check if category exists (if being updated)
          if (updates.categoryId) {
            const categoryExists = currentData.categories.some(
              (cat) => cat.id === updates.categoryId
            );
            if (!categoryExists) {
              throw new Error("Categoria não encontrada");
            }
          }

          const newTransactions = [...currentData.transactions];
          newTransactions[transactionIndex] = validatedTransaction;

          return {
            ...currentData,
            transactions: newTransactions,
          };
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar transação";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateData]
  );

  const deleteTransaction = useCallback(
    async (id: TransactionId): Promise<void> => {
      try {
        updateData((currentData) => {
          const transactionExists = currentData.transactions.some((t) => t.id === id);
          if (!transactionExists) {
            throw new Error("Transação não encontrada");
          }

          const newTransactions = currentData.transactions.filter((t) => t.id !== id);
          return {
            ...currentData,
            transactions: newTransactions,
          };
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao excluir transação";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateData]
  );

  const getTransaction = useCallback(
    (id: TransactionId): Transaction | undefined => {
      return data.transactions.find((t) => t.id === id);
    },
    [data.transactions]
  );

  // Category operations
  const addCategory = useCallback(
    async (categoryData: Omit<Category, "id">): Promise<void> => {
      try {
        updateData((currentData) => {
          // Check for duplicate names
          const nameExists = currentData.categories.some(
            (cat) => cat.name.toLowerCase() === categoryData.name.toLowerCase()
          );
          if (nameExists) {
            throw new Error("Já existe uma categoria com este nome");
          }

          // Create category with generated ID
          const newCategory: Category = {
            id: `cat-${Date.now()}` as CategoryId,
            ...categoryData,
          };

          // Validate category
          const validatedCategory = CategorySchema.parse(newCategory);

          return {
            ...currentData,
            categories: [...currentData.categories, validatedCategory],
          };
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao adicionar categoria";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateData]
  );

  const updateCategory = useCallback(
    async (id: CategoryId, updates: Partial<Category>): Promise<void> => {
      try {
        updateData((currentData) => {
          const categoryIndex = currentData.categories.findIndex((c) => c.id === id);
          if (categoryIndex === -1) {
            throw new Error("Categoria não encontrada");
          }

          // Check for duplicate names (excluding current category)
          if (updates.name) {
            const nameExists = currentData.categories.some(
              (cat) =>
                cat.id !== id &&
                cat.name.toLowerCase() === updates.name!.toLowerCase()
            );
            if (nameExists) {
              throw new Error("Já existe uma categoria com este nome");
            }
          }

          const existingCategory = currentData.categories[categoryIndex];
          const updatedCategory = { ...existingCategory, ...updates };

          // Validate updated category
          const validatedCategory = CategorySchema.parse(updatedCategory);

          const newCategories = [...currentData.categories];
          newCategories[categoryIndex] = validatedCategory;

          return {
            ...currentData,
            categories: newCategories,
          };
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar categoria";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateData]
  );

  const deleteCategory = useCallback(
    async (id: CategoryId): Promise<void> => {
      try {
        updateData((currentData) => {
          const categoryExists = currentData.categories.some((c) => c.id === id);
          if (!categoryExists) {
            throw new Error("Categoria não encontrada");
          }

          // Check if category is being used by any transactions
          const isUsed = currentData.transactions.some((t) => t.categoryId === id);
          if (isUsed) {
            throw new Error(
              "Não é possível excluir categoria que possui transações"
            );
          }

          const newCategories = currentData.categories.filter((c) => c.id !== id);
          return {
            ...currentData,
            categories: newCategories,
          };
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao excluir categoria";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateData]
  );

  const getCategory = useCallback(
    (id: CategoryId): Category | undefined => {
      return data.categories.find((c) => c.id === id);
    },
    [data.categories]
  );

  // Filtering operations
  const filterTransactions = useCallback(
    (filters: TransactionFilters): Transaction[] => {
      return data.transactions.filter((transaction) => {
        // Filter by category
        if (
          filters.categoryId &&
          transaction.categoryId !== filters.categoryId
        ) {
          return false;
        }

        // Filter by type
        if (filters.type && transaction.type !== filters.type) {
          return false;
        }

        // Filter by date range
        if (filters.dateFrom && transaction.date < filters.dateFrom) {
          return false;
        }
        if (filters.dateTo && transaction.date > filters.dateTo) {
          return false;
        }

        // Filter by search term
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const descriptionMatch = transaction.description
            .toLowerCase()
            .includes(searchTerm);
          const categoryMatch = data.categories
            .find((c) => c.id === transaction.categoryId)
            ?.name.toLowerCase()
            .includes(searchTerm);

          if (!descriptionMatch && !categoryMatch) {
            return false;
          }
        }

        return true;
      });
    },
    [data.transactions, data.categories]
  );

  // Financial calculations
  const calculateSummary = useCallback(
    (transactions?: Transaction[]): FinancialSummary => {
      const summary: FinancialSummary = {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        expensesByCategory: {},
        incomeByCategory: {},
      };

      if (!transactions) {
        return summary;
      }

      transactions.forEach((transaction) => {
        if (transaction.type === "income") {
          summary.totalIncome += transaction.amount;
          summary.incomeByCategory[transaction.categoryId] =
            (summary.incomeByCategory[transaction.categoryId] || 0) +
            transaction.amount;
        } else {
          summary.totalExpenses += transaction.amount;
          summary.expensesByCategory[transaction.categoryId] =
            (summary.expensesByCategory[transaction.categoryId] || 0) +
            transaction.amount;
        }
      });

      summary.balance = summary.totalIncome - summary.totalExpenses;

      return summary;
    },
    []
  );

  // Memoized financial summary
  const summary = useMemo(() => {
    return calculateSummary(data.transactions);
  }, [data.transactions, calculateSummary]);

  // Utility operations
  const resetData = useCallback(async (): Promise<void> => {
    try {
      setData(defaultData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao resetar dados";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [setData]);

  const exportData = useCallback((): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao exportar dados";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [data]);

  const importData = useCallback(
    async (jsonData: string): Promise<void> => {
      try {
        const parsedData = JSON.parse(jsonData);
        const validatedData = FinanceDataSchema.parse(parsedData);
        setData(validatedData);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao importar dados";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [setData]
  );

  return {
    data,
    summary,
    isLoading,
    error: currentError,

    // Transaction operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,

    // Category operations
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,

    // Utility operations
    filterTransactions,
    calculateSummary,
    resetData,
    exportData,
    importData,
  };
}

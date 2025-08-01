/**
 * @fileoverview Paginated transaction list with filters and search
 * @module features/finance/components/TransactionList
 */

import { useState, useMemo, useCallback } from "react";
import type { ReactElement } from "react";
import { TransactionCard } from "./TransactionCard";
import { Button } from "../../../shared/components/UI/Button";
import { Input, Select } from "../../../shared/components/UI/Input";
import { getTodayString } from "../../../shared/utils/formatters";
import type {
  Transaction,
  TransactionFilters,
  TransactionListProps,
  TransactionId,
} from "../types/financeTypes";

/**
 * Pagination controls component
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps): ReactElement => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return <></>;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
        <span>
          Mostrando <span className="font-medium">{startItem}</span> até{" "}
          <span className="font-medium">{endItem}</span> de{" "}
          <span className="font-medium">{totalItems}</span> transações
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Anterior
        </Button>

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "secondary"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-8 h-8 p-0"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

/**
 * Paginated transaction list with advanced filters
 *
 * Displays transactions in a paginated list with search, filtering, and sorting capabilities.
 * Includes controls for managing transactions and adjusting display options.
 *
 * @component
 * @example
 * ```tsx
 * <TransactionList
 *   transactions={transactions}
 *   categories={categories}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   filters={currentFilters}
 *   onFiltersChange={handleFiltersChange}
 * />
 * ```
 */
export const TransactionList = ({
  transactions,
  categories,
  onEdit,
  onDelete,
  filters = {},
  onFiltersChange,
}: TransactionListProps): ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "description">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Internal filter state
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  // Apply filters and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (localFilters.search) {
      const searchTerm = localFilters.search.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchTerm) ||
          categories
            .find((cat) => cat.id === transaction.categoryId)
            ?.name.toLowerCase()
            .includes(searchTerm)
      );
    }

    // Apply category filter
    if (localFilters.categoryId) {
      filtered = filtered.filter(
        (transaction) => transaction.categoryId === localFilters.categoryId
      );
    }

    // Apply type filter
    if (localFilters.type) {
      filtered = filtered.filter(
        (transaction) => transaction.type === localFilters.type
      );
    }

    // Apply date range filters
    if (localFilters.dateFrom) {
      filtered = filtered.filter(
        (transaction) => transaction.date >= localFilters.dateFrom!
      );
    }

    if (localFilters.dateTo) {
      filtered = filtered.filter(
        (transaction) => transaction.date <= localFilters.dateTo!
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "description":
          comparison = a.description.localeCompare(b.description);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, categories, localFilters, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset pagination when filters change
  const handleFiltersChange = useCallback(
    (newFilters: TransactionFilters) => {
      setLocalFilters(newFilters);
      setCurrentPage(1);
      onFiltersChange?.(newFilters);
    },
    [onFiltersChange]
  );

  // Handle individual filter changes
  const updateFilter = (key: keyof TransactionFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    handleFiltersChange(newFilters);
  };

  // Handle clear filters
  const clearFilters = () => {
    const emptyFilters: TransactionFilters = {};
    setLocalFilters(emptyFilters);
    setCurrentPage(1);
    onFiltersChange?.(emptyFilters);
  };

  // Handle duplicate transaction
  const handleDuplicate = (transaction: Transaction) => {
    // Create a new transaction based on the existing one
    const duplicateData = {
      amount: transaction.amount,
      type: transaction.type,
      categoryId: transaction.categoryId,
      description: `${transaction.description} (Cópia)`,
      date: getTodayString(),
    };

    // For now, just trigger the edit with the duplicate data
    onEdit({
      ...transaction,
      ...duplicateData,
      id: "" as TransactionId, // Will be generated on save
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Transações ({filteredAndSortedTransactions.length})
          </h2>

          <div className="flex items-center space-x-3">
            {/* Items per page selector */}
            <Select
              value={itemsPerPage.toString()}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-20"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Select>

            {/* Sort controls - Increased width to prevent text truncation */}
            <Select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-") as [
                  typeof sortBy,
                  typeof sortOrder
                ];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-48 min-w-0"
            >
              <option value="date-desc">Data (Mais recente)</option>
              <option value="date-asc">Data (Mais antiga)</option>
              <option value="amount-desc">Valor (Maior)</option>
              <option value="amount-asc">Valor (Menor)</option>
              <option value="description-asc">Descrição (A-Z)</option>
              <option value="description-desc">Descrição (Z-A)</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {/* Main filters row - optimized layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* Search - spans more columns for better visibility */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <Input
              type="text"
              placeholder="Buscar transações..."
              value={localFilters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              startIcon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>

          {/* Category filter */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <Select
              value={localFilters.categoryId || ""}
              onChange={(e) => updateFilter("categoryId", e.target.value)}
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Type filter */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo
            </label>
            <Select
              value={localFilters.type || ""}
              onChange={(e) => updateFilter("type", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </Select>
          </div>

          {/* Date range - better aligned */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Período
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Data inicial"
                value={localFilters.dateFrom || ""}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                endIcon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
              <Input
                type="date"
                placeholder="Data final"
                value={localFilters.dateTo || ""}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
                endIcon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* Clear filters button */}
        {Object.keys(localFilters).some(
          (key) => localFilters[key as keyof TransactionFilters]
        ) && (
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {paginatedTransactions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {transactions.length === 0
                ? "Adicione sua primeira transação para começar."
                : "Tente ajustar os filtros para encontrar as transações desejadas."}
            </p>
          </div>
        ) : (
          paginatedTransactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4">
              <TransactionCard
                transaction={transaction}
                categories={categories}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={handleDuplicate}
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedTransactions.length}
        />
      )}
    </div>
  );
};

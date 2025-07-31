/**
 * @fileoverview Individual transaction card component with actions
 * @module features/finance/components/TransactionCard
 */

import { useState } from 'react';
import type { ReactElement } from 'react';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { Button, IconButton } from '../../../shared/components/UI/Button';
import type { Transaction, Category, TransactionId } from '../types/financeTypes';

/**
 * Props for the TransactionCard component
 */
export interface TransactionCardProps {
  /** Transaction data to display */
  transaction: Transaction;
  
  /** Available categories for display */
  categories: Category[];
  
  /** Handler for editing the transaction */
  onEdit: (transaction: Transaction) => void;
  
  /** Handler for deleting the transaction */
  onDelete: (transactionId: TransactionId) => void;
  
  /** Handler for duplicating the transaction */
  onDuplicate?: (transaction: Transaction) => void;
  
  /** Whether actions are disabled */
  disabled?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Individual transaction card with actions and information preview
 * 
 * Displays transaction details in a card format with action buttons for
 * editing, deleting, and duplicating transactions. Includes confirmation
 * dialog for destructive actions.
 * 
 * @component
 * @example
 * ```tsx
 * <TransactionCard
 *   transaction={transaction}
 *   categories={categories}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onDuplicate={handleDuplicate}
 * />
 * ```
 */
export const TransactionCard = ({
  transaction,
  categories,
  onEdit,
  onDelete,
  onDuplicate,
  disabled = false,
  className = '',
}: TransactionCardProps): ReactElement => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get category information
  const category = categories.find(cat => cat.id === transaction.categoryId);
  const categoryName = category?.name || 'Categoria desconhecida';
  const categoryColor = category?.color || '#6B7280';

  // Handle delete confirmation
  const handleDeleteClick = (): void => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (): void => {
    onDelete(transaction.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (): void => {
    setShowDeleteConfirm(false);
  };

  // Handle duplicate transaction
  const handleDuplicate = (): void => {
    if (onDuplicate) {
      onDuplicate(transaction);
    }
  };

  const cardClasses = [
    'card hover:shadow-md transition-shadow duration-200 relative',
    disabled ? 'opacity-50 pointer-events-none' : '',
    className
  ].filter(Boolean).join(' ');

  const amountColor = transaction.type === 'income' 
    ? 'text-success-600' 
    : 'text-danger-600';

  const amountPrefix = transaction.type === 'income' ? '+' : '-';

  return (
    <div className={cardClasses}>
      {/* Main Content */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Category Color Indicator */}
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
            style={{ backgroundColor: categoryColor }}
            aria-label={`Categoria: ${categoryName}`}
          />
          
          {/* Transaction Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
                {transaction.description}
              </h3>
              <span className={`text-sm font-bold whitespace-nowrap ${amountColor}`}>
                {amountPrefix}{formatCurrency(transaction.amount, { showSymbol: false })}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{categoryName}</span>
              <span>•</span>
              <span>{formatDate(transaction.date)}</span>
              <span>•</span>
              <span className="capitalize">
                {transaction.type === 'income' ? 'Receita' : 'Despesa'}
              </span>
            </div>
            
            {/* Timestamps for debugging (only in dev) */}
            {process.env.NODE_ENV === 'development' && (transaction.createdAt || transaction.updatedAt) && (
              <div className="mt-1 text-xs text-gray-400">
                {transaction.createdAt && (
                  <span>Criado: {new Date(transaction.createdAt).toLocaleString('pt-BR')}</span>
                )}
                {transaction.updatedAt && transaction.updatedAt !== transaction.createdAt && (
                  <span className="ml-2">
                    Editado: {new Date(transaction.updatedAt).toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 ml-2">
          {onDuplicate && (
            <IconButton
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
              variant="secondary"
              size="sm"
              onClick={handleDuplicate}
              aria-label="Duplicar transação"
              disabled={disabled}
            />
          )}
          
          <IconButton
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            variant="secondary"
            size="sm"
            onClick={() => onEdit(transaction)}
            aria-label="Editar transação"
            disabled={disabled}
          />
          
          <IconButton
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
            variant="danger"
            size="sm"
            onClick={handleDeleteClick}
            aria-label="Excluir transação"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Excluir Transação
                </h3>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  {transaction.description}
                </div>
                <div className="text-gray-600">
                  {categoryName} • {formatDate(transaction.date)}
                </div>
                <div className={`font-semibold ${amountColor}`}>
                  {amountPrefix}{formatCurrency(transaction.amount, { showSymbol: false })}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={handleCancelDelete}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                className="flex-1"
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
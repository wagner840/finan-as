/**
 * @fileoverview Transaction form component with react-hook-form and Zod validation
 * @module features/finance/components/TransactionForm
 */

import { useEffect, useState, useRef } from 'react';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../shared/components/UI/Button';
import { Input, Select, TextArea } from '../../../shared/components/UI/Input';
import { ColorSwatch } from '../../../shared/components/UI/ColorPicker';
import { CreateTransactionSchema } from '../schemas/financeSchemas';
import { formatCurrency, getTodayString, parseCurrency, safeParseCurrency } from '../../../shared/utils/formatters';
import type { 
  CreateTransactionData, 
  Category,
  TransactionFormProps 
} from '../types/financeTypes';

/**
 * Transaction form component with comprehensive validation
 * 
 * Provides a complete form interface for creating and editing financial transactions.
 * Features include real-time validation, currency input masking, and accessibility support.
 * 
 * @component
 * @example
 * ```tsx
 * <TransactionForm
 *   transaction={editingTransaction}
 *   categories={categories}
 *   onSubmit={handleSubmitTransaction}
 *   onCancel={handleCancel}
 *   isLoading={isSubmitting}
 * />
 * ```
 */
export const TransactionForm = ({
  transaction,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}: TransactionFormProps): ReactElement => {
  const isEditing = Boolean(transaction);
  
  // Create form with explicit typing to resolve TypeScript issues
  const form = useForm({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      amount: 0,
      type: 'expense' as const,
      categoryId: '',
      description: '',
      date: getTodayString(),
    },
  });
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  // Watch form values for real-time updates
  const watchedType = watch('type');
  const watchedAmount = watch('amount');
  const watchedCategoryId = watch('categoryId');
  
  // Separate state for amount display value to handle user input properly
  const [amountDisplayValue, setAmountDisplayValue] = useState('');
  const initializedRef = useRef<string | null>(null);

  // Populate form when editing a transaction (run only once per transaction)
  useEffect(() => {
    const currentTransactionId = transaction?.id || 'new';
    
    // Only initialize if this is a different transaction or first load
    if (initializedRef.current !== currentTransactionId) {
      initializedRef.current = currentTransactionId;
      
      if (transaction) {
        setValue('amount', transaction.amount);
        setValue('type', transaction.type);
        setValue('categoryId', transaction.categoryId);
        setValue('description', transaction.description);
        setValue('date', transaction.date);
        
        // Set display value for amount
        setAmountDisplayValue(
          transaction.amount > 0 
            ? formatCurrency(transaction.amount, { showSymbol: false })
            : ''
        );
      } else {
        reset({
          amount: 0,
          type: 'expense',
          categoryId: '',
          description: '',
          date: getTodayString(),
        });
        setAmountDisplayValue('');
      }
    }
  }, [transaction?.id, setValue, reset]); // Include necessary dependencies

  // Handle form submission
  const handleFormSubmit = async (data: CreateTransactionData): Promise<void> => {
    const transactionData: CreateTransactionData = {
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      description: data.description,
      date: data.date,
    };
    try {
      await onSubmit(transactionData);
      
      // Reset form only if not editing (for new transactions)
      if (!isEditing) {
        reset({
          amount: 0,
          type: 'expense',
          categoryId: '',
          description: '',
          date: getTodayString(),
        });
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  // Handle currency input with improved parsing and display
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    
    // Update display value immediately for responsive typing
    setAmountDisplayValue(inputValue);
    
    // Parse and validate the input
    const cents = safeParseCurrency(inputValue);
    setValue('amount', cents, { shouldValidate: true });
  };
  
  // Handle blur to format the final value
  const handleAmountBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    
    if (inputValue.trim() === '') {
      setAmountDisplayValue('');
      setValue('amount', 0);
      return;
    }
    
    try {
      const cents = parseCurrency(inputValue);
      if (cents > 0) {
        // Format the value for display
        const formatted = formatCurrency(cents, { showSymbol: false });
        setAmountDisplayValue(formatted);
        setValue('amount', cents);
      } else {
        setAmountDisplayValue('');
        setValue('amount', 0);
      }
    } catch {
      // If parsing fails, keep the user input
      console.warn('Invalid currency input on blur:', inputValue);
    }
  };

  // Get available categories for the selected transaction type
  const getAvailableCategories = (): Category[] => {
    // For now, return all categories. In the future, we could filter by type
    return categories;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Fechar formulário"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <input
                type="radio"
                value="income"
                {...register('type')}
                className="sr-only peer"
              />
              <div className="btn btn-secondary peer-checked:btn-primary w-full flex items-center justify-center cursor-pointer">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Receita
              </div>
            </label>
            
            <label className="relative">
              <input
                type="radio"
                value="expense"
                {...register('type')}
                className="sr-only peer"
              />
              <div className="btn btn-secondary peer-checked:btn-primary w-full flex items-center justify-center cursor-pointer">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                Despesa
              </div>
            </label>
          </div>
          {errors.type && (
            <p className="error-text">{errors.type.message}</p>
          )}

          {/* Amount */}
          <div>
            <Input
              label="Valor"
              type="text"
              placeholder="0,00"
              value={amountDisplayValue}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              error={errors.amount?.message}
              required
              startIcon={
                <span className="text-gray-500 font-medium">R$</span>
              }
            />
          </div>

          {/* Category */}
          <div>
            <Select
              label="Categoria"
              {...register('categoryId')}
              error={errors.categoryId?.message}
              required
            >
              <option value="">Selecione uma categoria</option>
              {getAvailableCategories().map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            
            {/* Category Color Preview */}
            {watchedCategoryId && (() => {
              const selectedCategory = categories.find(c => c.id === watchedCategoryId);
              return selectedCategory ? (
                <div className="flex items-center mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <ColorSwatch 
                    color={selectedCategory.color} 
                    size="sm" 
                    aria-label={`Cor da categoria ${selectedCategory.name}`}
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedCategory.name}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Esta cor será exibida nos relatórios e listas
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {/* Date */}
          <div>
            <Input
              label="Data"
              type="date"
              {...register('date')}
              error={errors.date?.message}
              required
            />
          </div>

          {/* Description */}
          <div>
            <TextArea
              label="Descrição"
              placeholder="Digite uma descrição para a transação..."
              rows={3}
              {...register('description')}
              error={errors.description?.message}
              required
            />
          </div>

          {/* Preview */}
          {watchedAmount > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {watchedType === 'income' ? 'Receita' : 'Despesa'}
                </span>
                <span className={`font-semibold ${
                  watchedType === 'income' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {watchedType === 'income' ? '+' : '-'}
                  {formatCurrency(watchedAmount, { showSymbol: false })}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
              disabled={isSubmitting || isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
            >
              {isEditing ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
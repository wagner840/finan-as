/**
 * @fileoverview Category form component for creating and editing categories
 * @module features/finance/components/CategoryForm
 */

import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
import { Button } from '../../../shared/components/UI/Button';
import { Input } from '../../../shared/components/UI/Input';
import { ColorPicker } from '../../../shared/components/UI/ColorPicker';
import { CategorySchema } from '../schemas/financeSchemas';
import type { Category } from '../types/financeTypes';

/**
 * Form data for category creation/editing
 */
type CategoryFormData = Omit<Category, 'id'>;

/**
 * Validation schema for category form
 */
const CategoryFormSchema = CategorySchema.omit({ id: true });

/**
 * Props for the CategoryForm component
 */
export interface CategoryFormProps {
  /** Category to edit (undefined for creating new category) */
  category?: Category;
  
  /** Existing categories for name validation */
  existingCategories: Category[];
  
  /** Handler for form submission */
  onSubmit: (categoryData: CategoryFormData) => Promise<void>;
  
  /** Handler for form cancellation */
  onCancel: () => void;
  
  /** Whether the form is in loading state */
  isLoading?: boolean;
}

/**
 * Category form component with validation and color picker
 * 
 * Provides a form interface for creating and editing financial categories.
 * Includes name validation, color selection, and preview functionality.
 * 
 * @component
 * @example
 * ```tsx
 * <CategoryForm
 *   category={editingCategory}
 *   existingCategories={categories}
 *   onSubmit={handleSubmitCategory}
 *   onCancel={handleCancel}
 *   isLoading={isSubmitting}
 * />
 * ```
 */
export const CategoryForm = ({
  category,
  existingCategories,
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoryFormProps): ReactElement => {
  const isEditing = Boolean(category);
  
  // Create validation schema with dynamic name uniqueness check
  const dynamicSchema = CategoryFormSchema.refine(
    (data) => {
      // Check if name is unique (excluding current category when editing)
      const existingNames = existingCategories
        .filter(cat => isEditing ? cat.id !== category?.id : true)
        .map(cat => cat.name.toLowerCase());
      
      return !existingNames.includes(data.name.toLowerCase());
    },
    {
      message: 'Já existe uma categoria com este nome',
      path: ['name'],
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      name: '',
      color: '#54A0FF',
    },
  });

  // Watch form values for preview
  const watchedName = watch('name');
  const watchedColor = watch('color');

  // Populate form when editing a category
  useEffect(() => {
    if (category) {
      setValue('name', category.name);
      setValue('color', category.color);
    } else {
      reset({
        name: '',
        color: '#54A0FF',
      });
    }
  }, [category, setValue, reset]);

  // Handle form submission
  const handleFormSubmit = async (data: CategoryFormData): Promise<void> => {
    try {
      await onSubmit(data);
      
      // Reset form only if not editing (for new categories)
      if (!isEditing) {
        reset({
          name: '',
          color: '#54A0FF',
        });
      }
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  // Handle color change
  const handleColorChange = (color: string): void => {
    setValue('color', color, { shouldValidate: true });
  };

  // Generate category preview
  const categoryPreview = {
    name: watchedName || 'Nome da Categoria',
    color: watchedColor,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Fechar formulário"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category Name */}
          <div>
            <Input
              label="Nome da Categoria"
              type="text"
              placeholder="Ex: Alimentação, Transporte, Lazer..."
              {...register('name')}
              error={errors.name?.message}
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          {/* Color Picker */}
          <div>
            <ColorPicker
              label="Cor da Categoria"
              value={watchedColor}
              onChange={handleColorChange}
              error={errors.color?.message}
              disabled={isSubmitting || isLoading}
            />
          </div>

          {/* Category Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
            
            {/* Preview as it would appear in transaction list */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg border dark:border-gray-500">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryPreview.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    Transação de exemplo
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {categoryPreview.name} • Hoje
                  </p>
                </div>
                <span className="text-sm font-semibold text-danger-600">
                  -R$ 123,45
                </span>
              </div>

              {/* Preview as category tag */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Como tag:</span>
                <span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: categoryPreview.color }}
                >
                  {categoryPreview.name}
                </span>
              </div>
            </div>
          </div>

          {/* Usage Info (when editing) */}
          {isEditing && category && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Informações sobre a categoria
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    As alterações serão aplicadas a todas as transações que usam esta categoria.
                    {/* TODO: Show transaction count */}
                  </p>
                </div>
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
              {isEditing ? 'Atualizar' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
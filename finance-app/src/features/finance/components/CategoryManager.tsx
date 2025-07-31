/**
 * @fileoverview Category management interface with CRUD operations
 * @module features/finance/components/CategoryManager
 */

import { useState } from 'react';
import type { ReactElement } from 'react';
import { CategoryForm } from './CategoryForm';
import { Button, IconButton } from '../../../shared/components/UI/Button';
import { Input } from '../../../shared/components/UI/Input';
import { ColorSwatch } from '../../../shared/components/UI/ColorPicker';
import type { Category, CategoryId } from '../types/financeTypes';

/**
 * Props for the CategoryManager component
 */
export interface CategoryManagerProps {
  /** List of categories */
  categories: Category[];
  
  /** Handler for creating a new category */
  onCreateCategory: (categoryData: Omit<Category, 'id'>) => Promise<void>;
  
  /** Handler for updating a category */
  onUpdateCategory: (categoryId: CategoryId, categoryData: Omit<Category, 'id'>) => Promise<void>;
  
  /** Handler for deleting a category */
  onDeleteCategory: (categoryId: CategoryId) => Promise<void>;
  
  /** Whether operations are in loading state */
  isLoading?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Category management interface component
 * 
 * Provides a comprehensive interface for managing financial categories including
 * creating, editing, deleting, and organizing categories. Features search,
 * color-coded display, and usage statistics.
 * 
 * @component
 * @example
 * ```tsx
 * <CategoryManager
 *   categories={categories}
 *   onCreateCategory={handleCreateCategory}
 *   onUpdateCategory={handleUpdateCategory}
 *   onDeleteCategory={handleDeleteCategory}
 *   isLoading={isLoading}
 * />
 * ```
 */
export const CategoryManager = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isLoading = false,
  className = '',
}: CategoryManagerProps): ReactElement => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create category
  const handleCreateCategory = async (categoryData: Omit<Category, 'id'>): Promise<void> => {
    try {
      await onCreateCategory(categoryData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  // Handle update category
  const handleUpdateCategory = async (categoryData: Omit<Category, 'id'>): Promise<void> => {
    if (!editingCategory) return;
    
    try {
      await onUpdateCategory(editingCategory.id, categoryData);
      setEditingCategory(undefined);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (category: Category): Promise<void> => {
    try {
      await onDeleteCategory(category.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleFormSubmit = async (categoryData: Omit<Category, 'id'>): Promise<void> => {
    if (editingCategory) {
      await handleUpdateCategory(categoryData);
    } else {
      await handleCreateCategory(categoryData);
    }
  };

  // Handle form cancel
  const handleFormCancel = (): void => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  // Handle edit category
  const handleEditCategory = (category: Category): void => {
    setEditingCategory(category);
    setShowForm(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (category: Category): void => {
    setDeleteConfirm(category);
  };

  const containerClasses = [
    'bg-white shadow rounded-lg overflow-hidden',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Gerenciar Categorias
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'} cadastradas
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            disabled={isLoading}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Search */}
      {categories.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <Input
            type="text"
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            className="max-w-md"
          />
        </div>
      )}

      {/* Categories List */}
      <div className="divide-y divide-gray-200">
        {filteredCategories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            {categories.length === 0 ? (
              // No categories at all
              <>
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma categoria cadastrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie sua primeira categoria para organizar suas transações.
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowForm(true)}
                  disabled={isLoading}
                >
                  Criar Primeira Categoria
                </Button>
              </>
            ) : (
              // No categories match search
              <>
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma categoria encontrada
                </h3>
                <p className="text-gray-600">
                  Tente ajustar o termo de busca ou crie uma nova categoria.
                </p>
              </>
            )}
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Color Swatch */}
                  <ColorSwatch
                    color={category.color}
                    size="md"
                    aria-label={`Cor da categoria ${category.name}`}
                  />
                  
                  {/* Category Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {category.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="font-mono">
                        {category.color.toUpperCase()}
                      </span>
                      {/* TODO: Show transaction count */}
                      {/* <span>•</span>
                      <span>{transactionCount} transações</span> */}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <IconButton
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    aria-label={`Editar categoria ${category.name}`}
                    disabled={isLoading}
                  />
                  
                  <IconButton
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteConfirm(category)}
                    aria-label={`Excluir categoria ${category.name}`}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          existingCategories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Excluir Categoria
                </h3>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex items-center space-x-3">
                <ColorSwatch
                  color={deleteConfirm.color}
                  size="sm"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {deleteConfirm.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {/* TODO: Show transaction count */}
                    Esta categoria será removida permanentemente.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-md mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-yellow-800">
                    Atenção
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    As transações que usam esta categoria ficarão sem categoria após a exclusão.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteCategory(deleteConfirm)}
                className="flex-1"
                loading={isLoading}
                disabled={isLoading}
              >
                Excluir Categoria
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
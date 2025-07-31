/**
 * @fileoverview Main application component integrating finance management functionality
 * @module App
 */

import { useState, useCallback } from 'react';
import type { ReactElement } from 'react';
import { Layout, LayoutLoading, LayoutError } from './shared/components/Layout';
import { Dashboard } from './features/finance/components/Dashboard';
import { TransactionForm } from './features/finance/components/TransactionForm';
import { TransactionList } from './features/finance/components/TransactionList';
import { CategoryManager } from './features/finance/components/CategoryManager';
import { ReportsPage } from './features/finance/components/ReportsPage';
import { useFinanceData } from './features/finance/hooks/useFinanceData';
import { useDarkMode } from './shared/hooks/useDarkMode';
import type { AppView, AppState, Transaction, CreateTransactionData } from './features/finance/types/financeTypes';

/**
 * Main application component
 * 
 * Integrates all finance management functionality including dashboard,
 * transaction management, category management, and reports. Uses the
 * useFinanceData hook for state management and localStorage persistence.
 * 
 * @component
 */
function App(): ReactElement {
  // Dark mode management
  const { isDark, toggleDarkMode } = useDarkMode();
  
  // Finance data management
  const {
    data,
    summary,
    isLoading,
    error,
    addTransaction,
    addCategory,
    updateTransaction,
    updateCategory,
    deleteTransaction,
    deleteCategory,
    // filterTransactions: _filterTransactions,
    // resetData: _resetData,
  } = useFinanceData();

  // App state management
  const [appState, setAppState] = useState<AppState>({
    currentView: 'dashboard',
    isTransactionFormOpen: false,
    isCategoryManagerOpen: false,
    editingTransaction: null,
  });

  // Navigation handler
  const handleNavigate = useCallback((view: string): void => {
    setAppState(prev => ({
      ...prev,
      currentView: view as AppView,
      isTransactionFormOpen: false,
      isCategoryManagerOpen: false,
      editingTransaction: null,
    }));
  }, []);

  // Transaction management handlers
  const handleAddTransaction = useCallback((): void => {
    setAppState(prev => ({
      ...prev,
      isTransactionFormOpen: true,
      editingTransaction: null,
    }));
  }, []);

  const handleEditTransaction = useCallback((transaction: Transaction): void => {
    setAppState(prev => ({
      ...prev,
      isTransactionFormOpen: true,
      editingTransaction: transaction,
    }));
  }, []);

  const handleSubmitTransaction = useCallback(async (transactionData: CreateTransactionData): Promise<void> => {
    if (appState.editingTransaction) {
      await updateTransaction(appState.editingTransaction.id, transactionData);
    } else {
      await addTransaction(transactionData);
    }
    
    setAppState(prev => ({
      ...prev,
      isTransactionFormOpen: false,
      editingTransaction: null,
    }));
  }, [appState.editingTransaction, addTransaction, updateTransaction]);

  const handleCancelTransaction = useCallback((): void => {
    setAppState(prev => ({
      ...prev,
      isTransactionFormOpen: false,
      editingTransaction: null,
    }));
  }, []);

  // Category management handlers
  const handleManageCategories = useCallback((): void => {
    setAppState(prev => ({
      ...prev,
      isCategoryManagerOpen: true,
    }));
  }, []);

  const handleCloseCategoryManager = useCallback((): void => {
    setAppState(prev => ({
      ...prev,
      isCategoryManagerOpen: false,
    }));
  }, []);

  // Error retry handler
  const handleRetry = useCallback((): void => {
    window.location.reload();
  }, []);

  // Show loading state
  if (isLoading) {
    return <LayoutLoading />;
  }

  // Show error state
  if (error) {
    return (
      <LayoutError 
        error={error} 
        onRetry={handleRetry}
      />
    );
  }

  // Get recent transactions (sorted by date, most recent first)
  const recentTransactions = data.transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Render current view
  const renderCurrentView = (): ReactElement => {
    switch (appState.currentView) {
      case 'dashboard':
        return (
          <Dashboard
            summary={summary}
            recentTransactions={recentTransactions}
            categories={data.categories}
            onAddTransaction={handleAddTransaction}
            onManageCategories={handleManageCategories}
          />
        );

      case 'transactions':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
              <button
                onClick={handleAddTransaction}
                className="btn btn-primary"
              >
                Nova Transação
              </button>
            </div>
            
            <TransactionList
              transactions={data.transactions}
              categories={data.categories}
              onEdit={handleEditTransaction}
              onDelete={deleteTransaction}
            />
          </div>
        );

      case 'categories':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CategoryManager
              categories={data.categories}
              onCreateCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
            />
          </div>
        );

      case 'reports':
        return (
          <ReportsPage
            transactions={data.transactions}
            categories={data.categories}
            loading={isLoading}
            error={error ?? undefined}
          />
        );

      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="card text-center">
              <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
              <p className="text-gray-600 mb-4">
                A página solicitada não foi encontrada.
              </p>
              <button
                onClick={() => handleNavigate('dashboard')}
                className="btn btn-primary"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout
      currentView={appState.currentView}
      onNavigate={handleNavigate}
      showAds={true}
      isDark={isDark}
      onToggleDarkMode={toggleDarkMode}
    >
      {renderCurrentView()}
      
      {/* Transaction Form Modal */}
      {appState.isTransactionFormOpen && (
        <TransactionForm
          transaction={appState.editingTransaction ?? undefined}
          categories={data.categories}
          onSubmit={handleSubmitTransaction}
          onCancel={handleCancelTransaction}
        />
      )}
      
      {/* Category Manager Modal */}
      {appState.isCategoryManagerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Gerenciar Categorias
              </h2>
              <button
                onClick={handleCloseCategoryManager}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Fechar gerenciador de categorias"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <CategoryManager
                categories={data.categories}
                onCreateCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
                className="shadow-none border-0"
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
/**
 * @fileoverview Main application component integrating finance management functionality
 * @module App
 */

import { useState, useCallback, useEffect } from 'react';
import type { ReactElement } from 'react';
import { Layout, LayoutLoading, LayoutError } from './shared/components/Layout';
import { Dashboard } from './features/finance/components/Dashboard';
import { TransactionForm } from './features/finance/components/TransactionForm';
import { TransactionList } from './features/finance/components/TransactionList';
import { CategoryManager } from './features/finance/components/CategoryManager';
import { ReportsPage } from './features/finance/components/ReportsPage';
import { AboutPage } from './shared/components/Pages/AboutPage';
import { PrivacyPage } from './shared/components/Pages/PrivacyPage';
import { OnboardingFlow } from './shared/components/Onboarding/OnboardingFlow';
import { TutorialModal } from './shared/components/Tutorial/TutorialModal';
import { tutorialSteps } from './shared/components/Tutorial/tutorialData';
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
    exportData,
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

  // Onboarding and tutorial state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Check if user is new (show onboarding)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('finance-app-onboarding-seen');
    const hasData = data.transactions.length > 0 || data.categories.length > 0;
    
    if (!hasSeenOnboarding && !hasData && !isLoading) {
      setShowOnboarding(true);
    }
  }, [data.transactions.length, data.categories.length, isLoading]);

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

  // Data export handler
  const handleExportData = useCallback((): void => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financas-facil-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  }, [exportData]);

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

  // Onboarding handlers
  const handleOnboardingComplete = useCallback((): void => {
    localStorage.setItem('finance-app-onboarding-seen', 'true');
    setShowOnboarding(false);
  }, []);

  const handleOnboardingSkip = useCallback((): void => {
    localStorage.setItem('finance-app-onboarding-seen', 'true');
    setShowOnboarding(false);
  }, []);

  const handleStartWithCategories = useCallback((): void => {
    localStorage.setItem('finance-app-onboarding-seen', 'true');
    setShowOnboarding(false);
    handleNavigate('categories');
    setAppState(prev => ({
      ...prev,
      isCategoryManagerOpen: true,
    }));
  }, []);

  // Tutorial handlers
  const handleShowTutorial = useCallback((): void => {
    setShowTutorial(true);
  }, []);

  const handleTutorialComplete = useCallback((): void => {
    setShowTutorial(false);
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transações</h1>
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

      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;

      case 'privacy':
        return <PrivacyPage onBack={() => handleNavigate('about')} />;

      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="card text-center">
              <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Página não encontrada</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
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
      onExportData={handleExportData}
      onShowTutorial={handleShowTutorial}
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

      {/* Onboarding Flow */}
      <OnboardingFlow
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        onStartWithCategories={handleStartWithCategories}
      />

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={handleTutorialComplete}
        steps={tutorialSteps}
        showDontShowAgain={true}
        onDontShowAgain={() => {
          localStorage.setItem('finance-app-tutorial-seen', 'true');
          setShowTutorial(false);
        }}
      />
    </Layout>
  );
}

export default App;
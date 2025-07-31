/**
 * @fileoverview Main dashboard component showing financial overview and recent transactions
 * @module features/finance/components/Dashboard
 */

import type { ReactElement } from 'react';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/components/UI/Button';
import type { 
  Transaction, 
  Category, 
  DashboardProps 
} from '../types/financeTypes';

// FinancialSummary is used indirectly through DashboardProps.summary

/**
 * Financial summary card component
 */
interface SummaryCardProps {
  title: string;
  amount: number;
  variant: 'income' | 'expense' | 'balance';
  className?: string;
}

const SummaryCard = ({ title, amount, variant, className = '' }: SummaryCardProps): ReactElement => {
  const getVariantClasses = (variant: 'income' | 'expense' | 'balance'): string => {
    const variants = {
      income: 'bg-success-50 dark:bg-success-900 text-success-700 dark:text-success-300 border-success-200 dark:border-success-700',
      expense: 'bg-danger-50 dark:bg-danger-900 text-danger-700 dark:text-danger-300 border-danger-200 dark:border-danger-700',
      balance: amount >= 0 
        ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700'
        : 'bg-warning-50 dark:bg-warning-900 text-warning-700 dark:text-warning-300 border-warning-200 dark:border-warning-700',
    };
    return variants[variant];
  };

  const variantClasses = getVariantClasses(variant);
  
  return (
    <div className={`card ${variantClasses} ${className}`}>
      <h3 className="text-sm font-medium opacity-75 mb-1">{title}</h3>
      <p className="text-2xl font-bold">
        {formatCurrency(amount, { showSign: variant === 'balance' })}
      </p>
    </div>
  );
};

/**
 * Recent transactions list component
 */
interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  onViewAll: () => void;
}

const RecentTransactions = ({ 
  transactions, 
  categories, 
  onViewAll 
}: RecentTransactionsProps): ReactElement => {
  const getCategoryName = (categoryId: string): string => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Desconhecida';
  };

  const getCategoryColor = (categoryId: string): string => {
    return categories.find(cat => cat.id === categoryId)?.color || '#6B7280';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Transações Recentes</h2>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onViewAll}
        >
          Ver todas
        </Button>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">Nenhuma transação encontrada</p>
          <p className="text-xs mt-1">Adicione sua primeira transação para começar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getCategoryName(transaction.categoryId)} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount, { showSymbol: false })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Quick actions component
 */
interface QuickActionsProps {
  onAddTransaction: () => void;
  onManageCategories: () => void;
}

const QuickActions = ({ onAddTransaction, onManageCategories }: QuickActionsProps): ReactElement => {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          variant="primary" 
          fullWidth
          onClick={onAddTransaction}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          Nova Transação
        </Button>
        
        <Button 
          variant="secondary" 
          fullWidth
          onClick={onManageCategories}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        >
          Gerenciar Categorias
        </Button>
      </div>
    </div>
  );
};

/**
 * Main dashboard component displaying financial overview
 * 
 * Shows financial summary cards, recent transactions, and quick action buttons.
 * Provides a comprehensive overview of the user's financial status at a glance.
 * 
 * @component
 * @example
 * ```tsx
 * <Dashboard
 *   summary={financialSummary}
 *   recentTransactions={recentTransactions}
 *   categories={categories}
 *   onAddTransaction={() => setShowTransactionForm(true)}
 *   onManageCategories={() => setShowCategoryManager(true)}
 * />
 * ```
 */
export const Dashboard = ({
  summary,
  recentTransactions,
  categories,
  onAddTransaction,
  onManageCategories,
}: DashboardProps): ReactElement => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Controle Financeiro
        </h1>
        <p className="text-gray-600">
          Gerencie suas finanças pessoais de forma simples e eficiente
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total de Receitas"
          amount={summary.totalIncome}
          variant="income"
        />
        <SummaryCard
          title="Total de Despesas"
          amount={summary.totalExpenses}
          variant="expense"
        />
        <SummaryCard
          title="Saldo Atual"
          amount={summary.balance}
          variant="balance"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <RecentTransactions
          transactions={recentTransactions}
          categories={categories}
          onViewAll={() => {
            // TODO: Implement view all transactions
            console.log('View all transactions');
          }}
        />

        {/* Quick Actions */}
        <QuickActions
          onAddTransaction={onAddTransaction}
          onManageCategories={onManageCategories}
        />
      </div>

      {/* Category Breakdown (if there are expenses) */}
      {summary.totalExpenses > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Gastos por Categoria</h2>
          <div className="space-y-3">
            {Object.entries(summary.expensesByCategory)
              .sort(([, a], [, b]) => b - a) // Sort by amount descending
              .slice(0, 5) // Show top 5 categories
              .map(([categoryId, amount]) => {
                const category = categories.find(cat => cat.id === categoryId);
                if (!category) return null;
                
                const percentage = (amount / summary.totalExpenses) * 100;
                
                return (
                  <div key={categoryId} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(amount, { showSymbol: false })}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: category.color,
                            width: `${percentage}%` 
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
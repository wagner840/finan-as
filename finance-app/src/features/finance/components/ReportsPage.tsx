/**
 * @fileoverview Reports page with analytics, charts, and export functionality
 * @module features/finance/components/ReportsPage
 */

import { useState, useMemo } from 'react';
import type { ReactElement } from 'react';
import { ChartContainer, PieChart, BarChart } from './Charts';
import { ExportDialog } from './ExportDialog';
import { Button } from '../../../shared/components/UI/Button';
import { Select } from '../../../shared/components/UI/Input';
import { formatCurrency } from '../../../shared/utils/formatters';
import type { Transaction, Category } from '../types/financeTypes';

/**
 * Props for the ReportsPage component
 */
export interface ReportsPageProps {
  /** Available transactions */
  transactions: Transaction[];
  
  /** Available categories */
  categories: Category[];
  
  /** Loading state */
  loading?: boolean;
  
  /** Error state */
  error?: string;
}

/**
 * Time period options for filtering
 */
const TIME_PERIODS = [
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 3 meses' },
  { value: '180', label: 'Últimos 6 meses' },
  { value: '365', label: 'Último ano' },
  { value: 'all', label: 'Todo o período' },
] as const;

/**
 * Reports page component with comprehensive financial analytics
 * 
 * Provides a complete dashboard with interactive charts, statistics,
 * and export functionality for financial data analysis.
 * 
 * @component
 * @example
 * ```tsx
 * <ReportsPage
 *   transactions={transactions}
 *   categories={categories}
 *   loading={isLoading}
 *   error={error}
 * />
 * ```
 */
export const ReportsPage = ({
  transactions,
  categories,
  loading = false,
  error,
}: ReportsPageProps): ReactElement => {
  const [selectedPeriod, setSelectedPeriod] = useState('90');
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Filter transactions by selected period
  const filteredTransactions = useMemo(() => {
    if (selectedPeriod === 'all') {
      return transactions;
    }

    const days = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffString = cutoffDate.toISOString().split('T')[0];

    return transactions.filter(transaction => transaction.date >= cutoffString);
  }, [transactions, selectedPeriod]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = income - expenses;

    // Monthly averages (if more than 30 days of data)
    const days = selectedPeriod === 'all' ? 
      Math.max(1, Math.ceil((new Date().getTime() - new Date(Math.min(...filteredTransactions.map(t => new Date(t.date).getTime()))).getTime()) / (1000 * 60 * 60 * 24))) :
      parseInt(selectedPeriod);
    
    const months = Math.max(1, days / 30);

    const avgMonthlyIncome = income / months;
    const avgMonthlyExpenses = expenses / months;

    // Category with highest expenses
    const categoryTotals = new Map<string, number>();
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryTotals.get(t.categoryId) || 0;
        categoryTotals.set(t.categoryId, current + Math.abs(t.amount));
      });

    let topCategory = '';
    let topCategoryAmount = 0;
    categoryTotals.forEach((amount, categoryId) => {
      if (amount > topCategoryAmount) {
        topCategoryAmount = amount;
        topCategory = categoryId;
      }
    });

    const topCategoryName = categories.find(c => c.id === topCategory)?.name || 'N/A';

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      topCategory: topCategoryName,
      topCategoryAmount,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions, categories, selectedPeriod]);

  // Handle export
  const handleExport = (): void => {
    setShowExportDialog(true);
  };

  // Get period for export default
  const getExportDateRange = () => {
    if (selectedPeriod === 'all') return undefined;
    
    const days = parseInt(selectedPeriod);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return {
      from: startDate.toISOString().split('T')[0],
      to: endDate.toISOString().split('T')[0],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar relatórios</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios Financeiros</h1>
            <p className="text-gray-600 mt-2">
              Análise completa das suas finanças com gráficos e estatísticas
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-48"
            >
              {TIME_PERIODS.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </Select>
            
            <Button
              variant="primary"
              onClick={handleExport}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                <p className="text-2xl font-bold text-success-600">
                  {formatCurrency(statistics.totalIncome)}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Média mensal: {formatCurrency(statistics.avgMonthlyIncome)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
                <p className="text-2xl font-bold text-danger-600">
                  {formatCurrency(statistics.totalExpenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Média mensal: {formatCurrency(statistics.avgMonthlyExpenses)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${
                  statistics.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {formatCurrency(statistics.balance)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                statistics.balance >= 0 ? 'bg-success-100' : 'bg-danger-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  statistics.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {statistics.balance >= 0 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  )}
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {statistics.balance >= 0 ? 'Superávit' : 'Déficit'} no período
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maior Categoria</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {statistics.topCategory}
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(statistics.topCategoryAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {statistics.transactionCount} transações no período
            </p>
          </div>
        </div>

        {/* Charts - Re-enabled after fixing infinite loops */}
        {filteredTransactions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartContainer
              title="Distribuição de Despesas"
              subtitle="Por categoria no período selecionado"
              height={400}
              exportFilename="distribuicao-despesas"
            >
              <PieChart
                data={filteredTransactions}
                categories={categories}
                type="expense"
                title="Distribuição de Despesas por Categoria"
                showValues={true}
                showPercentages={true}
                minPercentage={3}
              />
            </ChartContainer>

            <ChartContainer
              title="Receitas vs Despesas"
              subtitle="Comparação mensal"
              height={400}
              exportFilename="receitas-despesas-mensal"
            >
              <BarChart
                data={filteredTransactions}
                categories={categories}
                type="monthly"
                period={selectedPeriod === 'all' ? 12 : Math.min(12, Math.ceil(parseInt(selectedPeriod) / 30))}
                title="Receitas vs Despesas Mensais"
                stacked={false}
                showGrid={true}
              />
            </ChartContainer>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Gráficos temporariamente indisponíveis
            </h3>
            <p className="text-gray-600 mb-6">
              Os gráficos estão sendo aprimorados. Adicione transações para ver as estatísticas acima.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sem dados para o período selecionado
            </h3>
            <p className="text-gray-600 mb-6">
              Adicione algumas transações ou selecione um período diferente para visualizar os relatórios.
            </p>
            <Button
              variant="primary"
              onClick={() => setSelectedPeriod('all')}
            >
              Ver Todo o Período
            </Button>
          </div>
        )}

        {/* Additional Charts Row - Re-enabled after fixing infinite loops */}
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredTransactions.some(t => t.type === 'income') && (
              <ChartContainer
                title="Distribuição de Receitas"
                subtitle="Por categoria no período selecionado"
                height={400}
                exportFilename="distribuicao-receitas"
              >
                <PieChart
                  data={filteredTransactions}
                  categories={categories}
                  type="income"
                  title="Distribuição de Receitas por Categoria"
                  showValues={true}
                  showPercentages={true}
                  minPercentage={3}
                />
              </ChartContainer>
            )}

            <ChartContainer
              title="Comparação por Categoria"
              subtitle="Receitas e despesas por categoria"
              height={400}
              exportFilename="comparacao-categorias"
            >
              <BarChart
                data={filteredTransactions}
                categories={categories}
                type="category"
                title="Receitas e Despesas por Categoria"
                stacked={false}
                orientation="vertical"
                showGrid={true}
              />
            </ChartContainer>
          </div>
        )}

        {/* Export Dialog */}
        <ExportDialog
          transactions={filteredTransactions}
          categories={categories}
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          defaultOptions={{
            format: 'xlsx',
            dateRange: getExportDateRange(),
            includeSummary: true,
            includeMetadata: true,
          }}
        />
      </div>
    </div>
  );
};
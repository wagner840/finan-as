/**
 * @fileoverview Pie chart component for displaying category distributions
 * @module features/finance/components/Charts/PieChart
 */

import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { formatCurrency } from '../../../../shared/utils/formatters';
import type { Transaction, Category } from '../../types/financeTypes';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Data structure for pie chart segments
 */
export interface PieChartData {
  /** Segment label */
  label: string;
  
  /** Segment value */
  value: number;
  
  /** Segment color */
  color: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Props for the PieChart component
 */
export interface PieChartProps {
  /** Chart data - can be raw transactions or processed data */
  data?: Transaction[];
  
  /** Processed chart data */
  chartData?: PieChartData[];
  
  /** Categories for transaction processing */
  categories?: Category[];
  
  /** Transaction type filter */
  type?: 'income' | 'expense' | 'all';
  
  /** Chart title (for accessibility) */
  title?: string;
  
  /** Whether to show values in legend */
  showValues?: boolean;
  
  /** Whether to show percentages */
  showPercentages?: boolean;
  
  /** Minimum percentage to show separate slice (smaller ones grouped) */
  minPercentage?: number;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pie chart component for displaying financial data distributions
 * 
 * Renders interactive pie charts showing category distributions, income vs expenses,
 * or custom data. Supports both raw transaction processing and pre-processed data.
 * 
 * @component
 * @example
 * ```tsx
 * // With transactions and categories
 * <PieChart
 *   data={transactions}
 *   categories={categories}
 *   type="expense"
 *   title="Distribuição de Despesas"
 *   showValues={true}
 * />
 * 
 * // With processed data
 * <PieChart
 *   chartData={processedData}
 *   title="Receitas vs Despesas"
 * />
 * ```
 */
export const PieChart = ({
  data = [],
  chartData,
  categories = [],
  type = 'all',
  title = 'Gráfico de Pizza',
  showValues = true,
  showPercentages = true,
  minPercentage = 2,
  className = '',
}: PieChartProps): ReactElement => {
  // Process transaction data into chart format
  const processedData = useMemo((): PieChartData[] => {
    if (chartData) {
      return chartData;
    }

    if (!data.length || !categories.length) {
      return [];
    }

    // Filter transactions by type
    const filteredTransactions = type === 'all' 
      ? data 
      : data.filter(transaction => transaction.type === type);

    if (!filteredTransactions.length) {
      return [];
    }

    // Group by category
    const categoryTotals = new Map<string, { total: number; category: Category }>();

    filteredTransactions.forEach(transaction => {
      const category = categories.find(cat => cat.id === transaction.categoryId);
      if (!category) return;

      const existing = categoryTotals.get(category.id);
      const amount = Math.abs(transaction.amount); // Use absolute values for display

      if (existing) {
        existing.total += amount;
      } else {
        categoryTotals.set(category.id, {
          total: amount,
          category,
        });
      }
    });

    // Convert to chart data format
    const chartItems = Array.from(categoryTotals.values()).map(({ total, category }) => ({
      label: category.name,
      value: total,
      color: category.color,
      metadata: { categoryId: category.id },
    }));

    // Sort by value (descending)
    chartItems.sort((a, b) => b.value - a.value);

    // Group small slices if needed
    if (minPercentage > 0) {
      const totalValue = chartItems.reduce((sum, item) => sum + item.value, 0);
      const threshold = (totalValue * minPercentage) / 100;
      
      const mainItems = chartItems.filter(item => item.value >= threshold);
      const smallItems = chartItems.filter(item => item.value < threshold);
      
      if (smallItems.length > 1) {
        const othersTotal = smallItems.reduce((sum, item) => sum + item.value, 0);
        mainItems.push({
          label: 'Outros',
          value: othersTotal,
          color: '#9CA3AF',
          metadata: { isGrouped: true, items: smallItems } as any,
        });
      } else if (smallItems.length === 1) {
        mainItems.push(smallItems[0]);
      }
      
      return mainItems;
    }

    return chartItems;
  }, [data, chartData, categories, type, minPercentage]);

  // Calculate total for percentages
  const total = processedData.reduce((sum, item) => sum + item.value, 0);

  // Chart.js configuration
  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            if (!datasets.length || !datasets[0].data) return [];

            return processedData.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
              
              let label = item.label;
              if (showValues) {
                label += `: ${formatCurrency(item.value, { showSymbol: false })}`;
              }
              if (showPercentages) {
                label += ` (${percentage}%)`;
              }

              return {
                text: label,
                fillStyle: item.color,
                strokeStyle: item.color,
                lineWidth: 2,
                hidden: false,
                index,
              };
            });
          },
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = processedData[context.dataIndex];
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
            
            return [
              `${item.label}`,
              `Valor: ${formatCurrency(item.value)}`,
              `Percentual: ${percentage}%`,
            ];
          },
        },
      },
    },
    onHover: (event, elements) => {
      // Change cursor on hover
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      }
    },
  };

  const chartJSData = {
    labels: processedData.map(item => item.label),
    datasets: [
      {
        data: processedData.map(item => item.value),
        backgroundColor: processedData.map(item => item.color),
        borderColor: processedData.map(item => item.color),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  // Handle no data case
  if (!processedData.length) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Sem dados para exibir
          </h4>
          <p className="text-gray-600">
            {!data.length 
              ? 'Adicione algumas transações para visualizar o gráfico.'
              : 'Nenhuma transação encontrada para os filtros selecionados.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`} role="img" aria-label={title}>
      <Pie data={chartJSData} options={chartOptions} />
      
      {/* Summary info */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-sm">
        <div className="text-sm text-gray-600">
          <div className="font-medium">Total</div>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(total)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {processedData.length} {processedData.length === 1 ? 'categoria' : 'categorias'}
          </div>
        </div>
      </div>
    </div>
  );
};
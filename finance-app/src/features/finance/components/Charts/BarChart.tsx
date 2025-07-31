/**
 * @fileoverview Bar chart component for displaying time-series and comparison data
 * @module features/finance/components/Charts/BarChart
 */

import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { formatCurrency } from '../../../../shared/utils/formatters';
import type { Transaction, Category } from '../../types/financeTypes';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Data structure for bar chart series
 */
export interface BarChartSeries {
  /** Series label */
  label: string;
  
  /** Series data points */
  data: number[];
  
  /** Series color */
  color: string;
  
  /** Additional series options */
  options?: Partial<{
    borderColor: string;
    borderWidth: number;
    backgroundColor: string;
  }>;
}

/**
 * Data structure for bar chart
 */
export interface BarChartData {
  /** X-axis labels */
  labels: string[];
  
  /** Data series */
  series: BarChartSeries[];
}

/**
 * Props for the BarChart component
 */
export interface BarChartProps {
  /** Raw transaction data */
  data?: Transaction[];
  
  /** Processed chart data */
  chartData?: BarChartData;
  
  /** Categories for transaction processing */
  categories?: Category[];
  
  /** Chart type */
  type?: 'monthly' | 'category' | 'comparison' | 'custom';
  
  /** Period for monthly charts (in months) */
  period?: number;
  
  /** Chart title (for accessibility) */
  title?: string;
  
  /** Y-axis label */
  yAxisLabel?: string;
  
  /** Whether to stack bars */
  stacked?: boolean;
  
  /** Whether to show grid lines */
  showGrid?: boolean;
  
  /** Whether to show data labels */
  showDataLabels?: boolean;
  
  /** Chart orientation */
  orientation?: 'vertical' | 'horizontal';
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Bar chart component for displaying financial data comparisons and time series
 * 
 * Renders interactive bar charts showing monthly trends, category comparisons,
 * income vs expenses, or custom data. Supports both vertical and horizontal orientations.
 * 
 * @component
 * @example
 * ```tsx
 * // Monthly income vs expenses
 * <BarChart
 *   data={transactions}
 *   categories={categories}
 *   type="monthly"
 *   period={12}
 *   title="Receitas vs Despesas (12 meses)"
 *   stacked={false}
 * />
 * 
 * // Category comparison
 * <BarChart
 *   data={transactions}
 *   categories={categories}
 *   type="category"
 *   title="Despesas por Categoria"
 * />
 * ```
 */
export const BarChart = ({
  data = [],
  chartData,
  categories = [],
  type = 'monthly',
  period = 12,
  title = 'Gráfico de Barras',
  yAxisLabel = 'Valor (R$)',
  stacked = false,
  showGrid = true,
  showDataLabels: _showDataLabels = false,
  orientation = 'vertical',
  className = '',
}: BarChartProps): ReactElement => {
  // Process transaction data based on type
  const processedData = useMemo((): BarChartData => {
    if (chartData) {
      return chartData;
    }

    if (!data.length) {
      return { labels: [], series: [] };
    }

    switch (type) {
      case 'monthly': {
        // Get last N months
        const now = new Date();
        const months: { label: string; income: number; expense: number }[] = [];
        
        for (let i = period - 1; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthLabel = date.toLocaleDateString('pt-BR', { 
            month: 'short', 
            year: 'numeric' 
          });
          
          months.push({
            label: monthLabel,
            income: 0,
            expense: 0,
          });
        }

        // Aggregate transactions by month
        data.forEach(transaction => {
          const transactionDate = new Date(transaction.date);
          const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
          
          const monthIndex = months.findIndex(m => {
            const [year, month] = monthKey.split('-');
            const expectedLabel = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', {
              month: 'short',
              year: 'numeric'
            });
            return m.label === expectedLabel;
          });
          
          if (monthIndex >= 0) {
            if (transaction.type === 'income') {
              months[monthIndex].income += transaction.amount;
            } else {
              months[monthIndex].expense += Math.abs(transaction.amount);
            }
          }
        });

        return {
          labels: months.map(m => m.label),
          series: [
            {
              label: 'Receitas',
              data: months.map(m => m.income),
              color: '#10B981',
              options: {
                backgroundColor: '#10B981',
                borderColor: '#059669',
                borderWidth: 1,
              },
            },
            {
              label: 'Despesas',
              data: months.map(m => m.expense),
              color: '#EF4444',
              options: {
                backgroundColor: '#EF4444',
                borderColor: '#DC2626',
                borderWidth: 1,
              },
            },
          ],
        };
      }

      case 'category': {
        if (!categories.length) {
          return { labels: [], series: [] };
        }

        // Group by category
        const categoryTotals = new Map<string, { income: number; expense: number; category: Category }>();

        data.forEach(transaction => {
          const category = categories.find(cat => cat.id === transaction.categoryId);
          if (!category) return;

          const existing = categoryTotals.get(category.id) || {
            income: 0,
            expense: 0,
            category,
          };

          if (transaction.type === 'income') {
            existing.income += transaction.amount;
          } else {
            existing.expense += Math.abs(transaction.amount);
          }

          categoryTotals.set(category.id, existing);
        });

        const categoryData = Array.from(categoryTotals.values())
          .sort((a, b) => (b.income + b.expense) - (a.income + a.expense));

        return {
          labels: categoryData.map(item => item.category.name),
          series: [
            {
              label: 'Receitas',
              data: categoryData.map(item => item.income),
              color: '#10B981',
              options: {
                backgroundColor: '#10B981',
                borderColor: '#059669',
                borderWidth: 1,
              },
            },
            {
              label: 'Despesas',
              data: categoryData.map(item => item.expense),
              color: '#EF4444',
              options: {
                backgroundColor: '#EF4444',
                borderColor: '#DC2626',
                borderWidth: 1,
              },
            },
          ],
        };
      }

      case 'comparison': {
        // Simple income vs expense comparison
        const totalIncome = data
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpense = data
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        return {
          labels: ['Total'],
          series: [
            {
              label: 'Receitas',
              data: [totalIncome],
              color: '#10B981',
              options: {
                backgroundColor: '#10B981',
                borderColor: '#059669',
                borderWidth: 1,
              },
            },
            {
              label: 'Despesas',
              data: [totalExpense],
              color: '#EF4444',
              options: {
                backgroundColor: '#EF4444',
                borderColor: '#DC2626',
                borderWidth: 1,
              },
            },
          ],
        };
      }

      default:
        return { labels: [], series: [] };
    }
  }, [data, chartData, categories, type, period]);

  // Chart.js configuration
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: orientation === 'horizontal' ? 'y' : 'x',
    scales: {
      x: {
        stacked,
        grid: {
          display: showGrid,
        },
        title: {
          display: !!yAxisLabel && orientation === 'horizontal',
          text: yAxisLabel,
        },
      },
      y: {
        stacked,
        grid: {
          display: showGrid,
        },
        title: {
          display: !!yAxisLabel && orientation === 'vertical',
          text: yAxisLabel,
        },
        ticks: {
          callback: (value) => {
            return formatCurrency(Number(value), { showSymbol: false });
          },
        },
      },
    },
    plugins: {
      legend: {
        display: processedData.series.length > 1,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const seriesLabel = context.dataset.label || '';
            const value = context.parsed.y || context.parsed.x || 0;
            return `${seriesLabel}: ${formatCurrency(value)}`;
          },
        },
      },
      // Note: datalabels plugin would need to be installed separately
      // datalabels plugin configuration would go here if needed
    },
    onHover: (event, elements) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      }
    },
  };

  const chartJSData = {
    labels: processedData.labels,
    datasets: processedData.series.map(series => ({
      label: series.label,
      data: series.data,
      backgroundColor: series.options?.backgroundColor || series.color,
      borderColor: series.options?.borderColor || series.color,
      borderWidth: series.options?.borderWidth || 1,
    })),
  };

  // Handle no data case
  if (!processedData.labels.length || !processedData.series.length) {
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
      <Bar data={chartJSData} options={chartOptions} />
    </div>
  );
};
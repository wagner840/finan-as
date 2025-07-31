/**
 * @fileoverview Chart container component with export and common functionality
 * @module features/finance/components/Charts/ChartContainer
 */

import { useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import html2canvas from 'html2canvas';
import { IconButton } from '../../../../shared/components/UI/Button';

/**
 * Props for the ChartContainer component
 */
export interface ChartContainerProps {
  /** Chart title */
  title: string;
  
  /** Chart subtitle or description */
  subtitle?: string;
  
  /** Chart content */
  children: ReactNode;
  
  /** Whether the chart is loading */
  loading?: boolean;
  
  /** Error message to display */
  error?: string;
  
  /** Whether to show export button */
  showExport?: boolean;
  
  /** Custom export filename */
  exportFilename?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Height of the chart container */
  height?: number;
}

/**
 * Chart container component with export functionality
 * 
 * Provides a consistent wrapper for charts with title, loading states,
 * error handling, and PNG export functionality using html2canvas.
 * 
 * @component
 * @example
 * ```tsx
 * <ChartContainer
 *   title="Receitas vs Despesas"
 *   subtitle="Últimos 12 meses"
 *   showExport={true}
 *   exportFilename="receitas-despesas"
 * >
 *   <PieChart data={chartData} />
 * </ChartContainer>
 * ```
 */
export const ChartContainer = ({
  title,
  subtitle,
  children,
  loading = false,
  error,
  showExport = true,
  exportFilename,
  className = '',
  height = 400,
}: ChartContainerProps): ReactElement => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Handle PNG export
  const handleExportPNG = async (): Promise<void> => {
    if (!chartRef.current) return;

    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${exportFilename || title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Erro ao exportar gráfico. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const containerClasses = [
    'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {showExport && !loading && !error && (
            <div className="flex items-center space-x-2">
              <IconButton
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
                variant="secondary"
                size="sm"
                onClick={handleExportPNG}
                loading={isExporting}
                disabled={isExporting}
                aria-label="Exportar gráfico como PNG"
                title="Exportar como PNG"
              />
            </div>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div 
        ref={chartRef}
        className="relative"
        style={{ height: `${height}px` }}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Carregando gráfico...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Erro ao carregar gráfico
              </h4>
              <p className="text-sm text-gray-600">
                {error}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full p-6">
            {children}
          </div>
        )}
      </div>

      {/* Footer with metadata */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Gerado em {new Date().toLocaleString('pt-BR')}
          </span>
          {showExport && (
            <span>
              Clique no ícone de download para exportar
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
/**
 * @fileoverview Export utilities for financial data in various formats
 * @module features/finance/utils/exportUtils
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import type { Transaction, Category } from '../types/financeTypes';

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'xlsx' | 'markdown';

/**
 * Export options configuration
 */
export interface ExportOptions {
  /** Export format */
  format: ExportFormat;
  
  /** Custom filename (without extension) */
  filename?: string;
  
  /** Date range for filtering */
  dateRange?: {
    from: string;
    to: string;
  };
  
  /** Transaction type filter */
  type?: 'income' | 'expense' | 'all';
  
  /** Category filter */
  categoryIds?: string[];
  
  /** Include metadata */
  includeMetadata?: boolean;
  
  /** Include summary statistics */
  includeSummary?: boolean;
}

/**
 * Processed transaction data for export
 */
export interface ExportTransactionData {
  id: string;
  data: string;
  tipo: 'Receita' | 'Despesa';
  categoria: string;
  descricao: string;
  valor: string;
  valorNumerico: number;
}

/**
 * Export summary statistics
 */
export interface ExportSummary {
  totalTransacoes: number;
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
  categorias: {
    nome: string;
    total: number;
    transacoes: number;
  }[];
  periodo: {
    inicio: string;
    fim: string;
  };
}

/**
 * Process transactions for export
 */
export const processTransactionsForExport = (
  transactions: Transaction[],
  categories: Category[],
  options: ExportOptions
): ExportTransactionData[] => {
  let filtered = [...transactions];

  // Apply filters
  if (options.dateRange) {
    filtered = filtered.filter(t => 
      t.date >= options.dateRange!.from && t.date <= options.dateRange!.to
    );
  }

  if (options.type && options.type !== 'all') {
    filtered = filtered.filter(t => t.type === options.type);
  }

  if (options.categoryIds?.length) {
    filtered = filtered.filter(t => options.categoryIds!.includes(t.categoryId));
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Process for export
  return filtered.map(transaction => {
    const category = categories.find(cat => cat.id === transaction.categoryId);
    
    return {
      id: transaction.id,
      data: formatDate(transaction.date),
      tipo: transaction.type === 'income' ? 'Receita' : 'Despesa',
      categoria: category?.name || 'Categoria desconhecida',
      descricao: transaction.description,
      valor: formatCurrency(Math.abs(transaction.amount)),
      valorNumerico: Math.abs(transaction.amount),
    };
  });
};

/**
 * Generate export summary
 */
export const generateExportSummary = (
  transactions: Transaction[],
  categories: Category[],
  // exportData: ExportTransactionData[] // Not used in current implementation
): ExportSummary => {
  const totalReceitas = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Category summary
  const categoryTotals = new Map<string, { total: number; count: number; category: Category }>();

  transactions.forEach(transaction => {
    const category = categories.find(cat => cat.id === transaction.categoryId);
    if (!category) return;

    const existing = categoryTotals.get(category.id);
    const amount = Math.abs(transaction.amount);

    if (existing) {
      existing.total += amount;
      existing.count += 1;
    } else {
      categoryTotals.set(category.id, {
        total: amount,
        count: 1,
        category,
      });
    }
  });

  const categorySummary = Array.from(categoryTotals.values())
    .map(({ total, count, category }) => ({
      nome: category.name,
      total,
      transacoes: count,
    }))
    .sort((a, b) => b.total - a.total);

  // Date range
  const dates = transactions.map(t => t.date).sort();
  const periodo = {
    inicio: dates[0] || '',
    fim: dates[dates.length - 1] || '',
  };

  return {
    totalTransacoes: transactions.length,
    totalReceitas,
    totalDespesas,
    saldoLiquido: totalReceitas - totalDespesas,
    categorias: categorySummary,
    periodo,
  };
};

/**
 * Export transactions as JSON
 */
export const exportAsJSON = (
  transactions: Transaction[],
  categories: Category[],
  options: ExportOptions
): void => {
  const exportData = processTransactionsForExport(transactions, categories, options);
  const summary = options.includeSummary 
    ? generateExportSummary(transactions, categories)
    : null;

  const jsonData = {
    ...(options.includeMetadata && {
      metadata: {
        exportadoEm: new Date().toISOString(),
        formato: 'JSON',
        filtros: {
          periodo: options.dateRange,
          tipo: options.type,
          categorias: options.categoryIds,
        },
      },
    }),
    ...(summary && { resumo: summary }),
    transacoes: exportData,
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: 'application/json',
  });

  const filename = `${options.filename || 'transacoes'}.json`;
  saveAs(blob, filename);
};

/**
 * Export transactions as CSV
 */
export const exportAsCSV = (
  transactions: Transaction[],
  categories: Category[],
  options: ExportOptions
): void => {
  const exportData = processTransactionsForExport(transactions, categories, options);
  
  // CSV headers
  const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'];
  
  // CSV rows
  const rows = exportData.map(item => [
    item.data,
    item.tipo,
    item.categoria,
    item.descricao,
    item.valor,
  ]);

  // Add summary if requested
  if (options.includeSummary) {
    const summary = generateExportSummary(transactions, categories);
    rows.push([]);
    rows.push(['=== RESUMO ===']);
    rows.push(['Total de Transações', summary.totalTransacoes.toString()]);
    rows.push(['Total de Receitas', formatCurrency(summary.totalReceitas)]);
    rows.push(['Total de Despesas', formatCurrency(summary.totalDespesas)]);
    rows.push(['Saldo Líquido', formatCurrency(summary.saldoLiquido)]);
  }

  // Create CSV content
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const filename = `${options.filename || 'transacoes'}.csv`;
  saveAs(blob, filename);
};

/**
 * Export transactions as Excel
 */
export const exportAsExcel = (
  transactions: Transaction[],
  categories: Category[],
  options: ExportOptions
): void => {
  const exportData = processTransactionsForExport(transactions, categories, options);
  
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Main data worksheet
  const wsData = XLSX.utils.json_to_sheet(exportData.map(item => ({
    'Data': item.data,
    'Tipo': item.tipo,
    'Categoria': item.categoria,
    'Descrição': item.descricao,
    'Valor': item.valor,
  })));

  XLSX.utils.book_append_sheet(wb, wsData, 'Transações');

  // Summary worksheet if requested
  if (options.includeSummary) {
    const summary = generateExportSummary(transactions, categories);
    
    const summaryData = [
      { Campo: 'Total de Transações', Valor: summary.totalTransacoes },
      { Campo: 'Total de Receitas', Valor: formatCurrency(summary.totalReceitas) },
      { Campo: 'Total de Despesas', Valor: formatCurrency(summary.totalDespesas) },
      { Campo: 'Saldo Líquido', Valor: formatCurrency(summary.saldoLiquido) },
      { Campo: 'Período (Início)', Valor: formatDate(summary.periodo.inicio) },
      { Campo: 'Período (Fim)', Valor: formatDate(summary.periodo.fim) },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo');

    // Categories worksheet
    const categoriesData = summary.categorias.map(cat => ({
      'Categoria': cat.nome,
      'Total': formatCurrency(cat.total),
      'Transações': cat.transacoes,
    }));

    const wsCategories = XLSX.utils.json_to_sheet(categoriesData);
    XLSX.utils.book_append_sheet(wb, wsCategories, 'Por Categoria');
  }

  // Export
  const filename = `${options.filename || 'transacoes'}.xlsx`;
  XLSX.writeFile(wb, filename);
};

/**
 * Export transactions as Markdown
 */
export const exportAsMarkdown = (
  transactions: Transaction[],
  categories: Category[],
  options: ExportOptions
): void => {
  const exportData = processTransactionsForExport(transactions, categories, options);
  const summary = options.includeSummary 
    ? generateExportSummary(transactions, categories)
    : null;

  let markdown = `# Relatório Financeiro\n\n`;

  // Metadata
  if (options.includeMetadata) {
    markdown += `**Exportado em:** ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}\n\n`;
    
    if (options.dateRange) {
      markdown += `**Período:** ${formatDate(options.dateRange.from)} a ${formatDate(options.dateRange.to)}\n\n`;
    }
    
    if (options.type && options.type !== 'all') {
      markdown += `**Tipo:** ${options.type === 'income' ? 'Receitas' : 'Despesas'}\n\n`;
    }
  }

  // Summary
  if (summary) {
    markdown += `## Resumo\n\n`;
    markdown += `- **Total de Transações:** ${summary.totalTransacoes}\n`;
    markdown += `- **Total de Receitas:** ${formatCurrency(summary.totalReceitas)}\n`;
    markdown += `- **Total de Despesas:** ${formatCurrency(summary.totalDespesas)}\n`;
    markdown += `- **Saldo Líquido:** ${formatCurrency(summary.saldoLiquido)}\n\n`;

    if (summary.categorias.length > 0) {
      markdown += `### Por Categoria\n\n`;
      markdown += `| Categoria | Total | Transações |\n`;
      markdown += `|-----------|-------|------------|\n`;
      
      summary.categorias.forEach(cat => {
        markdown += `| ${cat.nome} | ${formatCurrency(cat.total)} | ${cat.transacoes} |\n`;
      });
      
      markdown += `\n`;
    }
  }

  // Transactions table
  markdown += `## Transações\n\n`;
  markdown += `| Data | Tipo | Categoria | Descrição | Valor |\n`;
  markdown += `|------|------|-----------|-----------|-------|\n`;
  
  exportData.forEach(item => {
    markdown += `| ${item.data} | ${item.tipo} | ${item.categoria} | ${item.descricao} | ${item.valor} |\n`;
  });

  const blob = new Blob([markdown], {
    type: 'text/markdown;charset=utf-8;',
  });

  const filename = `${options.filename || 'transacoes'}.md`;
  saveAs(blob, filename);
};

/**
 * Main export function - delegates to specific format handlers
 */
export const exportTransactions = (
  transactions: Transaction[],
  categories: Category[],
  options: ExportOptions
): void => {
  try {
    switch (options.format) {
      case 'json':
        exportAsJSON(transactions, categories, options);
        break;
      case 'csv':
        exportAsCSV(transactions, categories, options);
        break;
      case 'xlsx':
        exportAsExcel(transactions, categories, options);
        break;
      case 'markdown':
        exportAsMarkdown(transactions, categories, options);
        break;
      default:
        throw new Error(`Formato de exportação não suportado: ${options.format}`);
    }
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    throw new Error('Erro ao exportar dados. Tente novamente.');
  }
};

/**
 * Get file extension for format
 */
export const getFileExtension = (format: ExportFormat): string => {
  const extensions: Record<ExportFormat, string> = {
    json: 'json',
    csv: 'csv',
    xlsx: 'xlsx',
    markdown: 'md',
  };
  
  return extensions[format];
};

/**
 * Get MIME type for format
 */
export const getMimeType = (format: ExportFormat): string => {
  const mimeTypes: Record<ExportFormat, string> = {
    json: 'application/json',
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    markdown: 'text/markdown',
  };
  
  return mimeTypes[format];
};
/**
 * @fileoverview Export dialog component for configuring and executing data exports
 * @module features/finance/components/ExportDialog
 */

import { useState } from "react";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../shared/components/UI/Button";
import { Input, Select } from "../../../shared/components/UI/Input";
// import { getTodayString } from '../../../shared/utils/formatters';
import { exportTransactions, getFileExtension } from "../utils/exportUtils";
import type { Transaction, Category } from "../types/financeTypes";
import type { ExportFormat, ExportOptions } from "../utils/exportUtils";

/**
 * Export form data schema
 */
const ExportFormSchema = z
  .object({
    format: z.enum(["json", "csv", "xlsx", "markdown"]),
    filename: z.string().min(1, "Nome do arquivo é obrigatório"),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    type: z.enum(["all", "income", "expense"]),
    categoryIds: z.array(z.string()).optional(),
    includeMetadata: z.boolean(),
    includeSummary: z.boolean(),
  })
  .refine(
    (data) => {
      // Validate date range
      if (data.dateFrom && data.dateTo) {
        return new Date(data.dateFrom) <= new Date(data.dateTo);
      }
      return true;
    },
    {
      message: "Data inicial deve ser anterior à data final",
      path: ["dateTo"],
    }
  );

type ExportFormData = z.infer<typeof ExportFormSchema>;

/**
 * Props for the ExportDialog component
 */
export interface ExportDialogProps {
  /** Available transactions */
  transactions: Transaction[];

  /** Available categories */
  categories: Category[];

  /** Whether the dialog is open */
  isOpen: boolean;

  /** Handler for closing the dialog */
  onClose: () => void;

  /** Default export options */
  defaultOptions?: Partial<ExportOptions>;
}

/**
 * Export configuration dialog component
 *
 * Provides a comprehensive interface for configuring data exports with
 * format selection, filtering options, and metadata inclusion settings.
 *
 * @component
 * @example
 * ```tsx
 * <ExportDialog
 *   transactions={transactions}
 *   categories={categories}
 *   isOpen={showExportDialog}
 *   onClose={handleCloseExportDialog}
 *   defaultOptions={{
 *     format: 'xlsx',
 *     includeSummary: true,
 *   }}
 * />
 * ```
 */
export const ExportDialog = ({
  transactions,
  categories,
  isOpen,
  onClose,
  defaultOptions = {},
}: ExportDialogProps): ReactElement => {
  const [isExporting, setIsExporting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExportFormData>({
    resolver: zodResolver(ExportFormSchema),
    defaultValues: {
      format: (defaultOptions.format as ExportFormat) || "xlsx",
      filename: "transacoes-financeiras",
      dateFrom: defaultOptions.dateRange?.from || "",
      dateTo: defaultOptions.dateRange?.to || "",
      type: defaultOptions.type || "all",
      categoryIds: defaultOptions.categoryIds || [],
      includeMetadata: defaultOptions.includeMetadata ?? true,
      includeSummary: defaultOptions.includeSummary ?? true,
    },
  });

  // Watch form values for dynamic updates
  const watchedFormat = watch("format");
  const watchedType = watch("type");
  const watchedFilename = watch("filename");
  const watchedCategoryIds = watch("categoryIds") || [];

  // Handle select all categories
  const handleSelectAllCategories = (checked: boolean): void => {
    if (checked) {
      setValue(
        "categoryIds",
        categories.map((cat) => cat.id)
      );
    } else {
      setValue("categoryIds", []);
    }
  };

  // Check if all categories are selected
  const areAllCategoriesSelected =
    watchedCategoryIds.length === categories.length && categories.length > 0;

  // Handle form submission
  const handleExport = async (data: ExportFormData): Promise<void> => {
    setIsExporting(true);

    try {
      const exportOptions: ExportOptions = {
        format: data.format,
        filename: data.filename,
        dateRange:
          data.dateFrom && data.dateTo
            ? {
                from: data.dateFrom,
                to: data.dateTo,
              }
            : undefined,
        type: data.type === "all" ? undefined : data.type,
        categoryIds: data.categoryIds?.length ? data.categoryIds : undefined,
        includeMetadata: data.includeMetadata,
        includeSummary: data.includeSummary,
      };

      await exportTransactions(transactions, categories, exportOptions);

      // Close dialog after successful export
      onClose();

      // Reset form for next use
      reset();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Erro ao exportar dados. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle dialog close
  const handleClose = (): void => {
    if (!isExporting) {
      onClose();
      reset();
    }
  };

  // Get filtered transaction count for preview
  const getFilteredCount = (): number => {
    const formData = watch();
    let filtered = [...transactions];

    if (formData.dateFrom && formData.dateTo) {
      filtered = filtered.filter(
        (t) => t.date >= formData.dateFrom! && t.date <= formData.dateTo!
      );
    }

    if (formData.type !== "all") {
      filtered = filtered.filter((t) => t.type === formData.type);
    }

    if (formData.categoryIds?.length) {
      filtered = filtered.filter((t) =>
        formData.categoryIds!.includes(t.categoryId)
      );
    }

    return filtered.length;
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleExport)} className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Exportar Dados
            </h2>
            <button
              type="button"
              onClick={handleClose}
              disabled={isExporting}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              aria-label="Fechar diálogo"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Format Selection */}
          <div>
            <Select
              label="Formato de Exportação"
              {...register("format")}
              error={errors.format?.message}
              required
            >
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="json">JSON (.json)</option>
              <option value="markdown">Markdown (.md)</option>
            </Select>

            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {watchedFormat === "xlsx" &&
                "Formato ideal para análise de dados no Excel ou Google Sheets"}
              {watchedFormat === "csv" &&
                "Formato compatível com a maioria dos softwares de planilha"}
              {watchedFormat === "json" &&
                "Formato estruturado para desenvolvedores e APIs"}
              {watchedFormat === "markdown" &&
                "Formato legível para documentação e relatórios"}
            </div>
          </div>

          {/* Filename */}
          <div>
            <Input
              label="Nome do Arquivo"
              type="text"
              {...register("filename")}
              error={errors.filename?.message}
              required
              helperText={`O arquivo será salvo como: ${watchedFilename}.${getFileExtension(
                watchedFormat
              )}`}
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="label block mb-2">Período (Opcional)</label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data Inicial"
                type="date"
                {...register("dateFrom")}
                error={errors.dateFrom?.message}
              />
              <Input
                label="Data Final"
                type="date"
                {...register("dateTo")}
                error={errors.dateTo?.message}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Deixe em branco para exportar todas as transações
            </p>
          </div>

          {/* Transaction Type Filter */}
          <div>
            <Select
              label="Tipo de Transação"
              {...register("type")}
              error={errors.type?.message}
            >
              <option value="all">Todas</option>
              <option value="income">Apenas Receitas</option>
              <option value="expense">Apenas Despesas</option>
            </Select>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <label className="label block mb-2">Categorias (Opcional)</label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3 space-y-2 bg-white dark:bg-gray-700">
                {/* Select All Option */}
                <label className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-600 pb-2">
                  <input
                    type="checkbox"
                    checked={areAllCategoriesSelected}
                    onChange={(e) =>
                      handleSelectAllCategories(e.target.checked)
                    }
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Selecionar Todas
                    </span>
                  </div>
                </label>

                {/* Individual Categories */}
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      value={category.id}
                      {...register("categoryIds")}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{category.name}</span>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Deixe desmarcado para incluir todas as categorias
              </p>
            </div>
          )}

          {/* Export Options */}
          <div>
            <label className="label block mb-3">Opções de Exportação</label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register("includeMetadata")}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Incluir Metadados</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Data de exportação, filtros aplicados e informações do
                    sistema
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register("includeSummary")}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Incluir Resumo</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Totais, estatísticas e análise por categoria
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview da Exportação
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                <span className="font-medium">Transações a exportar:</span>{" "}
                {getFilteredCount()} de {transactions.length}
              </p>
              <p>
                <span className="font-medium">Formato:</span>{" "}
                {watchedFormat.toUpperCase()}
              </p>
              <p>
                <span className="font-medium">Tipo:</span>{" "}
                {watchedType === "all"
                  ? "Todas"
                  : watchedType === "income"
                  ? "Receitas"
                  : "Despesas"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
              disabled={isExporting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={isExporting}
              disabled={isExporting || getFilteredCount() === 0}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              }
            >
              {isExporting ? "Exportando..." : "Exportar Dados"}
            </Button>
          </div>

          {getFilteredCount() === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                ⚠️ Nenhuma transação corresponde aos filtros selecionados
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

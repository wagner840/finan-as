/**
 * @fileoverview Specialized input components with proper typing and dark mode support
 * @module shared/components/UI/InputComponents
 */

import { forwardRef } from 'react';
import type { 
  ReactElement, 
  InputHTMLAttributes, 
  TextareaHTMLAttributes, 
  SelectHTMLAttributes 
} from 'react';

/**
 * Input variant types for different visual states
 */
export type InputVariant = 'default' | 'error' | 'success';

/**
 * Base input props that are common across all input types
 */
interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  loading?: boolean;
}

/**
 * Props for regular Input component
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {}

/**
 * Props for TextArea component
 */
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {}

/**
 * Props for Select component
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {}

/**
 * Get variant-specific CSS classes with dark mode support
 */
const getVariantClasses = (variant: InputVariant, hasError: boolean): string => {
  if (hasError) {
    return 'border-danger-300 dark:border-danger-400 focus:border-danger-500 dark:focus:border-danger-400 focus:ring-danger-500 dark:focus:ring-danger-400';
  }
  
  switch (variant) {
    case 'success':
      return 'border-success-300 dark:border-success-400 focus:border-success-500 dark:focus:border-success-400 focus:ring-success-500 dark:focus:ring-success-400';
    case 'error':
      return 'border-danger-300 dark:border-danger-400 focus:border-danger-500 dark:focus:border-danger-400 focus:ring-danger-500 dark:focus:ring-danger-400';
    default:
      return 'border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400';
  }
};

/**
 * Base input classes with dark mode support
 */
const baseInputClasses = 'block w-full rounded-md shadow-sm focus:ring-1 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400';

/**
 * Regular Input component with dark mode support
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  startIcon,
  endIcon,
  loading = false,
  className = '',
  ...props
}, ref): ReactElement => {
  const hasError = Boolean(error);
  const variantClasses = getVariantClasses(variant, hasError);
  
  const inputClasses = [
    baseInputClasses,
    variantClasses,
    startIcon ? 'pl-10' : 'pl-3',
    endIcon || loading ? 'pr-10' : 'pr-3',
    props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="label block mb-2 text-gray-700 dark:text-gray-300 font-medium">
          {label}
          {props.required && <span className="text-danger-500 dark:text-danger-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400 dark:text-gray-500">
              {startIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {(endIcon || loading) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {loading ? (
              <div className="h-5 w-5">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 dark:border-primary-400"></div>
              </div>
            ) : (
              <div className="h-5 w-5 text-gray-400 dark:text-gray-500">
                {endIcon}
              </div>
            )}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error && (
            <p className="error-text text-sm text-danger-600 dark:text-danger-400">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * TextArea component with dark mode support
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  loading = false,
  className = '',
  ...props
}, ref): ReactElement => {
  const hasError = Boolean(error);
  const variantClasses = getVariantClasses(variant, hasError);
  
  const textareaClasses = [
    baseInputClasses,
    variantClasses,
    'px-3 py-2',
    props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="label block mb-2 text-gray-700 dark:text-gray-300 font-medium">
          {label}
          {props.required && <span className="text-danger-500 dark:text-danger-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          className={textareaClasses}
          {...props}
        />
        
        {loading && (
          <div className="absolute top-2 right-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 dark:border-primary-400"></div>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error && (
            <p className="error-text text-sm text-danger-600 dark:text-danger-400">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

/**
 * Select component with dark mode support
 * Fixed: Removed duplicate arrow issue by hiding browser default arrow
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  loading = false,
  className = '',
  children,
  ...props
}, ref): ReactElement => {
  const hasError = Boolean(error);
  const variantClasses = getVariantClasses(variant, hasError);
  
  const selectClasses = [
    baseInputClasses,
    variantClasses,
    'px-3 py-2',
    loading ? 'pr-10' : 'pr-8',
    // Remove browser default arrow
    'appearance-none',
    props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="label block mb-2 text-gray-700 dark:text-gray-300 font-medium">
          {label}
          {props.required && <span className="text-danger-500 dark:text-danger-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {children}
        </select>
        
        {loading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 dark:border-primary-400"></div>
          </div>
        )}
        
        {!loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error && (
            <p className="error-text text-sm text-danger-600 dark:text-danger-400">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
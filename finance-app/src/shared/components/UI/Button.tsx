/**
 * @fileoverview Reusable Button component with multiple variants and accessibility support
 * @module shared/components/UI/Button
 */

import { forwardRef } from 'react';
import type { ReactElement, ButtonHTMLAttributes } from 'react';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component
 * 
 * @interface ButtonProps
 * @extends ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button @default 'primary' */
  variant?: ButtonVariant;
  
  /** Size of the button @default 'md' */
  size?: ButtonSize;
  
  /** Whether the button is in loading state @default false */
  loading?: boolean;
  
  /** Icon to display before text */
  icon?: ReactElement;
  
  /** Icon to display after text */
  iconRight?: ReactElement;
  
  /** Whether button should take full width @default false */
  fullWidth?: boolean;
}

/**
 * Get CSS classes for button variant
 */
const getVariantClasses = (variant: ButtonVariant): string => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'bg-success-500 text-white hover:bg-success-600',
    warning: 'bg-warning-500 text-white hover:bg-warning-600',
  };
  
  return variants[variant];
};

/**
 * Get CSS classes for button size
 */
const getSizeClasses = (size: ButtonSize): string => {
  const sizes = {
    sm: 'btn-sm',
    md: '', // Default size defined in CSS
    lg: 'btn-lg',
  };
  
  return sizes[size];
};

/**
 * Button component with multiple variants and sizes
 * 
 * Provides a reusable button with consistent styling and behavior
 * across the application. Supports keyboard navigation, screen readers,
 * loading states, and various visual variants.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Button onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * // With variant and size
 * <Button
 *   variant="danger"
 *   size="lg"
 *   onClick={handleDelete}
 *   disabled={isDeleting}
 * >
 *   Delete Item
 * </Button>
 * 
 * // With loading state
 * <Button
 *   variant="primary"
 *   loading={isSubmitting}
 *   onClick={handleSubmit}
 * >
 *   {isSubmitting ? 'Saving...' : 'Save'}
 * </Button>
 * 
 * // With icons
 * <Button
 *   icon={<PlusIcon />}
 *   iconRight={<ArrowIcon />}
 * >
 *   Add Item
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ): ReactElement => {
    const baseClasses = 'btn';
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    const widthClasses = fullWidth ? 'w-full' : '';
    const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '';
    
    const allClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      disabledClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={allClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && (
          <span className="mr-2 inline-flex items-center">
            {icon}
          </span>
        )}
        
        <span className="inline-flex items-center">
          {children}
        </span>
        
        {!loading && iconRight && (
          <span className="ml-2 inline-flex items-center">
            {iconRight}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Icon Button component for action buttons with only icons
 * 
 * @component
 * @example
 * ```tsx
 * <IconButton
 *   icon={<TrashIcon />}
 *   variant="danger"
 *   onClick={handleDelete}
 *   aria-label="Delete item"
 * />
 * ```
 */
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'iconRight'> {
  /** Icon to display */
  icon: ReactElement;
  
  /** Accessible label for screen readers */
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className = '', ...props }, ref): ReactElement => {
    const iconButtonClasses = 'p-2 aspect-square flex items-center justify-center';
    
    return (
      <Button
        ref={ref}
        className={`${iconButtonClasses} ${className}`}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

/**
 * Button Group component for grouping related buttons
 * 
 * @component
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </ButtonGroup>
 * ```
 */
export interface ButtonGroupProps {
  /** Button components to group */
  children: ReactElement[];
  
  /** Additional CSS classes */
  className?: string;
  
  /** Orientation of the button group @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroup = ({
  children,
  className = '',
  orientation = 'horizontal'
}: ButtonGroupProps): ReactElement => {
  const orientationClasses = orientation === 'horizontal' 
    ? 'flex-row space-x-2' 
    : 'flex-col space-y-2';
    
  const groupClasses = `flex ${orientationClasses} ${className}`;
  
  return (
    <div className={groupClasses} role="group">
      {children}
    </div>
  );
};
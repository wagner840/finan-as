/**
 * @fileoverview Color picker component with predefined palette and custom input
 * @module shared/components/UI/ColorPicker
 */

import { useState, useCallback } from 'react';
import type { ReactElement } from 'react';
import { Input } from './Input';

/**
 * Props for the ColorPicker component
 */
export interface ColorPickerProps {
  /** Currently selected color in hex format */
  value: string;
  
  /** Handler for color changes */
  onChange: (color: string) => void;
  
  /** Label for the color picker */
  label?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Whether the picker is disabled */
  disabled?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Predefined color palette for common category colors
 */
const PREDEFINED_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FECA57', // Yellow
  '#FF9FF3', // Pink
  '#54A0FF', // Light Blue
  '#5F27CD', // Purple
  '#00D2D3', // Cyan
  '#FF9F43', // Orange
  '#10B981', // Emerald
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6B7280', // Gray
];

/**
 * Color picker component with predefined palette and custom hex input
 * 
 * Provides an intuitive interface for selecting colors with both a predefined
 * palette of common colors and a custom hex input for precise color selection.
 * Includes accessibility features and validation.
 * 
 * @component
 * @example
 * ```tsx
 * <ColorPicker
 *   value={selectedColor}
 *   onChange={handleColorChange}
 *   label="Cor da Categoria"
 *   error={colorError}
 * />
 * ```
 */
export const ColorPicker = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
}: ColorPickerProps): ReactElement => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  // Validate hex color format
  const isValidHexColor = useCallback((color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color);
  }, []);

  // Handle predefined color selection
  const handlePredefinedColorSelect = (color: string): void => {
    if (disabled) return;
    onChange(color);
    setShowCustomInput(false);
  };

  // Handle custom color input
  const handleCustomColorChange = (inputValue: string): void => {
    setCustomValue(inputValue);
    
    // Add # prefix if missing
    let colorValue = inputValue;
    if (colorValue && !colorValue.startsWith('#')) {
      colorValue = '#' + colorValue;
    }
    
    // Validate and update if valid
    if (colorValue.length === 7 && isValidHexColor(colorValue)) {
      onChange(colorValue.toUpperCase());
    }
  };

  // Handle custom input toggle
  const toggleCustomInput = (): void => {
    if (disabled) return;
    
    setShowCustomInput(!showCustomInput);
    if (!showCustomInput) {
      setCustomValue(value.replace('#', ''));
    }
  };

  // Check if current value is in predefined colors
  const isCurrentColorPredefined = PREDEFINED_COLORS.includes(value.toUpperCase());

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="label block mb-2">
          {label}
        </label>
      )}
      
      <div className="space-y-3">
        {/* Current Color Preview */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: value }}
            aria-label={`Cor selecionada: ${value}`}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700">
              Cor Selecionada
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {value.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Predefined Colors Grid */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Cores Populares
          </div>
          <div className="grid grid-cols-8 gap-2">
            {PREDEFINED_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePredefinedColorSelect(color)}
                disabled={disabled}
                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                  value.toUpperCase() === color.toUpperCase()
                    ? 'border-gray-900 scale-110 shadow-md'
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ backgroundColor: color }}
                aria-label={`Selecionar cor ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Custom Color Input Toggle */}
        <div>
          <button
            type="button"
            onClick={toggleCustomInput}
            disabled={disabled}
            className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showCustomInput ? 'Ocultar cor personalizada' : 'Usar cor personalizada'}
          </button>
        </div>

        {/* Custom Color Input */}
        {showCustomInput && (
          <div>
            <Input
              label="Código Hex da Cor"
              type="text"
              value={customValue}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              placeholder="FF6B6B"
              disabled={disabled}
              startIcon={
                <span className="text-gray-500 font-mono">#</span>
              }
              helperText="Digite o código hexadecimal da cor (sem o #)"
            />
          </div>
        )}

        {/* Quick Actions */}
        {!isCurrentColorPredefined && (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              disabled={disabled}
              className="text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Editar cor atual
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="error-text mt-1">
          {error}
        </p>
      )}

      {/* Accessibility Instructions */}
      <div className="sr-only">
        Use as setas do teclado para navegar entre as cores predefinidas,
        e pressione Enter para selecionar uma cor.
        Para cores personalizadas, use o campo de texto hex.
      </div>
    </div>
  );
};

/**
 * Simple color swatch component for displaying a color
 * 
 * @component
 * @example
 * ```tsx
 * <ColorSwatch color="#FF6B6B" size="sm" />
 * ```
 */
export interface ColorSwatchProps {
  /** Color in hex format */
  color: string;
  
  /** Size of the swatch */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Whether the swatch is selected */
  selected?: boolean;
  
  /** Accessible label */
  'aria-label'?: string;
}

export const ColorSwatch = ({
  color,
  size = 'md',
  className = '',
  onClick,
  selected = false,
  'aria-label': ariaLabel,
}: ColorSwatchProps): ReactElement => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const baseClasses = [
    'rounded-full border-2 transition-all duration-200',
    selected ? 'border-gray-900 scale-110 shadow-md' : 'border-gray-300',
    onClick ? 'cursor-pointer hover:border-gray-400 hover:scale-105' : '',
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={baseClasses}
      style={{ backgroundColor: color }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel || `Cor ${color}`}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    />
  );
};
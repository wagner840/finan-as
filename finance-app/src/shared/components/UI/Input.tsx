/**
 * @fileoverview Reusable Input component with validation states and accessibility
 * @module shared/components/UI/Input
 */

// Re-export specialized input components
export { Input, TextArea, Select } from './InputComponents';
export type { InputProps, TextAreaProps, SelectProps } from './InputComponents';

// Legacy support - this will be the main export interface
export { Input as default } from './InputComponents';
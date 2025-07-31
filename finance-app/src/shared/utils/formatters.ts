/**
 * @fileoverview Utility functions for formatting currency, dates, and numbers
 * @module shared/utils/formatters
 */

/**
 * Formats a number as Brazilian currency (BRL)
 * 
 * @param amountInCents - Amount in cents to avoid floating point issues
 * @param options - Formatting options
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * formatCurrency(123456); // "R$ 1.234,56"
 * formatCurrency(0); // "R$ 0,00"
 * formatCurrency(-50000); // "-R$ 500,00"
 * ```
 */
export function formatCurrency(
  amountInCents: number,
  options: {
    showSymbol?: boolean;
    showSign?: boolean;
  } = {}
): string {
  const { showSymbol = true, showSign = false } = options;
  
  const amount = amountInCents / 100;
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);
  
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absoluteAmount);
  
  if (isNegative) {
    return showSymbol ? `-${formatted}` : `-${formatted}`;
  }
  
  if (showSign && amount > 0) {
    return showSymbol ? `+${formatted}` : `+${formatted}`;
  }
  
  return formatted;
}

/**
 * Formats a date string in Brazilian format
 * 
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param format - Desired format type
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate('2024-01-15'); // "15/01/2024"
 * formatDate('2024-01-15', 'short'); // "15/01"
 * formatDate('2024-01-15', 'long'); // "15 de janeiro de 2024"
 * formatDate('2024-01-15', 'relative'); // "há 5 dias" (example)
 * ```
 */
export function formatDate(
  dateString: string,
  format: 'default' | 'short' | 'long' | 'relative' = 'default'
): string {
  const date = new Date(dateString + 'T00:00:00'); // Avoid timezone issues
  
  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }).format(date);
      
    case 'long':
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
      
    case 'relative':
      return formatRelativeDate(date);
      
    default:
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
  }
}

/**
 * Formats a date as relative time (e.g., "há 2 dias", "ontem", "hoje")
 * 
 * @param date - Date to format
 * @returns Relative date string in Portuguese
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays === -1) return 'Amanhã';
  
  if (diffDays > 0) {
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;
    return `Há ${Math.floor(diffDays / 365)} anos`;
  } else {
    const futureDays = Math.abs(diffDays);
    if (futureDays < 7) return `Em ${futureDays} dias`;
    if (futureDays < 30) return `Em ${Math.floor(futureDays / 7)} semanas`;
    if (futureDays < 365) return `Em ${Math.floor(futureDays / 30)} meses`;
    return `Em ${Math.floor(futureDays / 365)} anos`;
  }
}

/**
 * Formats a number with proper Brazilian number formatting
 * 
 * @param number - Number to format
 * @param options - Formatting options
 * @returns Formatted number string
 * 
 * @example
 * ```typescript
 * formatNumber(1234.56); // "1.234,56"
 * formatNumber(1234, { decimals: 0 }); // "1.234"
 * formatNumber(0.1234, { decimals: 4 }); // "0,1234"
 * ```
 */
export function formatNumber(
  number: number,
  options: {
    decimals?: number;
    showThousands?: boolean;
  } = {}
): string {
  const { decimals = 2, showThousands = true } = options;
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: showThousands,
  }).format(number);
}

/**
 * Parses a Brazilian currency string to cents with improved input handling
 * 
 * @param currencyString - Currency string like "R$ 1.234,56", "1234,56", "30", "30,", etc.
 * @returns Amount in cents
 * @throws Error if string cannot be parsed
 * 
 * @example
 * ```typescript
 * parseCurrency("R$ 1.234,56"); // 123456
 * parseCurrency("1234,56"); // 123456  
 * parseCurrency("30"); // 3000 (30,00)
 * parseCurrency("30,5"); // 3050 (30,50)
 * parseCurrency("30,"); // 3000 (30,00)
 * parseCurrency(""); // 0
 * ```
 */
export function parseCurrency(currencyString: string): number {
  // Handle empty string
  if (!currencyString || currencyString.trim() === '') {
    return 0;
  }
  
  // Remove currency symbol and extra spaces
  let cleaned = currencyString
    .replace(/R\$\s?/g, '')
    .replace(/\s+/g, '')
    .trim();
  
  // Handle negative values
  const isNegative = cleaned.startsWith('-');
  if (isNegative) {
    cleaned = cleaned.substring(1);
  }
  
  // Handle empty after cleaning
  if (!cleaned) {
    return 0;
  }
  
  // Handle incomplete input like "30," or "30"
  if (cleaned.endsWith(',')) {
    cleaned = cleaned + '00';
  }
  
  // Check different formats
  let number: number;
  
  if (cleaned.includes(',')) {
    // Brazilian format with comma as decimal separator
    if (!/^\d{1,3}(?:\.\d{3})*,\d{0,2}$|^\d+,\d{0,2}$/.test(cleaned)) {
      // Handle single digit after comma like "30,5" -> "30,50"
      if (/^\d+,\d{1}$/.test(cleaned)) {
        cleaned = cleaned + '0';
      } else if (!/^\d+,\d{2}$/.test(cleaned) && !/^\d{1,3}(?:\.\d{3})*,\d{2}$/.test(cleaned)) {
        throw new Error(`Invalid currency format: ${currencyString}`);
      }
    }
    
    // Convert Brazilian format to standard decimal
    const parts = cleaned.split(',');
    const integerPart = parts[0].replace(/\./g, ''); // Remove thousands separators
    const decimalPart = parts[1] || '00';
    number = parseFloat(`${integerPart}.${decimalPart}`);
  } else if (cleaned.includes('.') && /\d+\.\d{1,2}$/.test(cleaned)) {
    // US/International format with dot as decimal separator
    number = parseFloat(cleaned);
  } else {
    // No decimal separator - treat as whole reais
    number = parseFloat(cleaned);
    if (!isNaN(number)) {
      // Keep whole number as is (already in reais)
    }
  }
  
  if (isNaN(number)) {
    throw new Error(`Cannot parse currency string: ${currencyString}`);
  }
  
  const cents = Math.round(number * 100);
  return isNegative ? -cents : cents;
}

/**
 * Formats user input for currency display while typing
 * 
 * @param input - Raw user input
 * @param previousValue - Previously formatted value for context
 * @returns Formatted display value
 * 
 * @example
 * ```typescript
 * formatCurrencyInput("30"); // "30,00"
 * formatCurrencyInput("30,5"); // "30,50" 
 * formatCurrencyInput(""); // ""
 * ```
 */
export function formatCurrencyInput(input: string, previousValue?: string): string {
  // Handle empty input
  if (!input || input.trim() === '') {
    return '';
  }
  
  // Clean input
  const cleaned = input
    .replace(/R\$\s?/g, '')
    .replace(/\s+/g, '')
    .trim();
  
  // Handle deletion - if input is shorter and was previously formatted, allow it
  if (previousValue && cleaned.length < previousValue.replace(/[^\d,]/g, '').length) {
    return cleaned;
  }
  
  try {
    const cents = parseCurrency(cleaned);
    if (cents === 0 && cleaned !== '0') {
      return cleaned; // Keep user input during typing
    }
    
    // Only format if it's a complete value
    if (cleaned.includes(',') || !cleaned.includes('.')) {
      return formatCurrency(cents, { showSymbol: false }).replace('R$ ', '');
    }
    
    return cleaned; // Keep input as-is during typing
  } catch {
    return cleaned; // Keep input as-is if parsing fails
  }
}

/**
 * Formats a date for input fields (YYYY-MM-DD format)
 * 
 * @param date - Date to format (Date object or ISO string)
 * @returns Date string in YYYY-MM-DD format
 * 
 * @example
 * ```typescript
 * formatDateForInput(new Date()); // "2024-01-15"
 * formatDateForInput("2024-01-15T10:30:00Z"); // "2024-01-15"
 * ```
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Gets today's date in YYYY-MM-DD format
 * 
 * @returns Today's date string
 */
export function getTodayString(): string {
  return formatDateForInput(new Date());
}

/**
 * Validates if a date string is in correct format and not in the future
 * 
 * @param dateString - Date string to validate
 * @returns Validation result
 */
export function validateDateString(dateString: string): {
  isValid: boolean;
  error?: string;
} {
  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return { isValid: false, error: 'Data deve estar no formato YYYY-MM-DD' };
  }
  
  const date = new Date(dateString + 'T00:00:00');
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Data inválida' };
  }
  
  // Check if date is not in the future
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (date > today) {
    return { isValid: false, error: 'Data não pode ser no futuro' };
  }
  
  return { isValid: true };
}

/**
 * Capitalizes the first letter of each word in a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 * 
 * @example
 * ```typescript
 * capitalize("alimentação e bebidas"); // "Alimentação E Bebidas"
 * capitalize("transport"); // "Transport"
 * ```
 */
export function capitalize(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Safely parses currency input without throwing errors
 * 
 * @param currencyString - Currency string to parse
 * @returns Amount in cents or 0 if invalid
 */
export function safeParseCurrency(currencyString: string): number {
  try {
    return parseCurrency(currencyString);
  } catch {
    return 0;
  }
}

/**
 * Truncates text to specified length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length including ellipsis
 * @returns Truncated text
 * 
 * @example
 * ```typescript
 * truncateText("This is a very long description", 20); 
 * // "This is a very lo..."
 * ```
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
/**
 * @fileoverview Dark mode hook with localStorage persistence and system preference detection
 * @module shared/hooks/useDarkMode
 */

import { useState, useEffect } from 'react';

/**
 * Dark mode hook return interface
 */
export interface UseDarkModeReturn {
  /** Current dark mode state */
  isDark: boolean;
  
  /** Toggle dark mode on/off */
  toggleDarkMode: () => void;
  
  /** Set dark mode to specific value */
  setDarkMode: (value: boolean) => void;
}

/**
 * Custom hook for managing dark mode state with persistence
 * 
 * Features:
 * - Persists theme preference in localStorage
 * - Respects system preference as default
 * - Automatically applies theme classes to document
 * - Provides toggle and direct set functions
 * 
 * @returns Dark mode state and controls
 * 
 * @example
 * ```typescript
 * const { isDark, toggleDarkMode } = useDarkMode();
 * 
 * return (
 *   <button onClick={toggleDarkMode}>
 *     {isDark ? 'Light Mode' : 'Dark Mode'}
 *   </button>
 * );
 * ```
 */
export const useDarkMode = (): UseDarkModeReturn => {
  // Initialize dark mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      // First check localStorage for saved preference
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        return JSON.parse(stored);
      }

      // Fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.warn('Error reading dark mode preference:', error);
      return false;
    }
  });

  // Apply theme class to document when state changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no manual preference is stored
      const stored = localStorage.getItem('darkMode');
      if (stored === null) {
        setIsDark(e.matches);
      }
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  /**
   * Toggle dark mode on/off
   */
  const toggleDarkMode = (): void => {
    setDarkMode(!isDark);
  };

  /**
   * Set dark mode to specific value
   * @param value - True for dark mode, false for light mode
   */
  const setDarkMode = (value: boolean): void => {
    setIsDark(value);
    
    try {
      localStorage.setItem('darkMode', JSON.stringify(value));
    } catch (error) {
      console.warn('Error saving dark mode preference:', error);
    }
  };

  return {
    isDark,
    toggleDarkMode,
    setDarkMode,
  };
};
/**
 * @fileoverview Generic hook for localStorage management with error handling
 * @module features/finance/hooks/useLocalStorage
 */

import { useState, useEffect, useCallback } from 'react';
import type { UseLocalStorageReturn } from '../types/financeTypes';

/**
 * Custom hook for managing localStorage with React state synchronization
 * 
 * Provides automatic state synchronization with localStorage, error handling,
 * and fallback strategies when localStorage is not available.
 * 
 * @template T - Type of the stored value
 * @param key - localStorage key
 * @param defaultValue - Default value when key doesn't exist
 * @returns Object with value, setter, loading state, error, and remove function
 * 
 * @example
 * ```typescript
 * const { value, setValue, loading, error } = useLocalStorage('user-preferences', {
 *   theme: 'light',
 *   language: 'pt-BR'
 * });
 * 
 * // Update value
 * setValue({ theme: 'dark', language: 'pt-BR' });
 * 
 * // Update with function
 * setValue(prev => ({ ...prev, theme: 'dark' }));
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): UseLocalStorageReturn<T> {
  const [value, setInternalValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if localStorage is available
  const isLocalStorageAvailable = useCallback((): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      
      const testKey = '__localStorage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Get value from localStorage
  const getStoredValue = useCallback((): T => {
    try {
      if (typeof window === 'undefined') {
        console.warn(`localStorage not available, using default value for key: ${key}`);
        return defaultValue;
      }

      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return defaultValue;
      }

      return JSON.parse(item) as T;
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
      setError(`Erro ao ler dados salvos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      return defaultValue;
    }
  }, [key, defaultValue]);

  // Set value to localStorage
  const setStoredValue = useCallback((newValue: T): void => {
    try {
      if (typeof window === 'undefined') {
        console.warn(`localStorage not available, cannot save key: ${key}`);
        setError('Armazenamento local não disponível. Dados não serão salvos.');
        return;
      }

      window.localStorage.setItem(key, JSON.stringify(newValue));
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(`Error writing localStorage key "${key}":`, err);
      setError(`Erro ao salvar dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [key]);

  // Initialize value from localStorage
  useEffect(() => {
    const storedValue = getStoredValue();
    setInternalValue(storedValue);
    setLoading(false);
  }, [key]); // Only depend on key, not getStoredValue which recreates every render

  // Update both state and localStorage
  const setValue = useCallback((newValue: T | ((prev: T) => T)): void => {
    console.log('💾 useLocalStorage setValue called with:', newValue);
    setInternalValue(prev => {
      console.log('💾 Previous value:', prev);
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      
      console.log('💾 Value to store:', valueToStore);
      setStoredValue(valueToStore);
      console.log('💾 localStorage after setStoredValue:', localStorage.getItem(key));
      return valueToStore;
    });
  }, [key, setStoredValue]);

  // Remove value from localStorage
  const remove = useCallback((): void => {
    try {
      if (typeof window === 'undefined') {
        console.warn(`localStorage not available, cannot remove key: ${key}`);
        return;
      }

      window.localStorage.removeItem(key);
      setInternalValue(defaultValue);
      setError(null);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError(`Erro ao remover dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [key, defaultValue]);

  // Listen for storage events (changes from other tabs)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as T;
          setInternalValue(newValue);
        } catch (err) {
          console.error(`Error parsing storage event for key "${key}":`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return {
    value,
    setValue,
    loading,
    error,
    remove,
  };
}

/**
 * Hook for managing multiple localStorage keys as a single object
 * 
 * Useful for managing related settings or preferences.
 * 
 * @template T - Type of the stored object
 * @param keyPrefix - Prefix for all localStorage keys
 * @param defaultValue - Default object value
 * @returns Object with value, setter, loading state, error, and utility functions
 * 
 * @example
 * ```typescript
 * const { value, setValue, updateKey, removeKey } = useLocalStorageObject(
 *   'app-settings',
 *   { theme: 'light', notifications: true }
 * );
 * 
 * // Update specific key
 * updateKey('theme', 'dark');
 * 
 * // Remove specific key
 * removeKey('notifications');
 * ```
 */
export function useLocalStorageObject<T extends Record<string, unknown>>(
  keyPrefix: string,
  defaultValue: T
) {
  const { value, setValue, loading, error, remove } = useLocalStorage(keyPrefix, defaultValue);

  const updateKey = useCallback(<K extends keyof T>(
    key: K,
    newValue: T[K]
  ): void => {
    setValue(prev => ({ ...prev, [key]: newValue }));
  }, [setValue]);

  const removeKey = useCallback(<K extends keyof T>(key: K): void => {
    setValue(prev => {
      const newValue = { ...prev };
      delete newValue[key];
      return newValue;
    });
  }, [setValue]);

  const resetToDefault = useCallback((): void => {
    setValue(defaultValue);
  }, [setValue, defaultValue]);

  return {
    value,
    setValue,
    updateKey,
    removeKey,
    resetToDefault,
    loading,
    error,
    remove,
  };
}

/**
 * Hook for managing localStorage with automatic JSON schema validation
 * 
 * @template T - Type of the stored value
 * @param key - localStorage key
 * @param defaultValue - Default value
 * @param validator - Function to validate parsed data
 * @returns Same as useLocalStorage but with validation
 * 
 * @example
 * ```typescript
 * const validateUser = (data: unknown) => {
 *   if (typeof data === 'object' && data !== null && 'name' in data) {
 *     return data as User;
 *   }
 *   throw new Error('Invalid user data');
 * };
 * 
 * const { value, setValue } = useValidatedLocalStorage(
 *   'current-user',
 *   null,
 *   validateUser
 * );
 * ```
 */
export function useValidatedLocalStorage<T>(
  key: string,
  defaultValue: T,
  validator: (data: unknown) => T
): UseLocalStorageReturn<T> {
  const [value, setInternalValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get and validate value from localStorage
  const getValidatedValue = useCallback((): T => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      
      const item = window.localStorage.getItem(key);
      if (item === null) return defaultValue;

      const parsed = JSON.parse(item);
      return validator(parsed);
    } catch (err) {
      console.error(`Error validating localStorage key "${key}":`, err);
      setError(`Dados salvos inválidos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      return defaultValue;
    }
  }, [key, defaultValue, validator]);

  // Initialize
  useEffect(() => {
    const validatedValue = getValidatedValue();
    setInternalValue(validatedValue);
    setLoading(false);
  }, [getValidatedValue]);

  // Set value with validation
  const setValue = useCallback((newValue: T | ((prev: T) => T)): void => {
    setInternalValue(prev => {
      const valueToStore = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue;

      try {
        // Validate before storing
        validator(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        
        setError(null);
        return valueToStore;
      } catch (err) {
        console.error(`Error validating value for key "${key}":`, err);
        setError(`Erro ao validar dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        return prev; // Don't update if validation fails
      }
    });
  }, [key, validator]);

  const remove = useCallback((): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setInternalValue(defaultValue);
      setError(null);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError(`Erro ao remover dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [key, defaultValue]);

  return {
    value,
    setValue,
    loading,
    error,
    remove,
  };
}
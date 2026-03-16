import { useCallback, useRef } from "react";

/**
 * Custom hook to debounce a function
 * Useful for form submissions, searches, and other expensive operations
 * 
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {Function} Debounced function
 */
export const useDebounceCallback = (callback, delay = 500) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

/**
 * Utility function to debounce a function (non-hook version)
 * Useful for utility functions and non-React code
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 500) => {
  let timeoutId;

  return function debouncedFunc(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

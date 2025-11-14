import { useState, useEffect, useRef } from 'react';
import { searchTranslations } from '../lib/sanity';

/**
 * Custom hook for autocomplete functionality with debouncing
 * @param {string} query - External query value to search for
 * @param {string} language - Current UI language (en or zh)
 * @param {number} minChars - Minimum characters before searching (default: 2)
 * @returns {object} - { suggestions, isLoading }
 */
export function useAutocomplete(query, language, minChars = 2) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't search if query is too short
    if (!query || query.length < minChars) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Debounce: wait 300ms after user stops typing
    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchTranslations(query, language, 10);
        setSuggestions(results);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, language, minChars]);

  return { suggestions, isLoading };
}

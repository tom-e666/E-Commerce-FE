import { useState, useCallback } from 'react';
import { smartSearchAPI, SmartSearchResponse } from '@/services/search/endpoints';
import { useRouter } from 'next/navigation';

export const useSearch = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SmartSearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const router = useRouter();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Searching for:', searchQuery);
      const searchResults = await smartSearchAPI(searchQuery);
      console.log('Search results:', searchResults);

      // Kiểm tra xem kết quả có lỗi không
      if (searchResults.code !== 200) {
        setError(searchResults.message || 'Search failed');
        setResults(null);
        return null;
      }

      setResults(searchResults);
      setShowResults(true);
      
      // Store results in localStorage for the search results page
      localStorage.setItem('searchResults', JSON.stringify(searchResults));
      localStorage.setItem('searchQuery', searchQuery);
      
      return searchResults;
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching');
      setResults(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent, navigate = true) => {
    if (e) {
      e.preventDefault();
    }

    const result = await handleSearch(query);
    
    if (navigate && result && query.trim()) {
      router.push(`/smartSearch?q=${encodeURIComponent(query)}`);
    }
    
    return result;
  }, [query, handleSearch, router]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults(null);
    setError(null);
    setShowResults(false);
    localStorage.removeItem('searchResults');
    localStorage.removeItem('searchQuery');
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    setShowResults,
    handleSearch,
    handleSubmit,
    clearSearch
  };
};

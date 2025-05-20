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
        console.warn('Search returned non-200 code:', searchResults.code, searchResults.message);
        setError(searchResults.message || 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
      }

      setResults(searchResults);

      // Lưu kết quả tìm kiếm vào localStorage để có thể truy cập từ trang kết quả tìm kiếm
      localStorage.setItem('searchResults', JSON.stringify(searchResults));
      localStorage.setItem('searchQuery', searchQuery);

      return searchResults;
    } catch (err) {
      console.error('Search error:', err);
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');

      // Tạo kết quả tìm kiếm mặc định trong trường hợp lỗi
      const defaultResults = {
        code: 500,
        message: 'Có lỗi xảy ra khi tìm kiếm',
        products: [],
        total: 0,
        filters: {
          brands: [],
          categories: [],
          price_range: { min: 0, max: 0 }
        },
        metadata: {
          original_query: searchQuery,
          interpreted_query: searchQuery,
          processing_time_ms: 0
        }
      };

      setResults(defaultResults);
      localStorage.setItem('searchResults', JSON.stringify(defaultResults));
      localStorage.setItem('searchQuery', searchQuery);

      return defaultResults;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent, navigateToResults: boolean = true) => {
    if (e) {
      e.preventDefault();
    }

    if (query.trim()) {
      try {
        // Thực hiện tìm kiếm và đợi kết quả
        const searchResults = await handleSearch(query);

        // Hiển thị kết quả tìm kiếm ngay trên trang hiện tại
        setShowResults(true);

        // Chỉ chuyển hướng nếu navigateToResults = true
        if (navigateToResults) {
          router.push(`/smartSearch?q=${encodeURIComponent(query)}`);
        }

        return searchResults;
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        return null;
      }
    }
    return null;
  }, [query, router, handleSearch]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    setShowResults,
    handleSearch,
    handleSubmit
  };
};

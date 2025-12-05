import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import SpotCard from '../components/SpotCard';
import { spotApi } from '../api/client';
import type { Spot } from '../types';

export default function SearchPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const results = await spotApi.searchSpots(query);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
        setError('검색 중 오류가 발생했습니다.');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              "{query}"
            </h1>
          </div>
          <p className="text-gray-600">
            {searchResults.length} {i18n.language === 'ko' ? '개의 결과' : 'results found'}
          </p>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-500">{i18n.language === 'ko' ? '검색 중...' : 'Searching...'}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-xl text-red-500 mb-2">{error}</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">{t('common.noResults')}</p>
            <p className="text-gray-400">
              {i18n.language === 'ko'
                ? '다른 검색어로 시도해보세요'
                : 'Try searching with different keywords'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

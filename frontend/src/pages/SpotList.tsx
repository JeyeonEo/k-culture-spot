import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Grid, List } from 'lucide-react';
import SpotCard from '../components/SpotCard';
import { spotApi } from '../api/client';
import type { Spot, Category } from '../types';

const categories: { value: Category | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'nav.all' },
  { value: 'drama', labelKey: 'category.drama' },
  { value: 'kpop', labelKey: 'category.kpop' },
  { value: 'movie', labelKey: 'category.movie' },
  { value: 'variety', labelKey: 'category.variety' },
];

export default function SpotList() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);
        if (selectedCategory === 'all') {
          const response = await spotApi.getSpots({ page, page_size: 20 });
          setSpots(response.spots);
          setTotal(response.total);
        } else {
          const response = await spotApi.getSpotsByCategory(selectedCategory, page);
          setSpots(response.spots);
          setTotal(response.total);
        }
      } catch (error) {
        console.error('Failed to load spots:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, [selectedCategory, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.all')}</h1>
          <p className="text-gray-600 mt-2">
            {loading ? t('common.loading') : `${total}개의 스팟이 있습니다`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-500'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-500'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Spots Grid/List */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : spots.length > 0 ? (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
            }>
              {spots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
            {/* Pagination */}
            {total > 20 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  이전
                </button>
                <span className="px-4 py-2 text-gray-700">
                  {page} / {Math.ceil(total / 20)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 20)}
                  className="px-4 py-2 rounded bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  다음
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">{t('common.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tv, Music, Film, Sparkles } from 'lucide-react';
import SpotCard from '../components/SpotCard';
import { spotApi } from '../api/client';
import type { Spot, Category } from '../types';

const categoryConfig: Record<Category, { icon: typeof Tv; gradient: string }> = {
  drama: { icon: Tv, gradient: 'from-pink-500 to-rose-500' },
  kpop: { icon: Music, gradient: 'from-purple-500 to-violet-500' },
  movie: { icon: Film, gradient: 'from-blue-500 to-cyan-500' },
  variety: { icon: Sparkles, gradient: 'from-orange-500 to-amber-500' },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: Category }>();
  const { t, i18n } = useTranslation();

  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validCategory = category && category in categoryConfig ? category : 'drama';
  const config = categoryConfig[validCategory as Category];
  const Icon = config.icon;

  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await spotApi.getSpotsByCategory(validCategory);
        setSpots(response.spots);
      } catch (err) {
        console.error('Failed to fetch category spots:', err);
        setError('카테고리 데이터를 불러오는데 실패했습니다.');
        setSpots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [validCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className={`bg-gradient-to-r ${config.gradient} py-16 px-4`}>
        <div className="max-w-7xl mx-auto text-center text-white">
          <Icon className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">{t(`category.${validCategory}`)}</h1>
          <p className="text-lg opacity-90">
            {spots.length} spots available
          </p>
        </div>
      </div>

      {/* Spots Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-500">{i18n.language === 'ko' ? '로딩 중...' : 'Loading...'}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-xl text-red-500 mb-2">{error}</p>
          </div>
        ) : spots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">{t('common.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import SpotCard from '../components/SpotCard';
import ContentCarousel from '../components/ContentCarousel';
import { spotApi, contentApi } from '../api/client';
import type { Spot, Category, Content } from '../types';

const categories: Category[] = ['drama', 'kpop', 'movie', 'variety'];

export default function Home() {
  const { t } = useTranslation();
  const [featuredSpots, setFeaturedSpots] = useState<Spot[]>([]);
  const [featuredContents, setFeaturedContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [spots, contents] = await Promise.all([
          spotApi.getFeaturedSpots(),
          contentApi.getFeaturedContents(),
        ]);
        setFeaturedSpots(spots);
        setFeaturedContents(contents);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
        </div>
      </section>

      {/* Content Carousel Section */}
      {featuredContents.length > 0 && (
        <ContentCarousel
          contents={featuredContents}
          title={t('home.contentCarousel')}
        />
      )}

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">{t('home.categories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spots Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">{t('home.featured')}</h2>
            <Link
              to="/spots"
              className="flex items-center gap-1 text-pink-500 hover:text-pink-600 font-medium"
            >
              {t('common.viewMore')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : featuredSpots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">표시할 스팟이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your HypeSpot Journey Today
          </h2>
          <p className="text-lg text-pink-100 mb-8">
            Discover the filming locations of your favorite dramas and the footsteps of K-POP stars
          </p>
          <Link
            to="/spots"
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            Explore All Spots
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

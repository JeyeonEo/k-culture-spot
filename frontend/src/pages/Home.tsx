import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import SpotCard from '../components/SpotCard';
import ContentCarousel from '../components/ContentCarousel';
import { spotApi, contentApi, tourApi } from '../api/client';
import type { Spot, Category, Content, Tour } from '../types';

const categories: Category[] = ['drama', 'kpop', 'movie', 'variety'];

export default function Home() {
  const { t, i18n } = useTranslation();
  const [featuredSpots, setFeaturedSpots] = useState<Spot[]>([]);
  const [featuredContents, setFeaturedContents] = useState<Content[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const getLocalizedTitle = (tour: Tour) => {
    switch (i18n.language) {
      case 'en':
        return tour.titleEn || tour.title;
      case 'ja':
        return tour.titleJa || tour.title;
      case 'zh':
        return tour.titleZh || tour.title;
      default:
        return tour.title;
    }
  };

  const getLocalizedSubtitle = (tour: Tour) => {
    switch (i18n.language) {
      case 'en':
        return tour.subtitleEn || tour.subtitle;
      case 'ja':
        return tour.subtitleJa || tour.subtitle;
      case 'zh':
        return tour.subtitleZh || tour.subtitle;
      default:
        return tour.subtitle;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [spots, contents, tours] = await Promise.all([
          spotApi.getFeaturedSpots(),
          contentApi.getFeaturedContents(),
          tourApi.getFeaturedTours().catch(() => []),
        ]);
        setFeaturedSpots(spots);
        setFeaturedContents(contents);
        setFeaturedTours(tours);
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
      {/* Banner/Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
        </div>
      </section>

      {/* Content Carousel - Movie/Idol Posters */}
      {featuredContents.length > 0 && (
        <ContentCarousel
          contents={featuredContents}
          title={t('home.contentCarousel')}
        />
      )}

      {/* Categories - Drama/K-POP/Movie/ETC */}
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

      {/* Recommended Tours/Courses */}
      {featuredTours.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">{t('home.recommendedTours')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTours.slice(0, 6).map((tour) => (
                <Link
                  key={tour.id}
                  to={`/tours/${tour.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tour.imageUrl}
                      alt={getLocalizedTitle(tour)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {tour.isOfficial && (
                      <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        Official
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-pink-500 transition-colors">
                      {getLocalizedTitle(tour)}
                    </h3>
                    {getLocalizedSubtitle(tour) && (
                      <p className="text-gray-500 text-sm mb-3">{getLocalizedSubtitle(tour)}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {tour.spotCount} {t('tour.spots')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tour.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Spots */}
      <section className="py-16 px-4 bg-gray-50">
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
              <p className="text-gray-500">{t('common.loading')}</p>
            </div>
          ) : featuredSpots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('common.noResults')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

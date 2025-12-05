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

      {/* Trending Courses Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Trending Courses</h2>
          <div className="space-y-4">
            {[
              { rank: 1, title: '폭삭속았수다 반나절코스', author: '공식계정', category: 'drama', duration: '4시간', spots: 3 },
              { rank: 2, title: 'NCT WISH 서울 투어', author: 'SM엔터테인먼트', category: 'kpop', duration: '5시간', spots: 4 },
              { rank: 3, title: '오징어게임 완전정복 코스', author: '넷플릭스', category: 'drama', duration: '6시간', spots: 5 },
              { rank: 4, title: 'BTS 성지순례 투어', author: 'HYBE', category: 'kpop', duration: '8시간', spots: 6 },
              { rank: 5, title: 'K-Pop Hunters 홍대 투어', author: '넷플릭스', category: 'movie', duration: '3시간', spots: 3 },
            ].map((course) => (
              <div
                key={course.rank}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex items-center gap-6"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">#{course.rank}</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {course.title} <span className="text-gray-400 text-base font-normal">by {course.author}</span>
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-pink-500 font-medium">#{course.category}</span>
                    <span className="text-gray-400">•</span>
                    <span>{course.duration}</span>
                    <span className="text-gray-400">•</span>
                    <span>{course.spots}개 스팟</span>
                  </div>
                </div>
                <Link
                  to="/spots"
                  className="flex-shrink-0 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  둘러보기
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

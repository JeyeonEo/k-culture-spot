import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star, TrendingUp } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import SpotCard from '../components/SpotCard';
import type { Spot, Category } from '../types';

// Mock data for demo
const mockFeaturedSpots: Spot[] = [
  {
    id: 1,
    name: '북촌 한옥마을',
    nameEn: 'Bukchon Hanok Village',
    nameJa: '北村韓屋村',
    nameZh: '北村韩屋村',
    description: '도깨비, 사랑의 불시착 등 수많은 드라마 촬영지로 유명한 전통 한옥마을',
    descriptionEn: 'Traditional hanok village famous for dramas like Goblin and Crash Landing on You',
    descriptionJa: 'トッケビ、愛の不時着など数多くのドラマ撮影地として有名な伝統韓屋村',
    descriptionZh: '因鬼怪、爱的迫降等众多电视剧拍摄地而闻名的传统韩屋村',
    address: '서울특별시 종로구 북촌로',
    addressEn: 'Bukchon-ro, Jongno-gu, Seoul',
    latitude: 37.5826,
    longitude: 126.9831,
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    images: [],
    relatedContent: [],
    tags: ['도깨비', '사랑의 불시착', '한옥'],
    viewCount: 15234,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'SM타운 코엑스아티움',
    nameEn: 'SMTOWN COEX Artium',
    nameJa: 'SMタウン コエックスアティウム',
    nameZh: 'SMTOWN COEX Artium',
    description: 'SM 엔터테인먼트 소속 아티스트들의 굿즈와 전시를 만날 수 있는 공간',
    descriptionEn: 'Space where you can find goods and exhibitions of SM Entertainment artists',
    descriptionJa: 'SMエンターテインメント所属アーティストのグッズや展示に出会える空間',
    descriptionZh: '可以遇见SM娱乐旗下艺人周边和展览的空间',
    address: '서울특별시 강남구 영동대로 513',
    addressEn: '513 Yeongdong-daero, Gangnam-gu, Seoul',
    latitude: 37.5128,
    longitude: 127.0591,
    category: 'kpop',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    images: [],
    relatedContent: [],
    tags: ['SM', 'NCT', 'aespa', 'EXO'],
    viewCount: 23456,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 3,
    name: '부산 해운대 해수욕장',
    nameEn: 'Haeundae Beach',
    nameJa: '海雲台海水浴場',
    nameZh: '海云台海水浴场',
    description: '해운대 연인들, 수상한 그녀 등 수많은 영화의 배경이 된 대한민국 대표 해변',
    descriptionEn: "Korea's representative beach featured in many movies like Haeundae and Miss Granny",
    descriptionJa: '海雲台の恋人たち、怪しい彼女など数多くの映画の背景となった韓国代表のビーチ',
    descriptionZh: '成为海云台恋人们、奇怪的她等众多电影背景的韩国代表性海滩',
    address: '부산광역시 해운대구 해운대해변로 264',
    addressEn: '264 Haeundae Beach Road, Haeundae-gu, Busan',
    latitude: 35.1587,
    longitude: 129.1604,
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800',
    images: [],
    relatedContent: [],
    tags: ['해운대', '영화', '부산'],
    viewCount: 18765,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 4,
    name: '런닝맨 체험관',
    nameEn: 'Running Man Experience Hall',
    nameJa: 'ランニングマン体験館',
    nameZh: 'Running Man体验馆',
    description: 'SBS 인기 예능 런닝맨의 다양한 미션을 직접 체험할 수 있는 테마파크',
    descriptionEn: 'Theme park where you can experience various missions from SBS Running Man',
    descriptionJa: 'SBS人気バラエティ「ランニングマン」の様々なミッションを体験できるテーマパーク',
    descriptionZh: '可以亲身体验SBS人气综艺Running Man各种任务的主题公园',
    address: '서울특별시 종로구 인사동길 49',
    addressEn: '49 Insadong-gil, Jongno-gu, Seoul',
    latitude: 37.5740,
    longitude: 126.9868,
    category: 'variety',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800',
    images: [],
    relatedContent: [],
    tags: ['런닝맨', 'SBS', '예능'],
    viewCount: 12345,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const categories: Category[] = ['drama', 'kpop', 'movie', 'variety'];

export default function Home() {
  const { t } = useTranslation();

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
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            {t('home.hero.subtitle')}
          </p>
          <Link
            to="/spots"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            {t('common.viewMore')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8 md:gap-16">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold">
              <MapPin className="w-6 h-6" />
              500+
            </div>
            <div className="text-sm text-gray-300">Spots</div>
          </div>
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold">
              <Star className="w-6 h-6" />
              4.8
            </div>
            <div className="text-sm text-gray-300">Rating</div>
          </div>
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold">
              <TrendingUp className="w-6 h-6" />
              100K+
            </div>
            <div className="text-sm text-gray-300">Visitors</div>
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockFeaturedSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your K-Culture Journey Today
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

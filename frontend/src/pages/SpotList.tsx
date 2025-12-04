import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Grid, List } from 'lucide-react';
import SpotCard from '../components/SpotCard';
import type { Spot, Category } from '../types';

// Mock data
const mockSpots: Spot[] = [
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
    tags: ['도깨비', '사랑의 불시착'],
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
    tags: ['SM', 'NCT', 'aespa'],
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
    descriptionEn: "Korea's representative beach featured in many movies",
    descriptionJa: '数多くの映画の背景となった韓国代表のビーチ',
    descriptionZh: '成为众多电影背景的韩国代表性海滩',
    address: '부산광역시 해운대구 해운대해변로 264',
    addressEn: '264 Haeundae Beach Road, Haeundae-gu, Busan',
    latitude: 35.1587,
    longitude: 129.1604,
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800',
    images: [],
    relatedContent: [],
    tags: ['해운대', '영화'],
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
    descriptionEn: 'Theme park where you can experience various missions from Running Man',
    descriptionJa: 'ランニングマンの様々なミッションを体験できるテーマパーク',
    descriptionZh: '可以体验Running Man各种任务的主题公园',
    address: '서울특별시 종로구 인사동길 49',
    addressEn: '49 Insadong-gil, Jongno-gu, Seoul',
    latitude: 37.5740,
    longitude: 126.9868,
    category: 'variety',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800',
    images: [],
    relatedContent: [],
    tags: ['런닝맨', 'SBS'],
    viewCount: 12345,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

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

  const filteredSpots = selectedCategory === 'all'
    ? mockSpots
    : mockSpots.filter((spot) => spot.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.all')}</h1>
          <p className="text-gray-600 mt-2">
            {filteredSpots.length} spots found
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
        {filteredSpots.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
          }>
            {filteredSpots.map((spot) => (
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

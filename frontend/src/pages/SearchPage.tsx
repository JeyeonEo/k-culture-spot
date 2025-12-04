import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import SpotCard from '../components/SpotCard';
import type { Spot } from '../types';

// Mock search results
const mockAllSpots: Spot[] = [
  {
    id: 1,
    name: '북촌 한옥마을',
    nameEn: 'Bukchon Hanok Village',
    nameJa: '北村韓屋村',
    nameZh: '北村韩屋村',
    description: '도깨비, 사랑의 불시착 등 수많은 드라마 촬영지',
    descriptionEn: 'Filming location for Goblin and Crash Landing on You',
    descriptionJa: 'トッケビ、愛の不時着など数多くのドラマ撮影地',
    descriptionZh: '鬼怪、爱的迫降等众多电视剧拍摄地',
    address: '서울특별시 종로구 북촌로',
    addressEn: 'Bukchon-ro, Jongno-gu, Seoul',
    latitude: 37.5826,
    longitude: 126.9831,
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    images: [],
    relatedContent: [],
    tags: ['도깨비', '사랑의 불시착', 'goblin'],
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
    description: 'SM 아티스트들의 굿즈와 전시를 만날 수 있는 공간',
    descriptionEn: 'Space for SM Entertainment artist goods and exhibitions',
    descriptionJa: 'SMアーティストのグッズや展示に出会える空間',
    descriptionZh: 'SM艺人周边和展览空间',
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
    id: 6,
    name: 'HYBE INSIGHT',
    nameEn: 'HYBE INSIGHT',
    nameJa: 'HYBE INSIGHT',
    nameZh: 'HYBE INSIGHT',
    description: 'BTS 등 HYBE 아티스트들의 역사를 체험할 수 있는 전시관',
    descriptionEn: 'Exhibition hall for HYBE artists including BTS',
    descriptionJa: 'BTSなどHYBEアーティストの歴史を体験できる展示館',
    descriptionZh: '体验BTS等HYBE艺人历史的展览馆',
    address: '서울특별시 용산구 한강대로 42',
    addressEn: '42 Hangang-daero, Yongsan-gu, Seoul',
    latitude: 37.5283,
    longitude: 126.9654,
    category: 'kpop',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    images: [],
    relatedContent: [],
    tags: ['BTS', 'HYBE', 'NewJeans'],
    viewCount: 34567,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export default function SearchPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Simple search logic (in real app, this would be an API call)
  const searchResults = query
    ? mockAllSpots.filter((spot) => {
        const searchLower = query.toLowerCase();
        return (
          spot.name.toLowerCase().includes(searchLower) ||
          spot.nameEn.toLowerCase().includes(searchLower) ||
          spot.description.toLowerCase().includes(searchLower) ||
          spot.descriptionEn.toLowerCase().includes(searchLower) ||
          spot.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
    : [];

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
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">{t('common.noResults')}</p>
            <p className="text-gray-400">
              {i18n.language === 'ko'
                ? '다른 검색어로 시도해보세요'
                : 'Try searching with different keywords'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

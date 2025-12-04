import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tv, Music, Film, Sparkles } from 'lucide-react';
import SpotCard from '../components/SpotCard';
import type { Spot, Category } from '../types';

// Mock data
const mockSpots: Record<Category, Spot[]> = {
  drama: [
    {
      id: 1,
      name: '북촌 한옥마을',
      nameEn: 'Bukchon Hanok Village',
      nameJa: '北村韓屋村',
      nameZh: '北村韩屋村',
      description: '도깨비, 사랑의 불시착 등 수많은 드라마 촬영지',
      descriptionEn: 'Filming location for Goblin, Crash Landing on You, and many more',
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
      tags: ['도깨비', '사랑의 불시착'],
      viewCount: 15234,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 5,
      name: '정동진',
      nameEn: 'Jeongdongjin',
      nameJa: '正東津',
      nameZh: '正东津',
      description: '모래시계 촬영지로 유명한 일출 명소',
      descriptionEn: 'Famous sunrise spot, filming location for Hourglass',
      descriptionJa: '砂時計の撮影地として有名な日の出スポット',
      descriptionZh: '以沙漏拍摄地闻名的日出景点',
      address: '강원도 강릉시 강동면 정동진리',
      addressEn: 'Jeongdongjin-ri, Gangdong-myeon, Gangneung, Gangwon',
      latitude: 37.6899,
      longitude: 129.0333,
      category: 'drama',
      imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800',
      images: [],
      relatedContent: [],
      tags: ['모래시계', '일출'],
      viewCount: 9876,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ],
  kpop: [
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
      tags: ['SM', 'NCT', 'aespa'],
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
      descriptionEn: 'Exhibition hall experiencing the history of HYBE artists including BTS',
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
  ],
  movie: [
    {
      id: 3,
      name: '부산 해운대 해수욕장',
      nameEn: 'Haeundae Beach',
      nameJa: '海雲台海水浴場',
      nameZh: '海云台海水浴场',
      description: '해운대 등 수많은 영화의 배경이 된 해변',
      descriptionEn: 'Beach featured in many movies including Haeundae',
      descriptionJa: '多くの映画の背景となったビーチ',
      descriptionZh: '众多电影的拍摄地海滩',
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
  ],
  variety: [
    {
      id: 4,
      name: '런닝맨 체험관',
      nameEn: 'Running Man Experience Hall',
      nameJa: 'ランニングマン体験館',
      nameZh: 'Running Man体验馆',
      description: '런닝맨의 미션을 직접 체험할 수 있는 테마파크',
      descriptionEn: 'Theme park to experience Running Man missions',
      descriptionJa: 'ランニングマンのミッションを体験できるテーマパーク',
      descriptionZh: '体验Running Man任务的主题公园',
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
  ],
};

const categoryConfig: Record<Category, { icon: typeof Tv; gradient: string }> = {
  drama: { icon: Tv, gradient: 'from-pink-500 to-rose-500' },
  kpop: { icon: Music, gradient: 'from-purple-500 to-violet-500' },
  movie: { icon: Film, gradient: 'from-blue-500 to-cyan-500' },
  variety: { icon: Sparkles, gradient: 'from-orange-500 to-amber-500' },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: Category }>();
  const { t } = useTranslation();

  const validCategory = category && category in mockSpots ? category : 'drama';
  const spots = mockSpots[validCategory as Category];
  const config = categoryConfig[validCategory as Category];
  const Icon = config.icon;

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
        {spots.length > 0 ? (
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

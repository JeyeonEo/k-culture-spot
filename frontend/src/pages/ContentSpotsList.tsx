import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { Content, Spot } from '../types';
import SpotCard from '../components/SpotCard';
import { contentApi } from '../api/client';

// Mock data - content detail
const mockContent: Content = {
  id: 1,
  title: 'K-Pop Demon Hunters',
  titleEn: 'K-Pop Demon Hunters',
  titleJa: 'K-Pop デーモンハンターズ',
  titleZh: 'K-Pop 恶魔猎人',
  type: 'movie',
  year: 2024,
  imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
};

// Mock data - all spots for this content
const mockSpots: Spot[] = [
  {
    id: 1,
    name: '홍대 클럽 스트리트',
    nameEn: 'Hongdae Club Street',
    nameJa: '弘大クラブストリート',
    nameZh: '弘大俱乐部街',
    description: '영화의 주요 촬영지로 사용된 홍대 클럽가입니다.',
    descriptionEn: 'Hongdae club district used as the main filming location.',
    descriptionJa: '映画の主要撮影地として使用された弘大クラブ街です。',
    descriptionZh: '作为电影主要拍摄地的弘大俱乐部街。',
    address: '서울특별시 마포구 홍익로 3길',
    addressEn: '3-gil, Hongik-ro, Mapo-gu, Seoul',
    latitude: 37.5563,
    longitude: 126.9238,
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    images: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'],
    relatedContent: [],
    tags: ['홍대', '클럽', 'K-Pop Hunters'],
    viewCount: 1234,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'SM타운 코엑스아티움',
    nameEn: 'SMTOWN COEX Artium',
    nameJa: 'SMTOWN COEX Artium',
    nameZh: 'SMTOWN COEX Artium',
    description: 'K-pop 아이돌들의 연습 장면이 촬영된 곳입니다.',
    descriptionEn: 'Where the K-pop idols practice scenes were filmed.',
    descriptionJa: 'K-popアイドルの練習シーンが撮影された場所です。',
    descriptionZh: 'K-pop偶像练习场景的拍摄地。',
    address: '서울특별시 강남구 영동대로 513',
    addressEn: '513 Yeongdong-daero, Gangnam-gu, Seoul',
    latitude: 37.5125,
    longitude: 127.0588,
    category: 'kpop',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'],
    relatedContent: [],
    tags: ['SM타운', '코엑스', 'K-pop'],
    viewCount: 2345,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 3,
    name: '남산타워',
    nameEn: 'Namsan Tower',
    nameJa: '南山タワー',
    nameZh: '南山塔',
    description: '클라이맥스 전투 장면이 촬영된 곳입니다.',
    descriptionEn: 'Where the climax battle scene was filmed.',
    descriptionJa: 'クライマックスの戦闘シーンが撮影された場所です。',
    descriptionZh: '高潮战斗场景的拍摄地。',
    address: '서울특별시 용산구 남산공원길 105',
    addressEn: '105 Namsangongwon-gil, Yongsan-gu, Seoul',
    latitude: 37.5512,
    longitude: 126.9882,
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800',
    images: ['https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800'],
    relatedContent: [],
    tags: ['남산', '타워', '야경'],
    viewCount: 3456,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 4,
    name: '경복궁',
    nameEn: 'Gyeongbokgung Palace',
    nameJa: '景福宮',
    nameZh: '景福宫',
    description: '과거 회상 장면이 촬영된 곳입니다.',
    descriptionEn: 'Where flashback scenes were filmed.',
    descriptionJa: '過去の回想シーンが撮影された場所です。',
    descriptionZh: '回忆场景的拍摄地。',
    address: '서울특별시 종로구 사직로 161',
    addressEn: '161 Sajik-ro, Jongno-gu, Seoul',
    latitude: 37.5796,
    longitude: 126.9770,
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1553659971-5de9acde5b56?w=800',
    images: ['https://images.unsplash.com/photo-1553659971-5de9acde5b56?w=800'],
    relatedContent: [],
    tags: ['경복궁', '고궁', '역사'],
    viewCount: 4567,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 5,
    name: '한강공원',
    nameEn: 'Hangang Park',
    nameJa: '漢江公園',
    nameZh: '汉江公园',
    description: '아이돌들의 훈련 장면이 촬영된 곳입니다.',
    descriptionEn: 'Where the idol training scenes were filmed.',
    descriptionJa: 'アイドルのトレーニングシーンが撮影された場所です。',
    descriptionZh: '偶像训练场景的拍摄地。',
    address: '서울특별시 영등포구 여의동로 330',
    addressEn: '330 Yeouido-dong, Yeongdeungpo-gu, Seoul',
    latitude: 37.5284,
    longitude: 126.9329,
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800',
    images: ['https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800'],
    relatedContent: [],
    tags: ['한강', '공원', '야외'],
    viewCount: 5678,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 6,
    name: '이태원 거리',
    nameEn: 'Itaewon Street',
    nameJa: '梨泰院通り',
    nameZh: '梨泰院街',
    description: '추격 장면이 촬영된 곳입니다.',
    descriptionEn: 'Where the chase scene was filmed.',
    descriptionJa: '追跡シーンが撮影された場所です。',
    descriptionZh: '追逐场景的拍摄地。',
    address: '서울특별시 용산구 이태원로',
    addressEn: 'Itaewon-ro, Yongsan-gu, Seoul',
    latitude: 37.5345,
    longitude: 126.9940,
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800',
    images: ['https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800'],
    relatedContent: [],
    tags: ['이태원', '거리', '야경'],
    viewCount: 6789,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export default function ContentSpotsList() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const contentId = Number(id);

  // Fetch content details
  const { data: content, isLoading: contentLoading, error: contentError } = useQuery({
    queryKey: ['content', contentId],
    queryFn: () => contentApi.getContentById(contentId),
    enabled: !!contentId && !isNaN(contentId),
  });

  // Fetch content spots
  const { data: spots = [], isLoading: spotsLoading } = useQuery({
    queryKey: ['contentSpots', contentId],
    queryFn: () => contentApi.getContentSpots(contentId),
    enabled: !!contentId && !isNaN(contentId),
  });

  const isLoading = contentLoading || spotsLoading;

  const getContentTitle = () => {
    if (!content) return '';
    switch (i18n.language) {
      case 'en': return content.titleEn || content.title;
      case 'ja': return content.titleJa || content.title;
      case 'zh': return content.titleZh || content.title;
      default: return content.title;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (contentError || !content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">{t('common.error')}</h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 mb-4">{t('contentDetail.notFound')}</p>
          <Link
            to="/"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to={`/content/${id}`}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{getContentTitle()}</h1>
            <p className="text-sm text-gray-500">
              {t('contentDetail.allSpots')} ({spots.length})
            </p>
          </div>
        </div>
      </div>

      {/* Spots Grid */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </div>
    </div>
  );
}

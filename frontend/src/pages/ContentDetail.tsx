import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import type { Content, Spot, Tour } from '../types';

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
  description: '넷플릭스 오리지널 영화로, K-pop 아이돌들이 악마 사냥꾼으로 활약하는 액션 판타지 영화입니다.',
  descriptionEn: 'A Netflix original movie where K-pop idols become demon hunters in an action fantasy film.',
  descriptionJa: 'K-popアイドルが悪魔ハンターとして活躍するNetflixオリジナルのアクションファンタジー映画です。',
  descriptionZh: 'Netflix原创电影，K-pop偶像化身恶魔猎人的动作奇幻片。',
};

// Mock data - related spots
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

// Mock data - recommended tours
const mockTours: Tour[] = [
  {
    id: 1,
    title: '하루종일 서울투어',
    titleEn: 'Full Day Seoul Tour',
    titleJa: '一日ソウルツアー',
    titleZh: '首尔一日游',
    description: 'K-Pop Hunters의 주요 촬영지를 하루에 둘러보는 코스입니다.',
    descriptionEn: 'A one-day tour of the main filming locations of K-Pop Hunters.',
    descriptionJa: 'K-Pop Huntersの主要撮影地を1日で巡るコースです。',
    descriptionZh: '一天内游览K-Pop Hunters主要拍摄地的路线。',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800',
    author: 'official',
    isOfficial: true,
    spotCount: 5,
    duration: '8시간',
    contentId: 1,
  },
  {
    id: 2,
    title: '버오는날 투어',
    titleEn: 'Rainy Day Tour',
    titleJa: '雨の日ツアー',
    titleZh: '雨天游',
    description: '비가 오는 날에도 즐길 수 있는 실내 촬영지 위주 코스입니다.',
    descriptionEn: 'Indoor filming locations you can enjoy even on rainy days.',
    descriptionJa: '雨の日でも楽しめる室内撮影地中心のコースです。',
    descriptionZh: '下雨天也能享受的室内拍摄地路线。',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    author: 'official',
    isOfficial: true,
    spotCount: 3,
    duration: '4시간',
    contentId: 1,
  },
  {
    id: 3,
    title: '야경 스팟 투어',
    titleEn: 'Night View Tour',
    titleJa: '夜景スポットツアー',
    titleZh: '夜景游',
    description: '영화 속 아름다운 야경 장면이 촬영된 곳들을 둘러봅니다.',
    descriptionEn: 'Visit the beautiful night view locations from the movie.',
    descriptionJa: '映画の美しい夜景シーンが撮影された場所を巡ります。',
    descriptionZh: '游览电影中美丽夜景场景的拍摄地。',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800',
    author: 'official',
    isOfficial: true,
    spotCount: 4,
    duration: '5시간',
    contentId: 1,
  },
];

export default function ContentDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const content = mockContent; // TODO: fetch by id from API
  const spots = mockSpots;
  const tours = mockTours.slice(0, 5);

  const getContentTitle = () => {
    switch (i18n.language) {
      case 'en': return content.titleEn || content.title;
      case 'ja': return content.titleJa || content.title;
      case 'zh': return content.titleZh || content.title;
      default: return content.title;
    }
  };

  const getSpotName = (spot: Spot) => {
    switch (i18n.language) {
      case 'en': return spot.nameEn || spot.name;
      case 'ja': return spot.nameJa || spot.name;
      case 'zh': return spot.nameZh || spot.name;
      default: return spot.name;
    }
  };

  const getTourTitle = (tour: Tour) => {
    switch (i18n.language) {
      case 'en': return tour.titleEn || tour.title;
      case 'ja': return tour.titleJa || tour.title;
      case 'zh': return tour.titleZh || tour.title;
      default: return tour.title;
    }
  };

  const getTypeLabel = () => {
    switch (content.type) {
      case 'drama': return t('category.drama');
      case 'movie': return t('category.movie');
      case 'music': return t('category.kpop');
      case 'variety': return t('category.variety');
      default: return content.type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{getContentTitle()}</h1>
            <p className="text-sm text-gray-500">
              {getTypeLabel()} {content.year && `(${content.year})`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Spots Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{t('contentDetail.spots')}</h2>
            <Link
              to={`/content/${id}/spots`}
              className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600"
            >
              {t('common.viewMore')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontal Scrollable Spots Grid */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {spots.map((spot) => (
                <Link
                  key={spot.id}
                  to={`/spots/${spot.id}`}
                  className="flex-shrink-0 w-40 group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-2">
                    <img
                      src={spot.imageUrl}
                      alt={getSpotName(spot)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getSpotName(spot)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tours Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{t('contentDetail.tours')}</h2>
            <Link
              to={`/content/${id}/tours`}
              className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600"
            >
              {t('common.viewMore')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tours List */}
          <div className="space-y-3">
            {tours.map((tour) => (
              <Link
                key={tour.id}
                to={`/tours/${tour.id}`}
                className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={tour.imageUrl}
                    alt={getTourTitle(tour)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {getTourTitle(tour)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {tour.isOfficial ? t('contentDetail.byOfficial') : `by ${tour.author}`}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {tour.spotCount} {t('contentDetail.spots')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tour.duration}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 self-center flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

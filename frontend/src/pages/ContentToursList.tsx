import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Clock, ChevronRight } from 'lucide-react';
import type { Content, Tour } from '../types';

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

// Mock data - all tours for this content
const mockTours: Tour[] = [
  {
    id: 1,
    title: '하루종일 서울투어',
    titleEn: 'Full Day Seoul Tour',
    titleJa: '一日ソウルツアー',
    titleZh: '首尔一日游',
    description: 'K-Pop Hunters의 주요 촬영지를 하루에 둘러보는 코스입니다. 홍대에서 시작해서 남산타워까지 영화 속 명장면을 따라가보세요.',
    descriptionEn: 'A one-day tour of the main filming locations of K-Pop Hunters. Start from Hongdae and follow the movie scenes to Namsan Tower.',
    descriptionJa: 'K-Pop Huntersの主要撮影地を1日で巡るコースです。弘大からスタートし、南山タワーまで映画の名シーンを辿ります。',
    descriptionZh: '一天内游览K-Pop Hunters主要拍摄地的路线。从弘大出发，沿着电影场景到南山塔。',
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
    description: '비가 오는 날에도 즐길 수 있는 실내 촬영지 위주 코스입니다. SM타운과 코엑스몰을 중심으로 둘러봅니다.',
    descriptionEn: 'Indoor filming locations you can enjoy even on rainy days. Centered around SMTOWN and COEX Mall.',
    descriptionJa: '雨の日でも楽しめる室内撮影地中心のコースです。SMTOWNとCOEXモールを中心に巡ります。',
    descriptionZh: '下雨天也能享受的室内拍摄地路线。以SMTOWN和COEX商场为中心。',
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
    description: '영화 속 아름다운 야경 장면이 촬영된 곳들을 둘러봅니다. 남산타워와 한강공원의 야경을 즐겨보세요.',
    descriptionEn: 'Visit the beautiful night view locations from the movie. Enjoy the night views of Namsan Tower and Hangang Park.',
    descriptionJa: '映画の美しい夜景シーンが撮影された場所を巡ります。南山タワーと漢江公園の夜景をお楽しみください。',
    descriptionZh: '游览电影中美丽夜景场景的拍摄地。欣赏南山塔和汉江公园的夜景。',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800',
    author: 'official',
    isOfficial: true,
    spotCount: 4,
    duration: '5시간',
    contentId: 1,
  },
  {
    id: 4,
    title: '액션 장면 투어',
    titleEn: 'Action Scene Tour',
    titleJa: 'アクションシーンツアー',
    titleZh: '动作场景游',
    description: '영화의 하이라이트 액션 장면들이 촬영된 곳을 방문합니다. 추격신과 전투씬의 현장을 직접 느껴보세요.',
    descriptionEn: 'Visit the highlight action scene locations from the movie. Experience the chase and battle scenes firsthand.',
    descriptionJa: '映画のハイライトアクションシーンが撮影された場所を訪れます。追跡シーンと戦闘シーンの現場を体験してください。',
    descriptionZh: '参观电影中精彩动作场景的拍摄地。亲身体验追逐和战斗场景。',
    imageUrl: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800',
    author: 'official',
    isOfficial: true,
    spotCount: 4,
    duration: '6시간',
    contentId: 1,
  },
  {
    id: 5,
    title: '역사 명소 투어',
    titleEn: 'Historical Spots Tour',
    titleJa: '歴史名所ツアー',
    titleZh: '历史名胜游',
    description: '영화에 등장하는 역사적인 장소들을 방문합니다. 경복궁과 북촌한옥마을의 전통미를 느껴보세요.',
    descriptionEn: 'Visit historical locations featured in the movie. Feel the traditional beauty of Gyeongbokgung Palace and Bukchon Hanok Village.',
    descriptionJa: '映画に登場する歴史的な場所を訪れます。景福宮と北村韓屋村の伝統美を感じてください。',
    descriptionZh: '参观电影中出现的历史景点。感受景福宫和北村韩屋村的传统美。',
    imageUrl: 'https://images.unsplash.com/photo-1553659971-5de9acde5b56?w=800',
    author: 'official',
    isOfficial: true,
    spotCount: 3,
    duration: '5시간',
    contentId: 1,
  },
];

export default function ContentToursList() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const content = mockContent; // TODO: fetch by id from API
  const tours = mockTours;

  const getContentTitle = () => {
    switch (i18n.language) {
      case 'en': return content.titleEn || content.title;
      case 'ja': return content.titleJa || content.title;
      case 'zh': return content.titleZh || content.title;
      default: return content.title;
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

  const getTourDescription = (tour: Tour) => {
    switch (i18n.language) {
      case 'en': return tour.descriptionEn || tour.description;
      case 'ja': return tour.descriptionJa || tour.description;
      case 'zh': return tour.descriptionZh || tour.description;
      default: return tour.description;
    }
  };

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
              {t('contentDetail.allTours')} ({tours.length})
            </p>
          </div>
        </div>
      </div>

      {/* Tours List */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.id}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Tour Image */}
                <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                  <img
                    src={tour.imageUrl}
                    alt={getTourTitle(tour)}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Tour Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {getTourTitle(tour)}
                      </h3>
                      {tour.isOfficial && (
                        <span className="flex-shrink-0 px-2 py-1 bg-pink-100 text-pink-600 text-xs font-medium rounded-full">
                          Official
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {tour.isOfficial ? t('contentDetail.byOfficial') : `by ${tour.author}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {getTourDescription(tour)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {tour.spotCount} {t('contentDetail.spots')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tour.duration}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

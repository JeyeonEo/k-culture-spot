import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Globe,
  Share2,
  Heart,
  Navigation,
} from 'lucide-react';
import type { Spot } from '../types';
import { openMap } from '../utils/map';

// Mock data
const mockSpot: Spot = {
  id: 1,
  name: '북촌 한옥마을',
  nameEn: 'Bukchon Hanok Village',
  nameJa: '北村韓屋村',
  nameZh: '北村韩屋村',
  description: '북촌한옥마을은 경복궁과 창덕궁, 종묘 사이에 위치한 곳으로 서울 600년 역사와 함께해온 우리의 전통 거주 지역입니다. 도깨비, 사랑의 불시착, 개인의 취향 등 수많은 드라마 촬영지로 유명하며, 전통 한옥의 아름다움을 느낄 수 있는 서울의 대표 관광지입니다.',
  descriptionEn: 'Bukchon Hanok Village is located between Gyeongbokgung Palace, Changdeokgung Palace, and Jongmyo Shrine. It is a traditional residential area that has been with Seoul for 600 years. Famous as a filming location for numerous dramas including Goblin, Crash Landing on You, and Personal Taste.',
  descriptionJa: '北村韓屋村は景福宮と昌徳宮、宗廟の間に位置する場所で、ソウル600年の歴史とともにしてきた韓国の伝統居住地域です。トッケビ、愛の不時着、個人の趣向など数多くのドラマ撮影地として有名です。',
  descriptionZh: '北村韩屋村位于景福宫、昌德宫和宗庙之间，是与首尔600年历史共存的传统居住区。因鬼怪、爱的迫降、个人取向等众多电视剧的拍摄地而闻名。',
  address: '서울특별시 종로구 북촌로 일대',
  addressEn: 'Bukchon-ro area, Jongno-gu, Seoul',
  latitude: 37.5826,
  longitude: 126.9831,
  category: 'drama',
  imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200',
  images: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800',
    'https://images.unsplash.com/photo-1546874177-9e664107314e?w=800',
  ],
  relatedContent: [
    {
      id: 1,
      title: '도깨비',
      titleEn: 'Goblin',
      titleJa: 'トッケビ',
      titleZh: '鬼怪',
      type: 'drama',
      year: 2016,
    },
    {
      id: 2,
      title: '사랑의 불시착',
      titleEn: 'Crash Landing on You',
      titleJa: '愛の不時着',
      titleZh: '爱的迫降',
      type: 'drama',
      year: 2019,
    },
  ],
  phone: '02-2148-4160',
  website: 'https://bukchon.seoul.go.kr',
  hours: '연중무휴 (외부 관람 자유)',
  tags: ['도깨비', '사랑의 불시착', '한옥', '전통'],
  viewCount: 15234,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

export default function SpotDetail() {
  const { id: _id } = useParams();
  const { t, i18n } = useTranslation();
  const spot = mockSpot; // TODO: In real app, fetch by _id from API

  const getName = () => {
    switch (i18n.language) {
      case 'en': return spot.nameEn || spot.name;
      case 'ja': return spot.nameJa || spot.name;
      case 'zh': return spot.nameZh || spot.name;
      default: return spot.name;
    }
  };

  const getDescription = () => {
    switch (i18n.language) {
      case 'en': return spot.descriptionEn || spot.description;
      case 'ja': return spot.descriptionJa || spot.description;
      case 'zh': return spot.descriptionZh || spot.description;
      default: return spot.description;
    }
  };

  const getContentTitle = (content: typeof spot.relatedContent[0]) => {
    switch (i18n.language) {
      case 'en': return content.titleEn || content.title;
      case 'ja': return content.titleJa || content.title;
      case 'zh': return content.titleZh || content.title;
      default: return content.title;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={spot.imageUrl}
          alt={getName()}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back Button */}
        <Link
          to="/spots"
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('common.back')}</span>
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <span className="inline-block px-3 py-1 bg-pink-500 text-sm rounded-full mb-3">
            {t(`category.${spot.category}`)}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">{getName()}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-700 leading-relaxed">{getDescription()}</p>
            </section>

            {/* Image Gallery */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Gallery</h2>
              <div className="grid grid-cols-3 gap-2">
                {spot.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${getName()} ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            </section>

            {/* Related Content */}
            {spot.relatedContent.length > 0 && (
              <section className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">{t('spot.relatedContent')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {spot.relatedContent.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {content.type === 'drama' ? 'D' : content.type === 'movie' ? 'M' : 'V'}
                      </div>
                      <div>
                        <p className="font-medium">{getContentTitle(content)}</p>
                        <p className="text-sm text-gray-500">{content.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">{t('spot.address')}</p>
                  <p className="text-gray-900">
                    {i18n.language === 'en' ? spot.addressEn : spot.address}
                  </p>
                </div>
              </div>

              {spot.hours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t('spot.hours')}</p>
                    <p className="text-gray-900">{spot.hours}</p>
                  </div>
                </div>
              )}

              {spot.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t('spot.phone')}</p>
                    <p className="text-gray-900">{spot.phone}</p>
                  </div>
                </div>
              )}

              {spot.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t('spot.website')}</p>
                    <a
                      href={spot.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:underline"
                    >
                      {t('common.viewDetail')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Map / Directions Button */}
            <button
              onClick={() => openMap(spot.latitude, spot.longitude, getName())}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              <Navigation className="w-5 h-5" />
              {t('spot.openMap')}
            </button>

            {/* Tags */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {spot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

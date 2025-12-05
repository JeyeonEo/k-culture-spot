import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Navigation, Car } from 'lucide-react';
import type { Route } from '../types';
import { openMap } from '../utils/map';

// Mock data for now - this will come from API later
const mockRoute: Route = {
  id: '1',
  title: '청량감 충만 계곡 나들이 남양주',
  titleEn: 'Refreshing Valley Trip in Namyangju',
  titleJa: '清涼感いっぱいの渓谷お出かけ南楊州',
  titleZh: '清凉充满溪谷南阳州',
  description: '멀리 갈 필요 없어~',
  descriptionEn: 'No need to go far~',
  descriptionJa: '遠くに行く必要はありません〜',
  descriptionZh: '无需远行~',
  totalDuration: '차량 이동 59분',
  totalDistance: '887.1m',
  imageUrl: '',
  tags: [],
  createdAt: '',
  updatedAt: '',
  stops: [
    {
      id: '1',
      order: 1,
      duration: '21분',
      distance: '14.2km',
      spot: {
        id: 1,
        name: '베이커리 씨어터',
        nameEn: 'Bakery Theater',
        nameJa: 'ベーカリーシアター',
        nameZh: '面包剧场',
        description: '햇살 만끽 북한강 뷰 맛집',
        descriptionEn: 'Sunlight and Bukhangang River View Restaurant',
        descriptionJa: '日光満喫北漢江ビュー美味しい店',
        descriptionZh: '阳光充足的北汉江景餐厅',
        address: '경기도 남양주시',
        addressEn: 'Namyangju-si, Gyeonggi-do',
        latitude: 37.6369,
        longitude: 127.2865,
        category: 'variety',
        imageUrl: '/images/bakery-theater.jpg',
        images: [],
        relatedContent: [],
        tags: [],
        viewCount: 0,
        hours: '평일 10:00 - 23:00',
        createdAt: '',
        updatedAt: '',
      },
    },
    {
      id: '2',
      order: 2,
      duration: '38분',
      distance: '27.8km',
      spot: {
        id: 2,
        name: '요적사계곡',
        nameEn: 'Yojeoksa Valley',
        nameJa: '要積寺渓谷',
        nameZh: '要积寺溪谷',
        description: '시원한 계곡물에 발 담그러',
        descriptionEn: 'Cool valley water for your feet',
        descriptionJa: '涼しい渓谷の水に足を浸す',
        descriptionZh: '在凉爽的溪谷水中泡脚',
        address: '경기도 남양주시',
        addressEn: 'Namyangju-si, Gyeonggi-do',
        latitude: 37.7369,
        longitude: 127.3865,
        category: 'variety',
        imageUrl: '/images/yojeoksa-valley.jpg',
        images: [],
        relatedContent: [],
        tags: [],
        viewCount: 0,
        hours: '입장료 무료',
        createdAt: '',
        updatedAt: '',
      },
    },
  ],
};

export default function RouteDetail() {
  const { t, i18n } = useTranslation();
  const route = mockRoute;

  const getLocalizedTitle = (stop: typeof route.stops[0]) => {
    switch (i18n.language) {
      case 'en':
        return stop.spot.nameEn;
      case 'ja':
        return stop.spot.nameJa;
      case 'zh':
        return stop.spot.nameZh;
      default:
        return stop.spot.name;
    }
  };

  const getLocalizedDescription = (stop: typeof route.stops[0]) => {
    switch (i18n.language) {
      case 'en':
        return stop.spot.descriptionEn;
      case 'ja':
        return stop.spot.descriptionJa;
      case 'zh':
        return stop.spot.descriptionZh;
      default:
        return stop.spot.description;
    }
  };

  const handleOpenMap = (stop: typeof route.stops[0]) => {
    openMap(stop.spot.latitude, stop.spot.longitude, stop.spot.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start gap-3">
            <Navigation className="w-8 h-8 text-pink-500 mt-1" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {route.title}
              </h1>
              <p className="text-sm text-gray-600">{route.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{route.totalDuration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Map Preview */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-pink-500 opacity-50" />
            </div>
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              {route.totalDistance}
            </div>
          </div>
        </div>
      </div>

      {/* Route Stops */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="space-y-4">
          {route.stops.map((stop, index) => (
            <div
              key={stop.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Stop Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-200">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{getLocalizedTitle(stop)}</h3>
                </div>
              </div>

              {/* Stop Content */}
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  {stop.spot.imageUrl && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={stop.spot.imageUrl}
                        alt={getLocalizedTitle(stop)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x128?text=No+Image';
                        }}
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-600">{getLocalizedDescription(stop)}</p>
                    {stop.spot.hours && (
                      <p className="text-sm text-gray-500">{stop.spot.hours}</p>
                    )}
                  </div>
                </div>

                {/* Map Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenMap(stop)}
                    className="w-full px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>{t('spot.openMap')}</span>
                  </button>
                </div>
              </div>

              {/* Distance to Next Stop */}
              {index < route.stops.length - 1 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="w-4 h-4" />
                    <span>{stop.duration} 소요</span>
                    <span className="text-gray-400">·</span>
                    <span>{stop.distance}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

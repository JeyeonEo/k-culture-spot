import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Clock,
  Car,
  MapPin,
  Navigation,
  Coffee,
  TreePine,
  Camera,
  Utensils,
  Building,
} from 'lucide-react';
import type { Tour, TourSpot, Spot } from '../types';

// Mock spot data for tour
const mockSpots: Spot[] = [
  {
    id: 1,
    name: '베이커리 씨어터',
    nameEn: 'Bakery Theater',
    nameJa: 'ベーカリーシアター',
    nameZh: '面包剧场',
    description: '햇살 만끽 북한강 뷰 맛집',
    descriptionEn: 'A bakery with beautiful Bukhangang River view',
    descriptionJa: '北漢江のビューが美しいベーカリー',
    descriptionZh: '享受阳光的北汉江景观餐厅',
    address: '경기도 남양주시 조안면 북한강로 856',
    addressEn: '856 Bukhangang-ro, Joan-myeon, Namyangju-si, Gyeonggi-do',
    latitude: 37.5935,
    longitude: 127.3152,
    category: 'drama',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    images: [],
    relatedContent: [],
    tags: ['카페', '베이커리', '북한강'],
    hours: '평일 10:00 - 23:00',
    viewCount: 1500,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    name: '묘적사계곡',
    nameEn: 'Myojeoksa Valley',
    nameJa: '妙寂寺渓谷',
    nameZh: '妙寂寺溪谷',
    description: '시원한 계곡물에 발 담그러♪',
    descriptionEn: 'Dip your feet in the cool valley water',
    descriptionJa: '涼しい渓谷の水に足を浸して',
    descriptionZh: '在清凉的溪谷水中泡脚',
    address: '경기도 남양주시 수동면 지둔리',
    addressEn: 'Jidun-ri, Sudong-myeon, Namyangju-si, Gyeonggi-do',
    latitude: 37.6289,
    longitude: 127.2198,
    category: 'variety',
    imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400',
    images: [],
    relatedContent: [],
    tags: ['계곡', '자연', '힐링'],
    hours: '입장료 무료',
    viewCount: 2300,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 3,
    name: '축령산 자연휴양림',
    nameEn: 'Chungnyeongsan Natural Forest',
    nameJa: '祝霊山自然休養林',
    nameZh: '祝灵山自然休养林',
    description: '잣나무 숲에서 산림욕 즐기기',
    descriptionEn: 'Enjoy forest bathing in the pine nut forest',
    descriptionJa: '松の森で森林浴を楽しむ',
    descriptionZh: '在松子林中享受森林浴',
    address: '경기도 남양주시 수동면 외방리 산123',
    addressEn: 'San 123, Oebang-ri, Sudong-myeon, Namyangju-si',
    latitude: 37.6453,
    longitude: 127.2012,
    category: 'variety',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400',
    images: [],
    relatedContent: [],
    tags: ['산림욕', '휴양림', '잣나무'],
    hours: '09:00 - 18:00',
    viewCount: 1800,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

// Mock tour data with connected spots
const mockTour: Tour = {
  id: 1,
  title: '청량감 충만 계곡 나들이 남양주',
  titleEn: 'Refreshing Valley Day Trip in Namyangju',
  titleJa: '爽やかな渓谷お出かけ 南楊州',
  titleZh: '清凉满溢的溪谷郊游南杨州',
  subtitle: '멀리 갈 필요 없어~',
  subtitleEn: 'No need to go far~',
  subtitleJa: '遠くに行く必要なし~',
  subtitleZh: '不用走远~',
  description: '서울 근교 남양주에서 즐기는 시원한 여름 나들이 코스입니다.',
  descriptionEn: 'A refreshing summer day trip course in Namyangju near Seoul.',
  descriptionJa: 'ソウル近郊の南楊州で楽しむ爽やかな夏のお出かけコースです。',
  descriptionZh: '在首尔近郊南杨州享受清凉夏日郊游路线。',
  imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
  author: 'official',
  isOfficial: true,
  spotCount: 3,
  duration: '차량 이동 59분',
  totalDistance: '약 25km',
  contentId: 1,
  spots: [
    {
      order: 1,
      spot: mockSpots[0],
      description: '햇살 만끽 북한강 뷰 맛집',
      descriptionEn: 'A bakery with beautiful Bukhangang River view',
      descriptionJa: '北漢江のビューが美しいベーカリー',
      descriptionZh: '享受阳光的北汉江景观餐厅',
      travelTimeToNext: '21분',
      travelDistanceToNext: '14.2km',
    },
    {
      order: 2,
      spot: mockSpots[1],
      description: '시원한 계곡물에 발 담그러♪',
      descriptionEn: 'Dip your feet in the cool valley water',
      descriptionJa: '涼しい渓谷の水に足を浸して',
      descriptionZh: '在清凉的溪谷水中泡脚',
      travelTimeToNext: '15분',
      travelDistanceToNext: '8.5km',
    },
    {
      order: 3,
      spot: mockSpots[2],
      description: '잣나무 숲에서 산림욕 즐기기',
      descriptionEn: 'Enjoy forest bathing in the pine nut forest',
      descriptionJa: '松の森で森林浴を楽しむ',
      descriptionZh: '在松子林中享受森林浴',
    },
  ],
};

// Get icon for spot category
const getSpotIcon = (category: string, index: number) => {
  const icons = [Coffee, TreePine, Camera, Utensils, Building];
  const IconComponent = icons[index % icons.length];
  return <IconComponent className="w-4 h-4" />;
};

export default function TourDetail() {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const tour = mockTour; // TODO: fetch from API using _id

  const getTourTitle = () => {
    switch (i18n.language) {
      case 'en': return tour.titleEn || tour.title;
      case 'ja': return tour.titleJa || tour.title;
      case 'zh': return tour.titleZh || tour.title;
      default: return tour.title;
    }
  };

  const getTourSubtitle = () => {
    switch (i18n.language) {
      case 'en': return tour.subtitleEn || tour.subtitle;
      case 'ja': return tour.subtitleJa || tour.subtitle;
      case 'zh': return tour.subtitleZh || tour.subtitle;
      default: return tour.subtitle;
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

  const getTourSpotDescription = (tourSpot: TourSpot) => {
    switch (i18n.language) {
      case 'en': return tourSpot.descriptionEn || tourSpot.description;
      case 'ja': return tourSpot.descriptionJa || tourSpot.description;
      case 'zh': return tourSpot.descriptionZh || tourSpot.description;
      default: return tourSpot.description;
    }
  };

  const openNaverMapsRoute = () => {
    if (!tour.spots || tour.spots.length === 0) return;

    const spots = tour.spots;
    const start = spots[0].spot;
    const end = spots[spots.length - 1].spot;

    // Naver Maps route URL
    const url = `https://map.naver.com/v5/directions/${start.longitude},${start.latitude},${encodeURIComponent(start.name)}/${end.longitude},${end.latitude},${encodeURIComponent(end.name)}/-/car`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 mx-4">
            <h1 className="font-bold text-lg truncate">{getTourTitle()}</h1>
          </div>

          <button
            onClick={openNaverMapsRoute}
            className="p-2 -mr-2 text-green-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t('tour.openNavigation')}
          >
            <Navigation className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Tour Header Info */}
      <section className="bg-white px-4 py-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">{getTourTitle()}</h2>
        {getTourSubtitle() && (
          <p className="text-gray-500 mt-1">{getTourSubtitle()}</p>
        )}
        <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>{tour.duration}</span>
        </div>
      </section>

      {/* Map Placeholder with Route */}
      <section className="relative">
        <div className="h-64 bg-gray-200 relative overflow-hidden">
          {/* Static map image as placeholder */}
          <img
            src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800"
            alt="Map"
            className="w-full h-full object-cover opacity-60"
          />

          {/* Map overlay with markers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Route line (SVG) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                <path
                  d="M 320 80 Q 280 100 200 100 Q 150 100 100 60"
                  fill="none"
                  stroke="#9333EA"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  strokeLinecap="round"
                />
              </svg>

              {/* Markers */}
              {tour.spots?.map((tourSpot, index) => {
                const positions = [
                  { left: '75%', top: '35%' },
                  { left: '45%', top: '50%' },
                  { left: '20%', top: '25%' },
                ];
                const pos = positions[index] || positions[0];

                return (
                  <div
                    key={tourSpot.order}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: pos.left, top: pos.top }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                      index === 0 ? 'bg-purple-600' : index === tour.spots!.length - 1 ? 'bg-pink-500' : 'bg-purple-500'
                    }`}>
                      {tourSpot.order}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Naver logo placeholder */}
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold text-green-600">
            NAVER
          </div>

          {/* Expand map button */}
          <button
            onClick={openNaverMapsRoute}
            className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
          >
            <MapPin className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </section>

      {/* Spots List */}
      <section className="px-4 py-4">
        <div className="space-y-0">
          {tour.spots?.map((tourSpot, index) => (
            <div key={tourSpot.order}>
              {/* Spot Card */}
              <Link
                to={`/spots/${tourSpot.spot.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex p-4">
                  {/* Left side - Info */}
                  <div className="flex-1 pr-4">
                    {/* Spot number and name */}
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                        index === 0 ? 'bg-purple-600' : index === tour.spots!.length - 1 ? 'bg-pink-500' : 'bg-purple-500'
                      }`}>
                        {tourSpot.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">
                            {getSpotName(tourSpot.spot)}
                          </h3>
                          <span className="text-pink-400">
                            {getSpotIcon(tourSpot.spot.category, index)}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mt-1">
                          {getTourSpotDescription(tourSpot)}
                        </p>

                        {/* Hours or additional info */}
                        {tourSpot.spot.hours && (
                          <p className="text-sm text-gray-400 mt-1">
                            {tourSpot.spot.hours}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side - Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={tourSpot.spot.imageUrl}
                      alt={getSpotName(tourSpot.spot)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Link>

              {/* Travel info to next spot */}
              {tourSpot.travelTimeToNext && index < tour.spots!.length - 1 && (
                <div className="flex items-center gap-2 py-3 px-4 ml-3">
                  <div className="w-0.5 h-8 bg-gray-200 ml-3" />
                  <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">
                    <Car className="w-4 h-4" />
                    <span>
                      {tourSpot.travelTimeToNext} {t('tour.duration')} {tourSpot.travelDistanceToNext}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Start Navigation Button */}
      <section className="px-4 pb-4">
        <button
          onClick={openNaverMapsRoute}
          className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation className="w-5 h-5" />
          {t('tour.startNavigation')}
        </button>
      </section>
    </div>
  );
}

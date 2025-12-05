import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Pin,
  Copy,
  Check,
  Clock,
  Phone,
  Globe,
} from 'lucide-react';
import type { Spot, SpotTip } from '../types';
import ImageModal from '../components/ImageModal';

// Mock data with tips
const mockSpot: Spot = {
  id: 1,
  name: '남산타워',
  nameEn: 'Namsan Tower',
  nameJa: 'Nソウルタワー',
  nameZh: '南山塔',
  description: '남산타워(N서울타워)는 서울의 대표적인 랜드마크로, 수많은 드라마와 영화의 촬영지로 사랑받고 있습니다. 특히 드라마 "별에서 온 그대"에서 도민준과 천송이가 데이트를 즐긴 장소로 유명합니다. 서울 시내를 360도로 조망할 수 있으며, 사랑의 자물쇠가 있는 곳으로도 유명합니다.',
  descriptionEn: 'Namsan Tower (N Seoul Tower) is a representative landmark of Seoul, beloved as a filming location for numerous dramas and movies. It is particularly famous as the place where Do Min-joon and Cheon Song-yi had their date in the drama "My Love from the Star". You can enjoy a 360-degree view of Seoul, and it is also famous for its love locks.',
  descriptionJa: 'Nソウルタワーはソウルの代表的なランドマークで、数多くのドラマや映画の撮影地として愛されています。特にドラマ「星から来たあなた」でド・ミンジュンとチョン・ソンイがデートを楽しんだ場所として有名です。ソウル市内を360度見渡すことができ、愛の南京錠でも有名です。',
  descriptionZh: '南山塔是首尔的代表性地标，作为众多电视剧和电影的拍摄地而深受喜爱。尤其是电视剧《来自星星的你》中都敏俊和千颂伊约会的地方而闻名。可以360度俯瞰首尔市区，也因爱情锁而闻名。',
  address: '서울특별시 용산구 남산공원길 105',
  addressEn: '105 Namsangongwon-gil, Yongsan-gu, Seoul',
  latitude: 37.5512,
  longitude: 126.9882,
  category: 'drama',
  imageUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
  mediaImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
  images: [
    'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600',
    'https://images.unsplash.com/photo-1546874177-9e664107314e?w=600',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600',
  ],
  relatedContent: [
    {
      id: 1,
      title: '별에서 온 그대',
      titleEn: 'My Love from the Star',
      titleJa: '星から来たあなた',
      titleZh: '来自星星的你',
      type: 'drama',
      year: 2013,
    },
  ],
  phone: '02-3455-9277',
  website: 'https://www.seoultower.co.kr',
  hours: '10:00 - 23:00 (주말 10:00 - 24:00)',
  tags: ['별에서 온 그대', '남산', '전망대', '데이트'],
  tips: [
    {
      id: 1,
      content: '야경을 보려면 일몰 30분 전에 가는 걸 추천해요! 해질녘부터 야경까지 다 볼 수 있어요 ✨',
      author: '서울러버',
      createdAt: '2024-03-15',
    },
    {
      id: 2,
      content: '케이블카 타고 올라가면 줄이 길어요. 버스 타고 올라가서 내려올 때 케이블카 타는 게 좋아요!',
      author: '여행고수',
      createdAt: '2024-03-10',
    },
    {
      id: 3,
      content: '사랑의 자물쇠 달려면 자물쇠 미리 사가세요! 현장에서 사면 비싸요 💸',
      author: '알뜰족',
      createdAt: '2024-02-28',
    },
  ],
  viewCount: 25000,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

export default function SpotDetail() {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const spot = mockSpot; // TODO: fetch from API using _id

  const [isPinned, setIsPinned] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check if spot is pinned in localStorage
  useEffect(() => {
    const pinnedSpots = JSON.parse(localStorage.getItem('pinnedSpots') || '[]');
    setIsPinned(pinnedSpots.includes(spot.id));
  }, [spot.id]);

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

  const getAddress = () => {
    if (i18n.language === 'en') {
      return spot.addressEn || spot.address;
    }
    return spot.address;
  };

  const handlePin = () => {
    const pinnedSpots = JSON.parse(localStorage.getItem('pinnedSpots') || '[]');
    if (isPinned) {
      const newPinned = pinnedSpots.filter((id: number) => id !== spot.id);
      localStorage.setItem('pinnedSpots', JSON.stringify(newPinned));
    } else {
      pinnedSpots.push(spot.id);
      localStorage.setItem('pinnedSpots', JSON.stringify(pinnedSpots));
    }
    setIsPinned(!isPinned);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(getAddress());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`;
    window.open(url, '_blank');
  };

  const openNaverMaps = () => {
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(spot.address)}`;
    window.open(url, '_blank');
  };

  const handleImageClick = (index: number, isMediaImage: boolean = false) => {
    const allImages = spot.mediaImage
      ? [spot.mediaImage, ...spot.images]
      : spot.images;
    setCurrentImageIndex(isMediaImage ? 0 : (spot.mediaImage ? index + 1 : index));
    setModalOpen(true);
  };

  const allImages = spot.mediaImage
    ? [spot.mediaImage, ...spot.images]
    : spot.images;

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

          <h1 className="font-bold text-lg truncate mx-4">{getName()}</h1>

          <button
            onClick={handlePin}
            className={`p-2 -mr-2 rounded-full transition-colors ${
              isPinned ? 'text-pink-500' : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={isPinned ? t('spot.unpin') : t('spot.pin')}
          >
            <Pin className={`w-6 h-6 ${isPinned ? 'fill-current' : ''}`} />
          </button>
        </div>
      </header>

      {/* Photo Collage */}
      <section className="p-4">
        <div className="flex gap-2 h-64 md:h-80">
          {/* Main media image (left) */}
          <div
            className="flex-1 cursor-pointer overflow-hidden rounded-l-xl"
            onClick={() => handleImageClick(0, true)}
          >
            <img
              src={spot.mediaImage || spot.imageUrl}
              alt={`${getName()} - ${t('spot.mediaScene')}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Location images grid (right) */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
            {spot.images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className={`cursor-pointer overflow-hidden ${
                  idx === 1 ? 'rounded-tr-xl' : idx === 3 ? 'rounded-br-xl' : ''
                }`}
                onClick={() => handleImageClick(idx)}
              >
                <img
                  src={img}
                  alt={`${getName()} ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section className="mx-4 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-gray-500 text-sm shrink-0">{t('spot.address')}:</span>
            <button
              onClick={handleCopyAddress}
              className="flex items-center gap-1 text-gray-900 truncate hover:text-pink-500 transition-colors"
            >
              <span className="truncate">{getAddress()}</span>
              {copied ? (
                <Check className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 shrink-0" />
              )}
            </button>
          </div>

          <div className="flex gap-2 ml-3">
            <button
              onClick={openGoogleMaps}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors"
              aria-label="Open in Google Maps"
            >
              G
            </button>
            <button
              onClick={openNaverMaps}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors"
              aria-label="Open in Naver Maps"
            >
              N
            </button>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-bold text-lg mb-3">{t('spot.description')}</h2>
        <p className="text-gray-700 leading-relaxed">{getDescription()}</p>
      </section>

      {/* Information Section */}
      <section className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-bold text-lg mb-3">{t('spot.information')}</h2>
        <div className="space-y-3">
          {spot.hours && (
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-pink-500" />
              <div>
                <p className="text-sm text-gray-500">{t('spot.hours')}</p>
                <p className="text-gray-900">{spot.hours}</p>
              </div>
            </div>
          )}
          {spot.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-pink-500" />
              <div>
                <p className="text-sm text-gray-500">{t('spot.phone')}</p>
                <a href={`tel:${spot.phone}`} className="text-gray-900 hover:text-pink-500">
                  {spot.phone}
                </a>
              </div>
            </div>
          )}
          {spot.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-pink-500" />
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
      </section>

      {/* Tips Section - iPhone Message Style */}
      {spot.tips && spot.tips.length > 0 && (
        <section className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-4">{t('spot.tips')}</h2>
          <div className="space-y-3">
            {spot.tips.map((tip: SpotTip) => (
              <div key={tip.id} className="flex flex-col items-start">
                <div className="max-w-[85%] bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-gray-900">{tip.content}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1 ml-2">
                  {tip.author}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Image Modal */}
      <ImageModal
        images={allImages}
        currentIndex={currentImageIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={setCurrentImageIndex}
        alt={getName()}
      />
    </div>
  );
}

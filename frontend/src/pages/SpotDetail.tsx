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
import { spotApi } from '../api/client';

export default function SpotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch spot data from API
  useEffect(() => {
    const fetchSpot = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const data = await spotApi.getSpotById(parseInt(id));
        setSpot(data);
      } catch (err) {
        console.error('Failed to fetch spot:', err);
        setError('장소 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
  }, [id]);

  // Check if spot is pinned in localStorage
  useEffect(() => {
    if (!spot) return;
    const pinnedSpots = JSON.parse(localStorage.getItem('pinnedSpots') || '[]');
    setIsPinned(pinnedSpots.includes(spot.id));
  }, [spot]);

  const getName = () => {
    if (!spot) return '';
    switch (i18n.language) {
      case 'en': return spot.nameEn || spot.name;
      case 'ja': return spot.nameJa || spot.name;
      case 'zh': return spot.nameZh || spot.name;
      default: return spot.name;
    }
  };

  const getDescription = () => {
    if (!spot) return '';
    switch (i18n.language) {
      case 'en': return spot.descriptionEn || spot.description;
      case 'ja': return spot.descriptionJa || spot.description;
      case 'zh': return spot.descriptionZh || spot.description;
      default: return spot.description;
    }
  };

  const getAddress = () => {
    if (!spot) return '';
    if (i18n.language === 'en') {
      return spot.addressEn || spot.address;
    }
    return spot.address;
  };

  const handlePin = () => {
    if (!spot) return;
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
    if (!spot) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`;
    window.open(url, '_blank');
  };

  const openNaverMaps = () => {
    if (!spot) return;
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(spot.address)}`;
    window.open(url, '_blank');
  };

  const handleImageClick = (index: number, isMediaImage: boolean = false) => {
    if (!spot) return;
    setCurrentImageIndex(isMediaImage ? 0 : (spot.mediaImage ? index + 1 : index));
    setModalOpen(true);
  };

  const allImages = spot && spot.mediaImage
    ? [spot.mediaImage, ...spot.images]
    : spot?.images || [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-500">{i18n.language === 'ko' ? '로딩 중...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !spot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || '장소를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

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

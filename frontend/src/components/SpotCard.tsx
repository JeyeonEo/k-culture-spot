import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Eye } from 'lucide-react';
import type { Spot } from '../types';

interface SpotCardProps {
  spot: Spot;
}

const categoryColors: Record<string, string> = {
  drama: 'bg-pink-500',
  kpop: 'bg-purple-500',
  movie: 'bg-blue-500',
  variety: 'bg-orange-500',
};

export default function SpotCard({ spot }: SpotCardProps) {
  const { t, i18n } = useTranslation();

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

  return (
    <Link
      to={`/spots/${spot.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={spot.imageUrl || '/placeholder.jpg'}
          alt={getName()}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 px-3 py-1 text-white text-xs font-medium rounded-full ${categoryColors[spot.category] || 'bg-gray-500'}`}>
          {t(`category.${spot.category}`)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-500 transition-colors line-clamp-1">
          {getName()}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">
          {getDescription()}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{i18n.language === 'en' ? spot.addressEn : spot.address}</span>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {spot.viewCount.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

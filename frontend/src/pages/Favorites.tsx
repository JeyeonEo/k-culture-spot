import { useTranslation } from 'react-i18next';
import { Heart, MapPin, Calendar, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { t } = useTranslation();

  const mockFavorites = [
    {
      id: 1,
      name: '북촌 한옥마을',
      nameEn: 'Bukchon Hanok Village',
      category: 'drama',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      address: '서울특별시 종로구',
      savedDate: '2024-12-01',
    },
    {
      id: 2,
      name: 'SM타운 코엑스아티움',
      nameEn: 'SMTOWN COEX Artium',
      category: 'kpop',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      address: '서울특별시 강남구',
      savedDate: '2024-11-28',
    },
    {
      id: 3,
      name: '부산 해운대 해수욕장',
      nameEn: 'Haeundae Beach',
      category: 'movie',
      imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=400',
      address: '부산광역시 해운대구',
      savedDate: '2024-11-25',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'drama':
        return 'from-pink-400 to-rose-400';
      case 'kpop':
        return 'from-purple-400 to-violet-400';
      case 'movie':
        return 'from-blue-400 to-cyan-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'drama':
        return 'K-Drama';
      case 'kpop':
        return 'K-Pop';
      case 'movie':
        return 'K-Movie';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {t('favorites.title')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('favorites.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {mockFavorites.length > 0 ? (
          <div className="space-y-4">
            {mockFavorites.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <Link
                    to={`/spots/${spot.id}`}
                    className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 group"
                  >
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(spot.category)}`}>
                      {getCategoryLabel(spot.category)}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/spots/${spot.id}`}>
                      <h3 className="font-bold text-gray-800 mb-1 hover:text-pink-600 transition-colors">
                        {spot.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{spot.nameEn}</p>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{spot.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{t('favorites.saved')} {spot.savedDate}</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button className="p-2 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {t('favorites.empty')}
            </h3>
            <p className="text-gray-500 mb-6">
              {t('favorites.emptyDesc')}
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              {t('favorites.explore')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

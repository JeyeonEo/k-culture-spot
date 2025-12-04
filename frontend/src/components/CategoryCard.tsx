import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tv, Music, Film, Sparkles } from 'lucide-react';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const categoryConfig: Record<Category, { icon: typeof Tv; gradient: string; image: string }> = {
  drama: {
    icon: Tv,
    gradient: 'from-pink-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  },
  kpop: {
    icon: Music,
    gradient: 'from-purple-500 to-violet-500',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  },
  movie: {
    icon: Film,
    gradient: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
  },
  variety: {
    icon: Sparkles,
    gradient: 'from-orange-500 to-amber-500',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400',
  },
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useTranslation();
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Link
      to={`/category/${category}`}
      className="group relative h-48 rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Background Image */}
      <img
        src={config.image}
        alt={t(`category.${category}`)}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-70 group-hover:opacity-80 transition-opacity`} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <Icon className="w-12 h-12 mb-2 drop-shadow-lg" />
        <h3 className="text-xl font-bold drop-shadow-lg">{t(`category.${category}`)}</h3>
      </div>
    </Link>
  );
}

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Content } from '../types';

interface ContentCarouselProps {
  contents: Content[];
  title?: string;
}

const contentTypeColors: Record<string, string> = {
  drama: 'bg-pink-500',
  movie: 'bg-blue-500',
  music: 'bg-purple-500',
  variety: 'bg-orange-500',
};

const contentTypeLabels: Record<string, string> = {
  drama: 'Drama',
  movie: 'Movie',
  music: 'K-POP',
  variety: 'Variety',
};

export default function ContentCarousel({ contents, title }: ContentCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  if (contents.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-2xl font-bold mb-6 px-4">{title}</h2>
        )}

        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {contents.map((content) => (
              <Link
                key={content.id}
                to={`/content/${content.id}/spots`}
                className="flex-shrink-0 group/item"
              >
                <div className="w-40 sm:w-48 transition-transform duration-200 hover:scale-105">
                  {/* Poster Image */}
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2">
                    {content.imageUrl ? (
                      <img
                        src={content.imageUrl}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {content.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Type Badge */}
                    <div
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium text-white ${
                        contentTypeColors[content.type] || 'bg-gray-500'
                      }`}
                    >
                      {contentTypeLabels[content.type] || content.type}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-white text-sm font-medium px-4 py-2 bg-pink-500 rounded-full">
                        View Spots
                      </span>
                    </div>
                  </div>

                  {/* Content Title */}
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover/item:text-pink-500 transition-colors">
                    {content.title}
                  </h3>
                  {content.year && (
                    <p className="text-xs text-gray-500 mt-0.5">{content.year}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

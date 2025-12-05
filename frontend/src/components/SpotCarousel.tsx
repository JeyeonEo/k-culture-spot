import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Spot } from '../types';

interface SpotCarouselProps {
  spots: Spot[];
  autoPlayInterval?: number;
}

export default function SpotCarousel({ spots, autoPlayInterval = 4000 }: SpotCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || spots.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % spots.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, spots.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + spots.length) % spots.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % spots.length);
    setIsAutoPlaying(false);
  };

  if (spots.length === 0) return null;

  const currentSpot = spots[currentIndex];

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden group">
      {/* Main Image */}
      <div className="absolute inset-0">
        <img
          src={currentSpot.imageUrl}
          alt={currentSpot.name}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Category Badge */}
          <div className="inline-block mb-3">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/30">
              {currentSpot.category.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
            {currentSpot.name}
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl line-clamp-2 drop-shadow">
            {currentSpot.description}
          </p>

          {/* View Button */}
          <Link
            to={`/spots/${currentSpot.id}`}
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            자세히 보기
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        {spots.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            } h-2 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

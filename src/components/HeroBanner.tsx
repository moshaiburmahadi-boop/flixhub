import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Star, ChevronRight, ChevronLeft, Sparkles, ExternalLink } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movies, onSelectMovie }) => {
  const featuredMovies =
    movies.filter((m) => m.featured).length > 0
      ? movies.filter((m) => m.featured)
      : movies.slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch tracking for mobile swipe gestures
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextFeatured = () => {
    if (featuredMovies.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevFeatured = () => {
    if (featuredMovies.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  // Auto-slide every 3 seconds (resets timer when user manually swipes or changes index)
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featuredMovies.length, currentIndex]);

  if (featuredMovies.length === 0) return null;

  const current = featuredMovies[currentIndex % featuredMovies.length];
  const bannerImage = current.backdropUrl || current.posterUrl;

  // Touch handlers for finger swiping on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // 45px threshold for deliberate swipe

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped Left -> Go to next slide
        nextFeatured();
      } else {
        // Swiped Right -> Go to previous slide
        prevFeatured();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[65vh] sm:h-[80vh] min-h-[480px] max-h-[750px] overflow-hidden bg-black select-none touch-pan-y"
    >
      {/* Background Image with Cinematic Gradients */}
      <div className="absolute inset-0">
        <img
          key={current.id || currentIndex}
          src={bannerImage}
          alt={current.title}
          className="w-full h-full object-cover object-center filter brightness-[0.72] transition-all duration-700 scale-105"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17]/95 via-[#0b0f17]/50 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Badge Tagline */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow shadow-blue-950/60">
              <Sparkles className="w-3.5 h-3.5" />
              Vault Spotlight
            </span>
            <span className="px-2.5 py-1 rounded bg-black/60 text-slate-300 text-xs font-semibold backdrop-blur-md border border-slate-700">
              {current.category}
            </span>
            {current.subCategory && (
              <span className="px-2.5 py-1 rounded bg-slate-900/80 text-slate-400 text-xs font-medium border border-slate-800">
                {current.subCategory}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-xl">
            {current.title}
          </h1>

          {/* Metadata & Dual Ratings */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1 font-bold text-white bg-black/60 px-2 py-0.5 rounded border border-slate-700">
              <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
              My Rating: {current.personalRating}/10
            </span>
            <span className="font-semibold text-[#F5C518] bg-black/60 px-2 py-0.5 rounded border border-slate-700">
              IMDb {current.imdbRating}
            </span>
            <span className="font-medium text-slate-300">{current.releaseYear}</span>
            <span>•</span>
            <span className="font-medium text-slate-300">
              {current.contentType === 'series'
                ? current.episodeName || current.episodeInfo || 'Series'
                : current.duration}
            </span>
          </div>

          {/* Synopsis / Review Teaser */}
          <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow-md">
            {current.personalReview || current.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Watch Now Button (Electric Blue) */}
            <a
              href={current.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base transition active:scale-95 shadow-xl shadow-blue-950/60"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* More Info / Review Button */}
            <button
              onClick={() => onSelectMovie(current)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold text-sm sm:text-base transition backdrop-blur-md border border-slate-700/80 active:scale-95"
            >
              <Info className="w-4 h-4 text-slate-300" />
              <span>Personal Review</span>
            </button>
          </div>
        </div>

        {/* Carousel Arrow Switchers - STRICTLY HIDDEN ON MOBILE, visible only on sm: screens and larger */}
        {featuredMovies.length > 1 && (
          <div className="hidden sm:flex absolute right-4 sm:right-8 bottom-16 sm:bottom-20 items-center gap-2 z-20">
            <button
              onClick={prevFeatured}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-blue-600 transition border border-slate-700/60"
              title="Previous Spotlight"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-400 px-1">
              {currentIndex + 1} / {featuredMovies.length}
            </span>
            <button
              onClick={nextFeatured}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-blue-600 transition border border-slate-700/60"
              title="Next Spotlight"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Subtle Slide Indicator Dots for Mobile (Arrows are completely hidden on mobile) */}
        {featuredMovies.length > 1 && (
          <div className="sm:hidden absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
            {featuredMovies.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex % featuredMovies.length
                    ? 'w-5 bg-blue-500'
                    : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

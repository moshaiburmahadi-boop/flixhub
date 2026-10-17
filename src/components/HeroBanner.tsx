import React, { useState } from 'react';
import { Play, Info, Star, ChevronRight, ChevronLeft, Sparkles, ExternalLink } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movies, onSelectMovie }) => {
  const featuredMovies = movies.filter((m) => m.featured).length > 0
    ? movies.filter((m) => m.featured)
    : movies.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (featuredMovies.length === 0) return null;

  const current = featuredMovies[currentIndex % featuredMovies.length];
  const bannerImage = current.backdropUrl || current.posterUrl;

  const nextFeatured = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevFeatured = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  return (
    <div className="relative w-full h-[65vh] sm:h-[80vh] min-h-[480px] max-h-[750px] overflow-hidden bg-black select-none">
      {/* Background Image with Netflix Gradients */}
      <div className="absolute inset-0">
        <img
          src={bannerImage}
          alt={current.title}
          className="w-full h-full object-cover object-center filter brightness-[0.72] transition-all duration-700 scale-105"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Badge Tagline */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider shadow">
              <Sparkles className="w-3.5 h-3.5" />
              Vault Spotlight
            </span>
            <span className="px-2.5 py-1 rounded bg-black/60 text-neutral-300 text-xs font-semibold backdrop-blur-md border border-neutral-700">
              {current.category}
            </span>
            {current.subCategory && (
              <span className="px-2.5 py-1 rounded bg-neutral-900/80 text-neutral-400 text-xs font-medium border border-neutral-800">
                {current.subCategory}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-xl">
            {current.title}
          </h1>

          {/* Metadata & Dual Ratings */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-300">
            <span className="flex items-center gap-1 font-bold text-white bg-black/60 px-2 py-0.5 rounded border border-neutral-700">
              <Star className="w-3.5 h-3.5 fill-[#E50914] text-[#E50914]" />
              My Rating: {current.personalRating}/10
            </span>
            <span className="font-semibold text-[#F5C518] bg-black/60 px-2 py-0.5 rounded border border-neutral-700">
              IMDb {current.imdbRating}
            </span>
            <span className="font-medium text-neutral-300">{current.releaseYear}</span>
            <span>•</span>
            <span className="font-medium text-neutral-300">{current.duration}</span>
          </div>

          {/* Synopsis / Review Teaser */}
          <p className="text-neutral-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow-md">
            {current.personalReview || current.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Watch Now Button */}
            <a
              href={current.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm sm:text-base transition active:scale-95 shadow-xl"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Now</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            {/* More Info / Review Button */}
            <button
              onClick={() => onSelectMovie(current)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/90 text-white font-bold text-sm sm:text-base transition backdrop-blur-md border border-neutral-700/80 active:scale-95"
            >
              <Info className="w-4 h-4 text-neutral-300" />
              <span>Personal Review</span>
            </button>
          </div>
        </div>

        {/* Carousel Switchers (if multiple featured) */}
        {featuredMovies.length > 1 && (
          <div className="absolute right-4 sm:right-8 bottom-16 sm:bottom-20 flex items-center gap-2">
            <button
              onClick={prevFeatured}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-[#E50914] transition border border-neutral-700/60"
              title="Previous Spotlight"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-neutral-400 px-1">
              {currentIndex + 1} / {featuredMovies.length}
            </span>
            <button
              onClick={nextFeatured}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-[#E50914] transition border border-neutral-700/60"
              title="Next Spotlight"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

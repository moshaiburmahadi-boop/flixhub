import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  subCategories?: string[];
  onSelectMovie: (movie: Movie) => void;
  badge?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  subCategories = [],
  onSelectMovie,
  badge,
}) => {
  const [selectedSub, setSelectedSub] = useState<string>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredMovies =
    selectedSub === 'All'
      ? movies
      : movies.filter((m) => m.subCategory?.toLowerCase() === selectedSub.toLowerCase());

  if (movies.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="py-4 sm:py-6 relative group/row">
      {/* Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-8 mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            {badge && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#E50914] text-white uppercase tracking-wider">
                {badge}
              </span>
            )}
          </h2>
          <span className="text-xs font-semibold text-neutral-500">
            ({filteredMovies.length})
          </span>
        </div>

        {/* Sub-Category Chips (if available) */}
        {subCategories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedSub('All')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedSub === 'All'
                  ? 'bg-neutral-200 text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              All
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                  selectedSub.toLowerCase() === sub.toLowerCase()
                    ? 'bg-[#E50914] text-white shadow'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Row Carousel Area */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/80 text-white hover:bg-[#E50914] transition opacity-0 group-hover/row:opacity-100 shadow-xl border border-neutral-700/80 backdrop-blur"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Horizontal Cards Scroller with uniform card heights and widths */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-4 sm:px-8 py-2 scroll-smooth"
        >
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/80 text-white hover:bg-[#E50914] transition opacity-0 group-hover/row:opacity-100 shadow-xl border border-neutral-700/80 backdrop-blur"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

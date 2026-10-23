import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  subCategories?: string[];
  onSelectMovie: (movie: Movie) => void;
  badge?: string;
  showWhenEmpty?: boolean;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  subCategories = [],
  onSelectMovie,
  badge,
  showWhenEmpty = true,
}) => {
  const [selectedSub, setSelectedSub] = useState<string>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredMovies =
    selectedSub === 'All'
      ? movies
      : movies.filter((m) => m.subCategory?.toLowerCase() === selectedSub.toLowerCase());

  // Only hide if showWhenEmpty is explicitly false and no movies
  if (!showWhenEmpty && movies.length === 0) return null;

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
    <div className="py-2 sm:py-3 relative group/row">
      {/* Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-8 mb-2.5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            {badge && (
              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider shadow-sm shrink-0">
                {badge}
              </span>
            )}
          </h2>
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            ({filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'})
          </span>
        </div>

        {/* Sub-Category Chips (if available) */}
        {subCategories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedSub('All')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedSub === 'All'
                  ? 'bg-slate-200 text-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
                    ? 'bg-blue-600 text-white shadow shadow-blue-950/60'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
        {filteredMovies.length > 0 ? (
          <>
            {/* Left Scroll Button - Hidden on mobile for clean touch swiping */}
            <button
              onClick={() => scroll('left')}
              className="hidden sm:block absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/80 text-white hover:bg-blue-600 transition opacity-0 group-hover/row:opacity-100 shadow-xl border border-slate-700/80 backdrop-blur"
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

            {/* Right Scroll Button - Hidden on mobile for clean touch swiping */}
            <button
              onClick={() => scroll('right')}
              className="hidden sm:block absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/80 text-white hover:bg-blue-600 transition opacity-0 group-hover/row:opacity-100 shadow-xl border border-slate-700/80 backdrop-blur"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        ) : (
          /* Empty Mother Category State (Compact & Clean) */
          <div className="px-4 sm:px-8 py-1">
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 text-slate-400 text-xs">
              <Film className="w-4 h-4 text-blue-500/70 shrink-0" />
              <span>
                No titles logged in <strong className="text-slate-200">{title}</strong> yet. Add in <span className="text-blue-400 font-mono">/admin</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

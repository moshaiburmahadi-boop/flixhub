import React from 'react';
import { Film, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Movie, SortOption } from '../types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title: string;
  subtitle?: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSelectMovie: (movie: Movie) => void;
  emptyMessage?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  title,
  subtitle,
  sortBy,
  onSortChange,
  onSelectMovie,
  emptyMessage = 'No movies found matching your criteria.',
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Grid Top Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
              {movies.length} titles
            </span>
          </h1>
          {subtitle && <p className="text-xs sm:text-sm text-neutral-400 mt-1">{subtitle}</p>}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ArrowUpDown className="w-4 h-4 text-neutral-400" />
          <span className="text-xs text-neutral-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E50914] cursor-pointer"
          >
            <option value="personalRating">My Personal Rating (High to Low)</option>
            <option value="imdbRating">IMDb Rating (High to Low)</option>
            <option value="year">Release Year (Newest)</option>
            <option value="recent">Recently Added / Watched</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {movies.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
            <Film className="w-8 h-8" />
          </div>
          <p className="text-base font-semibold text-neutral-300">{emptyMessage}</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing genre filters, or adding new movies from the admin panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 justify-items-center pt-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
          ))}
        </div>
      )}
    </div>
  );
};

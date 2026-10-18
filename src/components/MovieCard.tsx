import React, { useState } from 'react';
import { Star, Play, Info } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  // Fallback poster if URL fails to load
  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';

  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative flex-shrink-0 w-40 sm:w-52 h-64 sm:h-80 rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800/80 transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl hover:shadow-blue-950/50 hover:border-blue-500/60 focus:outline-none select-none"
    >
      {/* Poster Image */}
      <img
        src={imageError ? fallbackPoster : movie.posterUrl}
        alt={movie.title}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Subtle top gradient for badges */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* Top Badges */}
      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1 pointer-events-none">
        {/* Category tag */}
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-black/75 text-slate-300 backdrop-blur-md border border-slate-700/60 truncate max-w-[90px]">
          {movie.subCategory || movie.category}
        </span>

        {/* Personal rating badge (Blue) */}
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white shadow-md shadow-blue-950/60">
          <Star className="w-3 h-3 fill-white" />
          <span>{movie.personalRating}</span>
        </span>
      </div>

      {/* Bottom Dark Gradient & Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/85 to-transparent pt-12 transition-all duration-300">
        <h3 className="text-sm sm:text-base font-bold text-white leading-tight truncate group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
          <span>{movie.releaseYear}</span>
          <span>•</span>
          <span
            className={`truncate max-w-[95px] ${movie.contentType === 'series' || movie.episodeName ? 'text-blue-400 font-semibold' : ''}`}
            title={movie.contentType === 'series' ? (movie.episodeName || movie.episodeInfo || 'Series') : movie.duration}
          >
            {movie.contentType === 'series'
              ? (movie.episodeName || movie.episodeInfo || 'Series')
              : movie.duration}
          </span>
          <span>•</span>
          <span className="text-amber-400 font-semibold flex items-center gap-0.5 shrink-0">
            IMDb {movie.imdbRating}
          </span>
        </div>

        {/* Hover Action Strip */}
        <div className="mt-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <a
            href={movie.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white text-xs font-bold py-1.5 px-2 rounded-lg hover:bg-blue-700 transition shadow-md active:scale-95"
            title="Watch Now on external site"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Watch</span>
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition active:scale-95 border border-slate-700"
            title="Read Review & Details"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

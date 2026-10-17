import React, { useEffect, useState } from 'react';
import { X, Play, ExternalLink, Star, Calendar, Clock, Film, MessageSquareQuote, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [backdropError, setBackdropError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (movie) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const displayBanner = backdropError || !movie.backdropUrl ? movie.posterUrl : movie.backdropUrl;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl bg-[#181818] border border-neutral-800 shadow-2xl overflow-hidden my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-neutral-300 hover:text-white hover:bg-black/90 transition backdrop-blur-md border border-neutral-700/60"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-neutral-950">
          <img
            src={displayBanner}
            alt={movie.title}
            onError={() => setBackdropError(true)}
            className="w-full h-full object-cover object-center brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

          {/* Title and Fast Action on Banner */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider">
                {movie.category}
              </span>
              {movie.subCategory && (
                <span className="px-2.5 py-1 rounded bg-black/60 text-neutral-300 text-xs font-medium border border-neutral-700 backdrop-blur-md">
                  {movie.subCategory}
                </span>
              )}
              {movie.featured && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Vault Pick
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* Watch Now Button */}
              <a
                href={movie.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-sm sm:text-base shadow-lg shadow-red-900/40 transition active:scale-95 group"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Now</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href={movie.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-neutral-200 underline truncate max-w-xs"
              >
                Open external stream/info
              </a>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Row & Dual Ratings */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
            {/* Year & Duration */}
            <div className="flex items-center gap-4 text-sm text-neutral-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>{movie.releaseYear}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>{movie.duration}</span>
              </div>
              {movie.dateWatched && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <div className="hidden sm:flex items-center gap-1.5 text-neutral-400 text-xs">
                    <span>Watched:</span>
                    <span className="text-neutral-300">{movie.dateWatched}</span>
                  </div>
                </>
              )}
            </div>

            {/* Ratings Duo */}
            <div className="flex items-center gap-3">
              {/* IMDb Rating */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5C518]/15 border border-[#F5C518]/30">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#F5C518] text-black">
                  IMDb
                </span>
                <span className="text-sm font-bold text-[#F5C518]">{movie.imdbRating}</span>
                <span className="text-xs text-neutral-400">/10</span>
              </div>

              {/* Personal Rating */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E50914]/15 border border-[#E50914]/40">
                <Star className="w-4 h-4 fill-[#E50914] text-[#E50914]" />
                <span className="text-xs text-neutral-300 font-medium">My Rating:</span>
                <span className="text-base font-extrabold text-white">{movie.personalRating}</span>
                <span className="text-xs text-neutral-400">/10</span>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          {movie.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#E50914]" />
                Synopsis
              </h4>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {movie.description}
              </p>
            </div>
          )}

          {/* Personal Review & Opinion Section */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/60 border border-neutral-800 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#E50914] flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4" />
                My Personal Thoughts & Review
              </h4>
              <span className="text-xs text-neutral-500 italic">Personal Vault Log</span>
            </div>

            <div className="text-sm sm:text-base text-neutral-200 leading-relaxed italic border-l-2 border-[#E50914] pl-4 py-1">
              {movie.personalReview ? (
                movie.personalReview
              ) : (
                <span className="text-neutral-500 not-italic">No personal notes logged for this title yet.</span>
              )}
            </div>
          </div>

          {/* External Link Footer Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 border-t border-neutral-800/80">
            <span>FlixDairy Vault • Personal Curated Collection</span>
            <a
              href={movie.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-neutral-300 hover:text-[#E50914] transition font-medium"
            >
              <span>Direct Link: {movie.watchUrl.replace(/^https?:\/\//, '').split('/')[0]}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

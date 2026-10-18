import React, { useEffect, useState } from 'react';
import { X, Play, ExternalLink, Star, Calendar, Clock, Film, MessageSquareQuote, Sparkles, Tv } from 'lucide-react';
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
        className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 transition backdrop-blur-md border border-slate-700/60"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-slate-950">
          <img
            src={displayBanner}
            alt={movie.title}
            onError={() => setBackdropError(true)}
            className="w-full h-full object-cover object-center brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

          {/* Title and Fast Action on Banner */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                {movie.category}
              </span>
              {movie.contentType === 'series' && (
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/40 flex items-center gap-1">
                  <Tv className="w-3 h-3" /> TV Series
                </span>
              )}
              {movie.subCategory && (
                <span className="px-2.5 py-1 rounded bg-black/60 text-slate-300 text-xs font-medium border border-slate-700 backdrop-blur-md">
                  {movie.subCategory}
                </span>
              )}
              {movie.featured && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Featured Vault Pick
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* Watch Now Button (Electric Blue) */}
              <a
                href={movie.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-900/50 transition active:scale-95 group"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Now</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href={movie.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-slate-200 underline truncate max-w-xs"
              >
                Open external stream/info
              </a>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Row & Dual Ratings */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            {/* Year & Duration & Episode Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{movie.releaseYear}</span>
              </div>
              {movie.contentType === 'series' || movie.episodeName ? (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-800">
                    <Tv className="w-4 h-4 text-blue-400" />
                    <span>{movie.episodeName || movie.episodeInfo || 'Series'}</span>
                  </div>
                  {movie.episodeInfo && movie.episodeInfo !== movie.episodeName && (
                    <>
                      <span>•</span>
                      <span className="text-slate-300 text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {movie.episodeInfo}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{movie.duration}</span>
                  </div>
                </>
              )}
              {movie.dateWatched && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs">
                    <span>Watched:</span>
                    <span className="text-slate-300">{movie.dateWatched}</span>
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
                <span className="text-xs text-slate-400">/10</span>
              </div>

              {/* Personal Rating (Blue) */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/40">
                <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                <span className="text-xs text-slate-300 font-medium">My Rating:</span>
                <span className="text-base font-extrabold text-blue-400">{movie.personalRating}</span>
                <span className="text-xs text-slate-400">/10</span>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          {movie.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-blue-500" />
                Synopsis
              </h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {movie.description}
              </p>
            </div>
          )}

          {/* Personal Review & Opinion Section */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900/90 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-blue-500" />
                My Personal Thoughts & Review
              </h4>
              <span className="text-xs text-slate-500 italic">Personal Vault Log</span>
            </div>

            <div className="text-sm sm:text-base text-slate-200 leading-relaxed italic border-l-2 border-blue-500 pl-4 py-1">
              {movie.personalReview ? (
                movie.personalReview
              ) : (
                <span className="text-slate-500 not-italic">No personal notes logged for this title yet.</span>
              )}
            </div>
          </div>

          {/* External Link Footer Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
            <span>FlixDairy Vault • Personal Curated Collection</span>
            <a
              href={movie.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition font-medium"
            >
              <span>Direct Link: {movie.watchUrl.replace(/^https?:\/\//, '').split('/')[0]}</span>
              <ExternalLink className="w-3 h-3 text-blue-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

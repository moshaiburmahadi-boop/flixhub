import React, { useState, useEffect } from 'react';
import { Film, Search, X, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: 'home' | 'categories' | 'topRated' | 'all' | 'search';
  onTabChange: (tab: 'home' | 'categories' | 'topRated' | 'all' | 'search') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSurprisePick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onSurprisePick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 w-full max-w-full overflow-hidden ${
        isScrolled
          ? 'bg-[#0b0f17]/95 backdrop-blur-md shadow-2xl py-2.5 sm:py-3 border-b border-slate-800/80'
          : 'bg-gradient-to-b from-[#0b0f17]/95 via-[#0b0f17]/60 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-8 w-full">
        {/* Mobile Full-Width Search Mode */}
        {mobileSearchOpen ? (
          <div className="flex items-center gap-2 w-full animate-fade-in">
            <div className="flex-1 flex items-center bg-slate-900 border border-blue-500 rounded-full px-3 py-1.5 shadow-lg shadow-blue-950/40">
              <Search className="w-4 h-4 text-blue-400 shrink-0" />
              <input
                type="text"
                placeholder="Search movies, genres, reviews..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentTab !== 'search') onTabChange('search');
                }}
                autoFocus
                className="bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none ml-2 w-full min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-slate-400 hover:text-white p-1 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                if (currentTab === 'search' && !searchQuery) onTabChange('home');
              }}
              className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1.5 shrink-0"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            {/* Brand & Desktop Navigation */}
            <div className="flex items-center gap-4 sm:gap-8 min-w-0">
              {/* Logo */}
              <button
                onClick={() => {
                  onTabChange('home');
                  onSearchChange('');
                }}
                className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none shrink-0"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50 group-hover:scale-105 transition-transform">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bebas text-xl sm:text-3xl tracking-wider text-blue-500 font-black leading-none">
                    FLIXDAIRY
                  </span>
                  <span className="text-[8px] sm:text-[9px] tracking-widest text-slate-400 font-semibold uppercase -mt-0.5">
                    Movie Vault
                  </span>
                </div>
              </button>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <button
                  onClick={() => onTabChange('home')}
                  className={`transition cursor-pointer ${
                    currentTab === 'home'
                      ? 'text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => onTabChange('categories')}
                  className={`transition cursor-pointer ${
                    currentTab === 'categories'
                      ? 'text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Genres & Categories
                </button>
                <button
                  onClick={() => onTabChange('topRated')}
                  className={`transition cursor-pointer ${
                    currentTab === 'topRated'
                      ? 'text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => onTabChange('all')}
                  className={`transition cursor-pointer ${
                    currentTab === 'all'
                      ? 'text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Movies
                </button>
                <button
                  onClick={onSurprisePick}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700"
                  title="Pick a random film from your vault"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Surprise Me</span>
                </button>
              </nav>
            </div>

            {/* Right Actions: Search Bar & PWA Install Button */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Desktop Search Bar */}
              <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-700 rounded-full px-3 py-1.5 transition-all w-48 lg:w-64 focus-within:border-blue-500 focus-within:w-60 lg:focus-within:w-72">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search movies, genres..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentTab !== 'search') onTabChange('search');
                  }}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none ml-2 w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Search Icon Button */}
              <button
                onClick={() => {
                  setMobileSearchOpen(true);
                  onTabChange('search');
                }}
                className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/70 transition shrink-0"
                title="Search Vault"
                aria-label="Open search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* In-App PWA Install Button */}
              <PWAInstallButton compact />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

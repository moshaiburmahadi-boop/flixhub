import React, { useState, useEffect } from 'react';
import { Film, Search, X, Sparkles, Star, Layers, Home } from 'lucide-react';
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
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl py-3 border-b border-neutral-800/60'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <button
            onClick={() => {
              onTabChange('home');
              onSearchChange('');
            }}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center shadow-lg shadow-red-950/60 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bebas text-2xl sm:text-3xl tracking-wider text-[#E50914] font-black leading-none">
                FLIXDAIRY
              </span>
              <span className="text-[9px] tracking-widest text-neutral-400 font-semibold uppercase -mt-0.5">
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
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onTabChange('categories')}
              className={`transition cursor-pointer ${
                currentTab === 'categories'
                  ? 'text-white font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Genres & Categories
            </button>
            <button
              onClick={() => onTabChange('topRated')}
              className={`transition cursor-pointer ${
                currentTab === 'topRated'
                  ? 'text-white font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Top Rated Vault
            </button>
            <button
              onClick={() => onTabChange('all')}
              className={`transition cursor-pointer ${
                currentTab === 'all'
                  ? 'text-white font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Movies
            </button>
            <button
              onClick={onSurprisePick}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-[#E50914] transition text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
              title="Pick a random film from your vault"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Surprise Me</span>
            </button>
          </nav>
        </div>

        {/* Right Actions: Search Bar & PWA Install Button (Strictly NO Admin/Account UI!) */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex items-center">
            {showSearchInput || currentTab === 'search' || searchQuery.length > 0 ? (
              <div className="flex items-center bg-black/80 border border-neutral-700 rounded-full px-3 py-1.5 transition-all w-44 sm:w-64 focus-within:border-[#E50914] focus-within:w-56 sm:focus-within:w-72">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search titles, actors, genres..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentTab !== 'search') onTabChange('search');
                  }}
                  autoFocus
                  className="bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none ml-2 w-full"
                />
                {searchQuery ? (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-neutral-400 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSearchInput(false)}
                    className="text-neutral-400 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowSearchInput(true);
                  onTabChange('search');
                }}
                className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800/70 transition"
                title="Search Vault"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* In-App PWA Install Button */}
          <PWAInstallButton compact />
        </div>
      </div>
    </header>
  );
};

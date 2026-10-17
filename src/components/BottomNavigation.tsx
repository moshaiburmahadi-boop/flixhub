import React from 'react';
import { Home, Search, Layers, Star, Sparkles } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: 'home' | 'categories' | 'topRated' | 'all' | 'search';
  onTabChange: (tab: 'home' | 'categories' | 'topRated' | 'all' | 'search') => void;
  onSurprisePick: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  onSurprisePick,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#121212]/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1.5 flex items-center justify-around safe-area-bottom select-none">
      {/* Home */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition ${
          currentTab === 'home' ? 'text-[#E50914]' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Home</span>
      </button>

      {/* Search */}
      <button
        onClick={() => onTabChange('search')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition ${
          currentTab === 'search' ? 'text-[#E50914]' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Search</span>
      </button>

      {/* Categories */}
      <button
        onClick={() => onTabChange('categories')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition ${
          currentTab === 'categories' ? 'text-[#E50914]' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Genres</span>
      </button>

      {/* Top Rated */}
      <button
        onClick={() => onTabChange('topRated')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition ${
          currentTab === 'topRated' ? 'text-[#E50914]' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Star className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Top Rated</span>
      </button>

      {/* Surprise Me / Random Pick */}
      <button
        onClick={onSurprisePick}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-neutral-400 hover:text-amber-400 transition"
      >
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] font-medium mt-0.5 text-neutral-400">Random</span>
      </button>
    </div>
  );
};

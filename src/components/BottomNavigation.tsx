import React from 'react';
import { Home, Search, Layers, Star } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: 'home' | 'categories' | 'topRated' | 'all' | 'search';
  onTabChange: (tab: 'home' | 'categories' | 'topRated' | 'all' | 'search') => void;
  onSurprisePick?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0b0f17]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 grid grid-cols-4 safe-area-bottom select-none shadow-2xl">
      {/* Tab 1: Home */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
          currentTab === 'home' ? 'text-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Home</span>
      </button>

      {/* Tab 2: Search */}
      <button
        onClick={() => onTabChange('search')}
        className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
          currentTab === 'search' ? 'text-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Search</span>
      </button>

      {/* Tab 3: Genres / Categories */}
      <button
        onClick={() => onTabChange('categories')}
        className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
          currentTab === 'categories' ? 'text-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Genres</span>
      </button>

      {/* Tab 4: Top Rated */}
      <button
        onClick={() => onTabChange('topRated')}
        className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
          currentTab === 'topRated' ? 'text-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Star className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Top Rated</span>
      </button>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Movie, Category, SortOption } from './types';
import {
  subscribeToMovies,
  subscribeToCategories,
} from './services/movieService';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieRow } from './components/MovieRow';
import { MovieModal } from './components/MovieModal';
import { MovieGrid } from './components/MovieGrid';
import { BottomNavigation } from './components/BottomNavigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AdminPanel } from './components/AdminPanel';
import { Film, Sparkles, Layers, PlusCircle, Search } from 'lucide-react';

export default function App() {
  // Navigation & Routing state
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.startsWith('/admin') || hash.startsWith('#/admin');
  });

  const [currentTab, setCurrentTab] = useState<'home' | 'categories' | 'topRated' | 'all' | 'search'>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('personalRating');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Movie for Netflix Modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Clean data states directly from Firestore
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen to browser URL changes for secret /admin route
  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isNowAdmin = path.startsWith('/admin') || hash.startsWith('#/admin');
      setIsAdminRoute(isNowAdmin);
    };

    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);

    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
    };
  }, []);

  // Fetch real-time Firestore data
  useEffect(() => {
    let moviesUnsub: (() => void) | undefined;
    let categoriesUnsub: (() => void) | undefined;

    try {
      moviesUnsub = subscribeToMovies((liveMovies) => {
        setMovies(liveMovies);
        setLoading(false);
      });

      categoriesUnsub = subscribeToCategories((liveCategories) => {
        setCategories(liveCategories);
      });
    } catch (e) {
      console.warn('Firestore initial connection note:', e);
      setLoading(false);
    }

    return () => {
      if (moviesUnsub) moviesUnsub();
      if (categoriesUnsub) categoriesUnsub();
    };
  }, []);

  // Exit Admin route handler
  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    if (window.location.hash.startsWith('#/admin')) {
      window.location.hash = '';
    }
  };

  // Surprise pick (random movie modal)
  const handleSurprisePick = () => {
    if (movies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * movies.length);
    setSelectedMovie(movies[randomIndex]);
  };

  // Filtered & Sorted movies
  const displayedMovies = useMemo(() => {
    let list = [...movies];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.subCategory && m.subCategory.toLowerCase().includes(q)) ||
          (m.personalReview && m.personalReview.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (currentTab === 'categories' && selectedCategoryFilter !== 'All') {
      list = list.filter((m) => m.category === selectedCategoryFilter);
      if (selectedSubCategoryFilter !== 'All') {
        list = list.filter(
          (m) => m.subCategory?.toLowerCase() === selectedSubCategoryFilter.toLowerCase()
        );
      }
    }

    // Filter by Top Rated
    if (currentTab === 'topRated') {
      list = list.filter((m) => (m.personalRating || 0) >= 9.0);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'personalRating') return (b.personalRating || 0) - (a.personalRating || 0);
      if (sortBy === 'imdbRating') return (b.imdbRating || 0) - (a.imdbRating || 0);
      if (sortBy === 'year') return (b.releaseYear || 0) - (a.releaseYear || 0);
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [
    movies,
    searchQuery,
    currentTab,
    selectedCategoryFilter,
    selectedSubCategoryFilter,
    sortBy,
  ]);

  // If secret /admin URL accessed, render the Admin Panel
  if (isAdminRoute) {
    return (
      <AdminPanel
        movies={movies}
        categories={categories}
        onExitAdmin={handleExitAdmin}
      />
    );
  }

  // Masterpiece movies for dedicated row
  const topRatedMovies = movies
    .filter((m) => (m.personalRating || 0) >= 9.5)
    .sort((a, b) => (b.personalRating || 0) - (a.personalRating || 0));

  // Current active subcategories list for category filter
  const activeCategoryObj = categories.find((c) => c.name === selectedCategoryFilter);

  return (
    <div className="min-h-screen bg-[#141414] text-neutral-100 pb-24 md:pb-12 selection:bg-[#E50914] selection:text-white max-w-full overflow-x-hidden">
      {/* Offline Status Bar */}
      <OfflineIndicator />

      {/* Public Netflix Navbar (Strictly NO Admin or Account Options!) */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'search') setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSurprisePick={handleSurprisePick}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-full overflow-x-hidden">
        {/* VIEW 1: HOME (Classic Netflix Experience) */}
        {currentTab === 'home' && !searchQuery && (
          <div className="space-y-4 w-full">
            {/* If movies exist, show Spotlight Hero Banner */}
            {movies.length > 0 ? (
              <HeroBanner movies={movies} onSelectMovie={setSelectedMovie} />
            ) : (
              /* Clean Empty Vault Hero State when clean */
              <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-8 text-center bg-gradient-to-b from-neutral-900 via-[#141414] to-[#141414] border-b border-neutral-800/80">
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#E50914] flex items-center justify-center mx-auto shadow-2xl shadow-red-950/80">
                    <Film className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    FLIXDAIRY VAULT
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                    Your personal Netflix-style movie vault is clean and ready. Open <span className="text-[#E50914] font-mono font-bold">/admin</span> in the URL to add your mother categories, log watched movies, write your reviews, and set ratings.
                  </p>
                </div>
              </div>
            )}

            {/* Mother Categories Quick-Browse Bar */}
            {categories.length > 0 && (
              <div className="px-4 sm:px-8 pt-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#E50914]" />
                    Genres:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryFilter(cat.name);
                        setSelectedSubCategoryFilter('All');
                        setCurrentTab('categories');
                      }}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-[#E50914] text-neutral-300 hover:text-white border border-neutral-800 transition shrink-0"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Negative margin overlay to pull rows up seamlessly against hero banner */}
            <div className={`${movies.length > 0 ? '-mt-16 sm:-mt-24' : 'mt-4'} relative z-20 space-y-4 sm:space-y-6 w-full`}>
              {/* Row 1: My Personal Masterpieces (only if movies exist) */}
              {topRatedMovies.length > 0 && (
                <MovieRow
                  title="My 10/10 Masterpieces"
                  movies={topRatedMovies}
                  onSelectMovie={setSelectedMovie}
                  badge="Hall of Fame"
                  showWhenEmpty={false}
                />
              )}

              {/* Dynamic Rows for EVERY mother category added by the admin */}
              {categories.map((category) => {
                const categoryMovies = movies.filter((m) => m.category === category.name);
                return (
                  <MovieRow
                    key={category.id}
                    title={category.name}
                    movies={categoryMovies}
                    subCategories={category.subCategories || []}
                    onSelectMovie={setSelectedMovie}
                    showWhenEmpty={true}
                  />
                );
              })}

              {/* Timeline Row (only if movies exist) */}
              {movies.length > 0 && (
                <MovieRow
                  title="Recently Watched & Logged"
                  movies={[...movies].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )}
                  onSelectMovie={setSelectedMovie}
                  badge="Timeline"
                  showWhenEmpty={false}
                />
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: CATEGORIES & GENRES */}
        {currentTab === 'categories' && !searchQuery && (
          <div className="pt-20 sm:pt-28 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-4">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('All');
                    setSelectedSubCategoryFilter('All');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition shrink-0 ${
                    selectedCategoryFilter === 'All'
                      ? 'bg-[#E50914] text-white shadow-lg'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  All Genres ({movies.length})
                </button>
                {categories.map((cat) => {
                  const count = movies.filter((m) => m.category === cat.name).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryFilter(cat.name);
                        setSelectedSubCategoryFilter('All');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition shrink-0 ${
                        selectedCategoryFilter === cat.name
                          ? 'bg-[#E50914] text-white shadow-lg'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Sub-Category Chips (if a specific category is selected) */}
              {activeCategoryObj && activeCategoryObj.subCategories?.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-3">
                  <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider shrink-0 mr-1">
                    Sub-category:
                  </span>
                  <button
                    onClick={() => setSelectedSubCategoryFilter('All')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                      selectedSubCategoryFilter === 'All'
                        ? 'bg-neutral-200 text-black'
                        : 'bg-neutral-900/90 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    All {selectedCategoryFilter}
                  </button>
                  {activeCategoryObj.subCategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubCategoryFilter(sub)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                        selectedSubCategoryFilter.toLowerCase() === sub.toLowerCase()
                          ? 'bg-neutral-200 text-black'
                          : 'bg-neutral-900/90 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <MovieGrid
              movies={displayedMovies}
              title={
                selectedCategoryFilter === 'All'
                  ? 'All Genres & Categories'
                  : selectedSubCategoryFilter !== 'All'
                  ? `${selectedCategoryFilter} • ${selectedSubCategoryFilter}`
                  : selectedCategoryFilter
              }
              subtitle="Browse movies categorized and tagged in your personal vault."
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectMovie={setSelectedMovie}
              emptyMessage={
                categories.length === 0
                  ? 'No categories created yet. Create mother categories and sub-categories in /admin.'
                  : 'No movies logged in this genre yet. Add titles via /admin.'
              }
            />
          </div>
        )}

        {/* VIEW 3: TOP RATED */}
        {currentTab === 'topRated' && !searchQuery && (
          <div className="pt-20 sm:pt-28 w-full">
            <MovieGrid
              movies={displayedMovies}
              title="Top Rated Vault Picks"
              subtitle="Curated films awarded a 9.0+ personal rating for exceptional filmmaking, storytelling, or emotional impact."
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectMovie={setSelectedMovie}
              emptyMessage="No top-rated movies logged yet. Rate your favorite movies 9.0+ in /admin."
            />
          </div>
        )}

        {/* VIEW 4: ALL MOVIES */}
        {currentTab === 'all' && !searchQuery && (
          <div className="pt-20 sm:pt-28 w-full">
            <MovieGrid
              movies={displayedMovies}
              title="Full Vault Archive"
              subtitle="Every single movie watched, reviewed, and rated in FlixDairy."
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectMovie={setSelectedMovie}
              emptyMessage="Your vault is empty. Log your first watched film in /admin."
            />
          </div>
        )}

        {/* VIEW 5: SEARCH RESULTS & MOBILE SEARCH */}
        {(searchQuery || currentTab === 'search') && (
          <div className="pt-20 sm:pt-28 w-full max-w-7xl mx-auto px-4 sm:px-8">
            {/* Search Input Box on Search Page */}
            <div className="mb-6">
              <div className="relative flex items-center max-w-md w-full bg-neutral-900 border border-neutral-700 rounded-2xl px-4 py-2.5 focus-within:border-[#E50914] shadow-xl">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search titles, genres, review notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none ml-2.5 w-full"
                  autoFocus
                />
              </div>
            </div>

            <MovieGrid
              movies={displayedMovies}
              title={searchQuery ? `Results for "${searchQuery}"` : 'Search Vault'}
              subtitle={searchQuery ? `Found ${displayedMovies.length} matching titles.` : 'Type above to search through your movies.'}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectMovie={setSelectedMovie}
              emptyMessage={searchQuery ? `No movies in the vault matched "${searchQuery}".` : 'Type a title, genre, or keyword to start searching.'}
            />
          </div>
        )}
      </main>

      {/* Netflix Movie Popup Window on Card Click */}
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />

      {/* Mobile-Only Bottom Navigation (Strictly NO account option!) */}
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'search') setSearchQuery('');
        }}
        onSurprisePick={handleSurprisePick}
      />

      {/* Netflix-style Footer */}
      <footer className="mt-20 border-t border-neutral-900 py-10 px-4 sm:px-8 text-neutral-500 text-xs max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#E50914] flex items-center justify-center text-white font-bold text-[10px]">
              FD
            </div>
            <span className="font-bebas text-lg text-neutral-400 tracking-wider">FLIXDAIRY</span>
            <span className="text-neutral-600">• Personal Curated Movie Vault</span>
          </div>
          <div>
            <span>{movies.length} movies cataloged across {categories.length} genres</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

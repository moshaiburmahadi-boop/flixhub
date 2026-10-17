/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Movie, Category, SortOption } from './types';
import {
  subscribeToMovies,
  subscribeToCategories,
  seedInitialVault,
} from './services/movieService';
import { INITIAL_CATEGORIES, INITIAL_MOVIES } from './data/initialMovies';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieRow } from './components/MovieRow';
import { MovieModal } from './components/MovieModal';
import { MovieGrid } from './components/MovieGrid';
import { BottomNavigation } from './components/BottomNavigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AdminPanel } from './components/AdminPanel';
import { Film, Sparkles, Filter, Layers } from 'lucide-react';

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

  // Data states
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

  // Fetch Firestore data in real-time
  useEffect(() => {
    let moviesUnsub: (() => void) | undefined;
    let categoriesUnsub: (() => void) | undefined;

    try {
      moviesUnsub = subscribeToMovies((liveMovies) => {
        if (liveMovies.length > 0) {
          setMovies(liveMovies);
        } else {
          // If Firestore is empty, populate with curated starter items for display
          const formattedInitial: Movie[] = INITIAL_MOVIES.map((m, idx) => ({
            ...m,
            id: `init_${idx + 1}`,
          }));
          setMovies(formattedInitial);
        }
        setLoading(false);
      });

      categoriesUnsub = subscribeToCategories((liveCategories) => {
        if (liveCategories.length > 0) {
          setCategories(liveCategories);
        } else {
          const formattedCats: Category[] = INITIAL_CATEGORIES.map((c, idx) => ({
            ...c,
            id: `cat_${idx + 1}`,
          }));
          setCategories(formattedCats);
        }
      });
    } catch (e) {
      console.warn('Using local curated fallback due to offline/initial state');
      const formattedInitial: Movie[] = INITIAL_MOVIES.map((m, idx) => ({
        ...m,
        id: `init_${idx + 1}`,
      }));
      setMovies(formattedInitial);
      const formattedCats: Category[] = INITIAL_CATEGORIES.map((c, idx) => ({
        ...c,
        id: `cat_${idx + 1}`,
      }));
      setCategories(formattedCats);
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
    <div className="min-h-screen bg-[#141414] text-neutral-100 pb-24 md:pb-12 selection:bg-[#E50914] selection:text-white">
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
      <main>
        {/* VIEW 1: HOME (Classic Netflix Experience) */}
        {currentTab === 'home' && !searchQuery && (
          <div className="space-y-4">
            {/* Spotlight Hero Banner */}
            <HeroBanner movies={movies} onSelectMovie={setSelectedMovie} />

            {/* Negative margin overlay to pull rows up seamlessly against hero banner */}
            <div className="-mt-16 sm:-mt-24 relative z-20 space-y-4 sm:space-y-6">
              {/* Row 1: My Personal Masterpieces */}
              {topRatedMovies.length > 0 && (
                <MovieRow
                  title="My 10/10 Masterpieces"
                  movies={topRatedMovies}
                  onSelectMovie={setSelectedMovie}
                  badge="Hall of Fame"
                />
              )}

              {/* Dynamic Rows for each curated category */}
              {categories.map((category) => {
                const categoryMovies = movies.filter((m) => m.category === category.name);
                if (categoryMovies.length === 0) return null;
                return (
                  <MovieRow
                    key={category.id}
                    title={category.name}
                    movies={categoryMovies}
                    subCategories={category.subCategories || []}
                    onSelectMovie={setSelectedMovie}
                  />
                );
              })}

              {/* Row: Recently Added / Watched */}
              {movies.length > 0 && (
                <MovieRow
                  title="Recently Watched & Logged"
                  movies={[...movies].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )}
                  onSelectMovie={setSelectedMovie}
                  badge="Timeline"
                />
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: CATEGORIES & GENRES */}
        {currentTab === 'categories' && !searchQuery && (
          <div className="pt-24 sm:pt-28">
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
            />
          </div>
        )}

        {/* VIEW 3: TOP RATED */}
        {currentTab === 'topRated' && !searchQuery && (
          <div className="pt-24 sm:pt-28">
            <MovieGrid
              movies={displayedMovies}
              title="Top Rated Vault Picks"
              subtitle="Curated films awarded a 9.0+ personal rating for exceptional filmmaking, storytelling, or emotional impact."
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectMovie={setSelectedMovie}
            />
          </div>
        )}

        {/* VIEW 4: ALL MOVIES */}
        {currentTab === 'all' && !searchQuery && (
          <div className="pt-24 sm:pt-28">
            <MovieGrid
              movies={displayedMovies}
              title="Full Vault Archive"
              subtitle="Every single movie watched, reviewed, and rated in FlixDairy."
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectMovie={setSelectedMovie}
            />
          </div>
        )}

        {/* VIEW 5: SEARCH RESULTS */}
        {searchQuery && (
          <div className="pt-24 sm:pt-28">
            <MovieGrid
              movies={displayedMovies}
              title={`Search Results for "${searchQuery}"`}
              subtitle={`Found ${displayedMovies.length} matching titles in your vault.`}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectMovie={setSelectedMovie}
              emptyMessage={`No movies in the vault matched "${searchQuery}".`}
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
        <p className="text-neutral-600">
          FlixDairy is a personal Netflix-style film vault built with React, Vite PWA, and Firebase Firestore.
          All external watch buttons open direct links provided in the vault.
        </p>
      </footer>
    </div>
  );
}

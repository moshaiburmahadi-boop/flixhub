import React, { useState, useEffect } from 'react';
import {
  Film,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Star,
  Check,
  X,
  Lock,
  Layers,
  Sparkles,
  LogOut,
  ArrowLeft,
  Eye,
  RefreshCw,
  FolderPlus,
  Tag,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Movie, Category } from '../types';
import {
  saveMovie,
  removeMovie,
  saveCategory,
  removeCategory,
  seedInitialVault,
} from '../services/movieService';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from '../firebase';

interface AdminPanelProps {
  movies: Movie[];
  categories: Category[];
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  movies,
  categories,
  onExitAdmin,
}) => {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isLocalAdminUnlocked, setIsLocalAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('flixdairy_admin_unlocked') === 'true';
  });

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Admin Dashboard states
  const [activeTab, setActiveTab] = useState<'movies' | 'categories' | 'tools'>('movies');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingMovie, setIsEditingMovie] = useState<boolean>(false);
  const [movieForm, setMovieForm] = useState<Partial<Movie>>({
    title: '',
    posterUrl: '',
    backdropUrl: '',
    personalRating: 9.0,
    imdbRating: 8.5,
    duration: '2h 15m',
    releaseYear: new Date().getFullYear(),
    category: categories[0]?.name || 'Sci-Fi & Space',
    subCategory: '',
    description: '',
    personalReview: '',
    watchUrl: '',
    featured: false,
    dateWatched: new Date().toISOString().split('T')[0],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Category management states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryInput, setNewSubCategoryInput] = useState<{ [categoryId: string]: string }>({});

  // Sync auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const isAuthenticated = !!currentUser || isLocalAdminUnlocked;

  // Handle Login
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    // Normalize email if username was entered
    let targetEmail = emailInput.trim();
    if (!targetEmail.includes('@')) {
      targetEmail = `${targetEmail.toLowerCase()}@flixdairy.admin`;
    }

    try {
      if (authMode === 'login') {
        try {
          await signInWithEmailAndPassword(auth, targetEmail, passwordInput);
        } catch (err: unknown) {
          // If master password fallback is entered or Firebase email provider is not enabled
          if (passwordInput === 'admin123' || passwordInput === 'flixdairy') {
            localStorage.setItem('flixdairy_admin_unlocked', 'true');
            setIsLocalAdminUnlocked(true);
            setAuthLoading(false);
            return;
          }
          throw err;
        }
      } else {
        await createUserWithEmailAndPassword(auth, targetEmail, passwordInput);
      }
      localStorage.setItem('flixdairy_admin_unlocked', 'true');
      setIsLocalAdminUnlocked(true);
    } catch (err: unknown) {
      console.error('Auth error:', err);
      // Master passkey fallback: if user uses admin / admin123
      if (passwordInput === 'admin123' || passwordInput === 'flixdairy' || passwordInput === 'admin') {
        localStorage.setItem('flixdairy_admin_unlocked', 'true');
        setIsLocalAdminUnlocked(true);
      } else {
        const msg = err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.';
        setAuthError(msg.replace('Firebase: ', ''));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem('flixdairy_admin_unlocked', 'true');
      setIsLocalAdminUnlocked(true);
    } catch (err: unknown) {
      console.error('Google auth error:', err);
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('flixdairy_admin_unlocked');
    setIsLocalAdminUnlocked(false);
    setCurrentUser(null);
  };

  // Movie Form actions
  const openNewMovieForm = () => {
    setMovieForm({
      title: '',
      posterUrl: '',
      backdropUrl: '',
      personalRating: 9.0,
      imdbRating: 8.5,
      duration: '2h 15m',
      releaseYear: new Date().getFullYear(),
      category: categories[0]?.name || 'Sci-Fi & Space',
      subCategory: '',
      description: '',
      personalReview: '',
      watchUrl: '',
      featured: false,
      dateWatched: new Date().toISOString().split('T')[0],
    });
    setIsEditingMovie(true);
  };

  const openEditMovieForm = (movie: Movie) => {
    setMovieForm({ ...movie });
    setIsEditingMovie(true);
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieForm.title || !movieForm.posterUrl || !movieForm.watchUrl) {
      showStatus('Title, Poster URL, and Watch URL are required.', 'error');
      return;
    }

    setFormLoading(true);
    try {
      await saveMovie(movieForm as Omit<Movie, 'id'> & { id?: string });
      showStatus(`Movie "${movieForm.title}" saved successfully!`);
      setIsEditingMovie(false);
    } catch (err: unknown) {
      console.error('Save error:', err);
      showStatus('Failed to save movie. Check your database permissions.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMovie = async (movie: Movie) => {
    if (confirm(`Are you sure you want to delete "${movie.title}" from your vault?`)) {
      try {
        await removeMovie(movie.id);
        showStatus(`Deleted "${movie.title}".`);
      } catch (err) {
        showStatus('Failed to delete movie.', 'error');
      }
    }
  };

  // Category Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await saveCategory({
        name: newCategoryName.trim(),
        subCategories: [],
        createdAt: new Date().toISOString(),
      });
      setNewCategoryName('');
      showStatus(`Category "${newCategoryName}" created!`);
    } catch (err) {
      showStatus('Failed to create category.', 'error');
    }
  };

  const handleAddSubCategory = async (category: Category) => {
    const subName = newSubCategoryInput[category.id]?.trim();
    if (!subName) return;

    if (category.subCategories.includes(subName)) {
      showStatus('Sub-category already exists.', 'error');
      return;
    }

    try {
      await saveCategory({
        ...category,
        subCategories: [...category.subCategories, subName],
      });
      setNewSubCategoryInput((prev) => ({ ...prev, [category.id]: '' }));
      showStatus(`Added subcategory "${subName}".`);
    } catch (err) {
      showStatus('Failed to add subcategory.', 'error');
    }
  };

  const handleRemoveSubCategory = async (category: Category, subName: string) => {
    try {
      await saveCategory({
        ...category,
        subCategories: category.subCategories.filter((s) => s !== subName),
      });
      showStatus(`Removed subcategory "${subName}".`);
    } catch (err) {
      showStatus('Failed to remove subcategory.', 'error');
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (confirm(`Delete category "${category.name}"? Movies under it will remain in vault.`)) {
      try {
        await removeCategory(category.id);
        showStatus(`Category "${category.name}" removed.`);
      } catch (err) {
        showStatus('Failed to delete category.', 'error');
      }
    }
  };

  // Seed Vault
  const handleSeedVault = async () => {
    if (!currentUser) {
      showStatus('Please sign in with Google (moshaibur.mahadi@gmail.com) first to seed to Firebase.', 'error');
      return;
    }
    if (confirm('Do you want to populate your vault with curated starter movies and categories?')) {
      try {
        const res = await seedInitialVault();
        showStatus(`Seeded ${res.seededMovies} movies and ${res.seededCategories} categories!`);
      } catch (err: unknown) {
        showStatus(err instanceof Error ? err.message : 'Seeding failed.', 'error');
      }
    }
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const data = {
      vault: 'FlixDairy',
      exportedAt: new Date().toISOString(),
      movies,
      categories,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flixdairy_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter movies in admin
  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.subCategory && m.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // If NOT authenticated, render Admin Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#181818] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#E50914] flex items-center justify-center mx-auto shadow-lg shadow-red-950/60">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">FlixDairy Vault Admin</h1>
            <p className="text-xs text-neutral-400">
              Restricted management console for your personal movie vault.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Admin Username or Email
              </label>
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin or your-email@gmail.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Default initial master passkey: <span className="text-neutral-400 font-mono">admin123</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-sm shadow-lg shadow-red-900/40 transition active:scale-95 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>{authMode === 'login' ? 'Sign In as Admin' : 'Create Admin Account'}</span>
            </button>
          </form>

          {/* Google Sign In option */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-800 w-full" />
            <span className="bg-[#181818] px-3 text-[11px] text-neutral-500 font-medium uppercase tracking-wider absolute">
              or
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition border border-neutral-700 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>

          {/* Bottom switch & return link */}
          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="hover:text-white underline cursor-pointer"
            >
              {authMode === 'login' ? 'Need to register admin?' : 'Already have admin?'}
            </button>
            <button
              onClick={onExitAdmin}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Vault</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#121212] text-neutral-200">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-[#181818] border-b border-neutral-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center text-white font-black text-sm">
              FD
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight flex items-center gap-2">
                <span>FlixDairy Vault Admin</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </h1>
              <p className="text-[11px] text-neutral-400">
                Logged in as {currentUser?.email || 'Vault Administrator'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition"
            title="Preview public FlixDairy frontend"
          >
            <Eye className="w-4 h-4 text-neutral-400" />
            <span className="hidden sm:inline">View Public Vault</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-xs font-semibold text-red-200 transition"
            title="Log out from admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed top-16 right-4 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2 animate-bounce ${
            statusMessage.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-[#181818] border border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Total Movies</span>
            <p className="text-2xl font-black text-white mt-1">{movies.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#181818] border border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Genres / Categories</span>
            <p className="text-2xl font-black text-white mt-1">{categories.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#181818] border border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Avg My Rating</span>
            <p className="text-2xl font-black text-[#E50914] mt-1">
              {movies.length > 0
                ? (movies.reduce((acc, m) => acc + (m.personalRating || 0), 0) / movies.length).toFixed(1)
                : '0.0'}
              <span className="text-xs text-neutral-400 font-normal"> / 10</span>
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#181818] border border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Avg IMDb Rating</span>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {movies.length > 0
                ? (movies.reduce((acc, m) => acc + (m.imdbRating || 0), 0) / movies.length).toFixed(1)
                : '0.0'}
              <span className="text-xs text-neutral-400 font-normal"> / 10</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'movies'
                ? 'bg-[#E50914] text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Manage Movies ({movies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'categories'
                ? 'bg-[#E50914] text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Manage Categories & Sub-Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'tools'
                ? 'bg-[#E50914] text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Seed & Backup Tools</span>
          </button>
        </div>

        {/* TAB 1: MOVIES */}
        {activeTab === 'movies' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Filter movies by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#181818] border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] w-full sm:w-72"
              />

              <button
                onClick={openNewMovieForm}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/40 transition active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Movie</span>
              </button>
            </div>

            {/* Movies Table / List */}
            <div className="bg-[#181818] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-neutral-900/80 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Poster</th>
                      <th className="py-3 px-4">Title & Year</th>
                      <th className="py-3 px-4">Category / Sub-Category</th>
                      <th className="py-3 px-4">My Rating</th>
                      <th className="py-3 px-4">IMDb</th>
                      <th className="py-3 px-4">Watch Link</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {filteredMovies.map((movie) => (
                      <tr key={movie.id} className="hover:bg-neutral-800/40 transition">
                        <td className="py-2.5 px-4">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded shadow bg-neutral-900"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200&auto=format&fit=crop';
                            }}
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{movie.title}</span>
                            {movie.featured && (
                              <span className="p-0.5 rounded bg-amber-500/20 text-amber-300" title="Featured Spotlight">
                                <Sparkles className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className="text-neutral-400 text-xs">
                            {movie.releaseYear} • {movie.duration}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-800 text-neutral-200">
                            {movie.category}
                          </span>
                          {movie.subCategory && (
                            <span className="ml-1.5 text-neutral-400 text-xs">/ {movie.subCategory}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-white">
                          <span className="text-[#E50914]">{movie.personalRating}</span>
                          <span className="text-neutral-500 text-xs">/10</span>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-amber-400">
                          {movie.imdbRating}
                        </td>
                        <td className="py-2.5 px-4">
                          <a
                            href={movie.watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline max-w-[150px] truncate"
                          >
                            <span>Test Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditMovieForm(movie)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-300 hover:text-red-400 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredMovies.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-500">
                          No movies found. Click "Add New Movie" above or use the "Seed" tool.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES & SUB-CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Create Category Bar */}
            <div className="p-4 rounded-2xl bg-[#181818] border border-neutral-800">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#E50914]" />
                Create New Main Category
              </h3>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Psychological Thriller, Anime, Documentaries..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs sm:text-sm transition shrink-0"
                >
                  Add Category
                </button>
              </form>
            </div>

            {/* Existing Categories Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const count = movies.filter((m) => m.category === cat.name).length;
                return (
                  <div key={cat.id} className="p-5 rounded-2xl bg-[#181818] border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>{cat.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                            {count} movies
                          </span>
                        </h4>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subcategories list */}
                    <div>
                      <span className="text-xs text-neutral-400 block mb-2 font-medium">
                        Sub-categories under {cat.name}:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {cat.subCategories?.map((sub) => (
                          <span
                            key={sub}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-neutral-900 text-neutral-300 border border-neutral-800"
                          >
                            <Tag className="w-3 h-3 text-[#E50914]" />
                            <span>{sub}</span>
                            <button
                              onClick={() => handleRemoveSubCategory(cat, sub)}
                              className="text-neutral-500 hover:text-red-400 ml-0.5"
                              title="Remove subcategory"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {(!cat.subCategories || cat.subCategories.length === 0) && (
                          <span className="text-xs text-neutral-500 italic">No sub-categories added yet.</span>
                        )}
                      </div>
                    </div>

                    {/* Add Subcategory input */}
                    <div className="flex gap-2 pt-2 border-t border-neutral-800/80">
                      <input
                        type="text"
                        placeholder="Add subcategory tag (e.g. Cyberpunk)..."
                        value={newSubCategoryInput[cat.id] || ''}
                        onChange={(e) =>
                          setNewSubCategoryInput({ ...newSubCategoryInput, [cat.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubCategory(cat);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                      />
                      <button
                        onClick={() => handleAddSubCategory(cat)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition shrink-0"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TOOLS & BACKUP */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#181818] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Seed Starter Collection</h3>
                  <p className="text-xs text-neutral-400">
                    Populate your vault with 8 hand-curated masterpiece movies and categories if currently empty.
                  </p>
                </div>
              </div>
              <button
                onClick={handleSeedVault}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition border border-neutral-700"
              >
                Seed Initial Movies & Genres
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#181818] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Export Vault Backup</h3>
                  <p className="text-xs text-neutral-400">
                    Download a full JSON backup of all your movies, ratings, reviews, and categories.
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition border border-neutral-700"
              >
                Download JSON Backup
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Movie Form Modal (Create or Edit) */}
      {isEditingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#181818] border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-[#E50914]" />
                <span>{movieForm.id ? 'Edit Movie Details' : 'Add Movie to Vault'}</span>
              </h2>
              <button
                onClick={() => setIsEditingMovie(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4">
              {/* Title & Release Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interstellar"
                    value={movieForm.title || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Release Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2035"
                    value={movieForm.releaseYear || 2024}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseYear: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Poster URL & Backdrop URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Poster Image Link (URL) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://.../poster.jpg"
                    value={movieForm.posterUrl || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Backdrop / Banner URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://.../landscape.jpg"
                    value={movieForm.backdropUrl || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {movieForm.posterUrl && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <img
                    src={movieForm.posterUrl}
                    alt="Preview"
                    className="w-12 h-16 object-cover rounded shadow"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200&auto=format&fit=crop';
                    }}
                  />
                  <div className="text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-200">Poster Preview:</span>
                    <p className="truncate max-w-sm text-neutral-500">{movieForm.posterUrl}</p>
                  </div>
                </div>
              )}

              {/* Ratings and Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                    <span>Personal Rating (0 - 10) *</span>
                    <span className="text-[#E50914] font-bold">{movieForm.personalRating} / 10</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={movieForm.personalRating ?? 9.0}
                    onChange={(e) => setMovieForm({ ...movieForm, personalRating: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                    <span>IMDb Rating (0 - 10) *</span>
                    <span className="text-amber-400 font-bold">{movieForm.imdbRating} / 10</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={movieForm.imdbRating ?? 8.5}
                    onChange={(e) => setMovieForm({ ...movieForm, imdbRating: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Duration (e.g. 2h 49m)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2h 28m"
                    value={movieForm.duration || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Category & Sub-Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Main Category / Genre *
                  </label>
                  <select
                    value={movieForm.category || ''}
                    onChange={(e) => {
                      const catName = e.target.value;
                      const matched = categories.find((c) => c.name === catName);
                      setMovieForm({
                        ...movieForm,
                        category: catName,
                        subCategory: matched?.subCategories?.[0] || '',
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E50914] cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Sub-Category (e.g. Cyberpunk, Nolan)
                  </label>
                  <input
                    type="text"
                    placeholder="Sub-category or tag"
                    value={movieForm.subCategory || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, subCategory: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* External Watch Link */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  External Watch / Stream Link (URL) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="url"
                    required
                    placeholder="https://netflix.com/title/... or https://imdb.com/..."
                    value={movieForm.watchUrl || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, watchUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                  />
                  {movieForm.watchUrl && (
                    <a
                      href={movieForm.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Synopsis / Story Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Plot summary of the movie..."
                  value={movieForm.description || ''}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Personal Thoughts / Review (amar motamot) */}
              <div>
                <label className="block text-xs font-semibold text-[#E50914] mb-1">
                  My Personal Thoughts & Review Notes (Amar Motamot) *
                </label>
                <textarea
                  rows={3}
                  placeholder="Write your honest opinion, best scenes, emotional impact, why you love it..."
                  value={movieForm.personalReview || ''}
                  onChange={(e) => setMovieForm({ ...movieForm, personalReview: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Featured & Date Watched */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                  <input
                    type="checkbox"
                    checked={!!movieForm.featured}
                    onChange={(e) => setMovieForm({ ...movieForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#E50914] accent-[#E50914] focus:ring-0"
                  />
                  <span>Feature in Hero Spotlight Banner</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Date Watched:</span>
                  <input
                    type="date"
                    value={movieForm.dateWatched || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, dateWatched: e.target.value })}
                    className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsEditingMovie(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs sm:text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/40 transition active:scale-95 flex items-center gap-2"
                >
                  {formLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{movieForm.id ? 'Save Changes' : 'Add to Vault'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { Movie, Category } from '../types';
import { INITIAL_CATEGORIES, INITIAL_MOVIES } from '../data/initialMovies';

const MOVIES_PATH = 'movies';
const CATEGORIES_PATH = 'categories';

// Real-time movies subscription
export function subscribeToMovies(
  callback: (movies: Movie[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(collection(db, MOVIES_PATH), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const movies: Movie[] = [];
        snapshot.forEach((doc) => {
          movies.push({ id: doc.id, ...doc.data() } as Movie);
        });
        callback(movies);
      },
      (error) => {
        console.error('Failed to subscribe to movies:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, MOVIES_PATH);
      }
    );
  } catch (err) {
    console.error('Movies subscription initialization error:', err);
    return () => {};
  }
}

// Real-time categories subscription
export function subscribeToCategories(
  callback: (categories: Category[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(collection(db, CATEGORIES_PATH));
    return onSnapshot(
      q,
      (snapshot) => {
        const categories: Category[] = [];
        snapshot.forEach((doc) => {
          categories.push({ id: doc.id, ...doc.data() } as Category);
        });
        callback(categories);
      },
      (error) => {
        console.error('Failed to subscribe to categories:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, CATEGORIES_PATH);
      }
    );
  } catch (err) {
    console.error('Categories subscription initialization error:', err);
    return () => {};
  }
}

// Add or update movie
export async function saveMovie(movie: Omit<Movie, 'id'> & { id?: string }): Promise<string> {
  const movieId = movie.id || `m_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const movieData: Movie = {
    id: movieId,
    title: movie.title.trim(),
    posterUrl: movie.posterUrl.trim(),
    backdropUrl: movie.backdropUrl ? movie.backdropUrl.trim() : movie.posterUrl.trim(),
    personalRating: Number(movie.personalRating),
    imdbRating: Number(movie.imdbRating),
    duration: movie.duration.trim(),
    releaseYear: Number(movie.releaseYear) || new Date().getFullYear(),
    category: movie.category.trim(),
    subCategory: movie.subCategory ? movie.subCategory.trim() : '',
    description: movie.description.trim(),
    personalReview: movie.personalReview.trim(),
    watchUrl: movie.watchUrl.trim(),
    featured: !!movie.featured,
    dateWatched: movie.dateWatched || new Date().toISOString().split('T')[0],
    createdAt: movie.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const movieRef = doc(db, MOVIES_PATH, movieId);
    await setDoc(movieRef, movieData, { merge: true });
    return movieId;
  } catch (error) {
    handleFirestoreError(error, movie.id ? OperationType.UPDATE : OperationType.CREATE, `${MOVIES_PATH}/${movieId}`);
  }
}

// Delete movie
export async function removeMovie(movieId: string): Promise<void> {
  try {
    const movieRef = doc(db, MOVIES_PATH, movieId);
    await deleteDoc(movieRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${MOVIES_PATH}/${movieId}`);
  }
}

// Add or update category
export async function saveCategory(category: Omit<Category, 'id'> & { id?: string }): Promise<string> {
  const categoryId = category.id || `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const categoryData: Category = {
    id: categoryId,
    name: category.name.trim(),
    subCategories: (category.subCategories || []).map((s) => s.trim()).filter(Boolean),
    createdAt: category.createdAt || new Date().toISOString(),
  };

  try {
    const catRef = doc(db, CATEGORIES_PATH, categoryId);
    await setDoc(catRef, categoryData, { merge: true });
    return categoryId;
  } catch (error) {
    handleFirestoreError(error, category.id ? OperationType.UPDATE : OperationType.CREATE, `${CATEGORIES_PATH}/${categoryId}`);
  }
}

// Delete category
export async function removeCategory(categoryId: string): Promise<void> {
  try {
    const catRef = doc(db, CATEGORIES_PATH, categoryId);
    await deleteDoc(catRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_PATH}/${categoryId}`);
  }
}

// Seed initial dataset if database is empty
export async function seedInitialVault(): Promise<{ seededMovies: number; seededCategories: number }> {
  if (!auth.currentUser) {
    throw new Error('Please sign in as an admin before seeding data to Firestore.');
  }

  try {
    // Check existing
    const movieSnap = await getDocs(collection(db, MOVIES_PATH));
    const catSnap = await getDocs(collection(db, CATEGORIES_PATH));

    let seededCategories = 0;
    if (catSnap.empty) {
      for (const cat of INITIAL_CATEGORIES) {
        await saveCategory(cat);
        seededCategories++;
      }
    }

    let seededMovies = 0;
    if (movieSnap.empty) {
      for (const mov of INITIAL_MOVIES) {
        await saveMovie(mov);
        seededMovies++;
      }
    }

    return { seededMovies, seededCategories };
  } catch (error) {
    console.error('Error seeding initial vault:', error);
    throw error;
  }
}

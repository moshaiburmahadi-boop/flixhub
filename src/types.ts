export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  personalRating: number; // 0 to 10
  imdbRating: number;     // 0 to 10
  duration: string;       // e.g. "2h 49m"
  releaseYear: number;    // e.g. 2023
  category: string;       // e.g. "Sci-Fi", "Action", "Thriller"
  subCategory?: string;   // e.g. "Cyberpunk", "Christopher Nolan"
  description: string;    // Plot synopsis
  personalReview: string; // Personal opinions, thoughts, review notes
  watchUrl: string;       // External web streaming or info link
  featured?: boolean;     // Highlight in hero banner
  dateWatched?: string;   // Date watched (YYYY-MM-DD)
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  subCategories: string[];
  createdAt: string;
}

export type SortOption = 'personalRating' | 'imdbRating' | 'year' | 'recent' | 'title';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedSubCategory: string;
  sortBy: SortOption;
  minRating: number;
}

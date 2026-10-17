import { Movie, Category } from '../types';

// Clean initial state with no hardcoded demo content
export const INITIAL_CATEGORIES: Omit<Category, 'id'>[] = [];

export const INITIAL_MOVIES: Omit<Movie, 'id'>[] = [];

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable, of, firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Recipe {
  id: string;
  name: string;
  category: string;
  area: string;
  thumbnail: string;
  instructions: string;
  ingredients: string[];
  isFavorite: boolean;
}

/**
 * RecipeService handles all recipe-related operations including
 * fetching from external API, local storage management, and favorites
 */
@Injectable({ 
  providedIn: 'root' 
})
export class RecipeService {
  private readonly FAVORITES_KEY = 'favorites';
  private readonly USER_RECIPES_KEY = 'userRecipes';
  private readonly API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

  constructor(
    private http: HttpClient, 
    private storage: StorageService
  ) {}

  /**
   * Fetch recipes from TheMealDB API
   * @returns Observable of Recipe array
   */
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<any>(this.API_URL)
      .pipe(
        map(response => {
          if (!response.meals) return [];
          
          // Transform API response to our Recipe interface
          return response.meals.slice(0, 20).map((meal: any) => {
            const ingredients: string[] = [];
            
            // Extract ingredients and measurements from API response
            for (let i = 1; i <= 20; i++) {
              const ingredient = meal[`strIngredient${i}`];
              const measure = meal[`strMeasure${i}`];
              if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure || ''} ${ingredient}`.trim());
              }
            }

            return {
              id: meal.idMeal,
              name: meal.strMeal,
              category: meal.strCategory,
              area: meal.strArea,
              thumbnail: meal.strMealThumb,
              instructions: meal.strInstructions,
              ingredients,
              isFavorite: false
            } as Recipe;
          });
        }),
        catchError(error => {
          console.error('Error fetching recipes from API:', error);
          return of([]); // Return empty array on error
        })
      );
  }

  /**
   * Get user-created recipes from local storage
   * @returns Promise resolving to Recipe array
   */
  async getUserRecipes(): Promise<Recipe[]> {
    const recipes = await this.storage.get<Recipe[]>(this.USER_RECIPES_KEY);
    return recipes || [];
  }

  /**
   * Get all recipes (both API and user-created)
   * @returns Promise resolving to combined Recipe array
   */
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const [userRecipes, apiRecipes] = await Promise.all([
        this.getUserRecipes(),
        firstValueFrom(this.getRecipes())
      ]);
      
      return [...userRecipes, ...apiRecipes];
    } catch (error) {
      console.error('Error getting all recipes:', error);
      // Fallback to user recipes only if API fails
      return await this.getUserRecipes();
    }
  }

  /**
   * Get list of favorite recipe IDs from storage
   * @returns Promise resolving to string array of IDs
   */
  async getFavoriteIds(): Promise<string[]> {
    const favorites = await this.storage.get<string[]>(this.FAVORITES_KEY);
    return favorites || [];
  }

  /**
   * Toggle favorite status of a recipe
   * @param recipe - Recipe to toggle favorite status
   */
  async toggleFavorite(recipe: Recipe): Promise<void> {
    const favorites = await this.getFavoriteIds();
    const index = favorites.indexOf(recipe.id);
    
    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1);
    } else {
      // Add to favorites
      favorites.push(recipe.id);
    }
    
    await this.storage.set(this.FAVORITES_KEY, favorites);
  }

  /**
   * Get all favorite recipes
   * @returns Promise resolving to favorite Recipe array
   */
  async getFavorites(): Promise<Recipe[]> {
    const [allRecipes, favoriteIds] = await Promise.all([
      this.getAllRecipes(),
      this.getFavoriteIds()
    ]);
    
    return allRecipes.filter(recipe => favoriteIds.includes(recipe.id));
  }

  /**
   * Add a new user-created recipe
   * @param recipe - Recipe to add (without ID)
   */
  async addRecipe(recipe: Omit<Recipe, 'id'>): Promise<void> {
    const userRecipes = await this.getUserRecipes();
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString() // Generate unique ID
    };
    
    userRecipes.unshift(newRecipe); // Add to beginning of array
    await this.storage.set(this.USER_RECIPES_KEY, userRecipes);
  }

  /**
   * Get a specific recipe by ID
   * @param id - Recipe ID to find
   * @returns Promise resolving to Recipe or null if not found
   */
  async getRecipeById(id: string): Promise<Recipe | null> {
    const allRecipes = await this.getAllRecipes();
    return allRecipes.find(recipe => recipe.id === id) || null;
  }
}
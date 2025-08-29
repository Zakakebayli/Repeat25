import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonButton, IonIcon, IonRefresher, IonRefresherContent,
  IonSpinner, IonGrid, IonRow, IonCol, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, heart, heartOutline, trash, arrowDownOutline, arrowBack, restaurant } from 'ionicons/icons';

import { RecipeService, Recipe } from '../services/recipe.service';

/**
 * allows users to edit and like share etcc
 */
@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonButton, IonIcon, IonRefresher, IonRefresherContent,
    IonSpinner, IonGrid, IonRow, IonCol, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonBackButton
  ]
})
export class MyRecipesPage implements OnInit {
  userRecipes: Recipe[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {
    addIcons({add,restaurant,heart,heartOutline,trash,arrowDownOutline,arrowBack});
  }

  async ngOnInit() {
    await this.loadMyRecipes();
  }

  /**
   * Load user-created recipes
   */
  async loadMyRecipes(event?: any) {
    try {
      this.loading = true;
      this.error = null;
      
      this.userRecipes = await this.recipeService.getUserRecipes();
      
    } catch (error) {
      console.error('Failed to load my recipes:', error);
      this.error = 'Failed to load your recipes. Please try again.';
    } finally {
      this.loading = false;
      
      if (event && event.target) {
        event.target.complete();
      }
    }
  }

  /**
   * Navigate to recipe detail page
   */
  viewRecipe(recipeId: string) {
    this.router.navigate(['/recipe', recipeId]);
  }

  /**
   * Toggle favorite status of recipe
   */
  async toggleFavorite(recipe: Recipe, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await this.recipeService.toggleFavorite(recipe);
      recipe.isFavorite = !recipe.isFavorite;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }

  /**
   * Navigate to add recipe page
   */
  goToAddRecipe() {
    this.router.navigate(['/add']);
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Recipe';
  }

  /**
   * Track by function for performance
   */
  trackByRecipeId(index: number, recipe: Recipe): string {
    return recipe.id;
  }
}

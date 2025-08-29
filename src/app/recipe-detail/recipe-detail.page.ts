import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonButton, IonBackButton, IonIcon, IonChip, IonLabel, 
  IonList, IonItem, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, arrowBack, time, people, restaurant, list } from 'ionicons/icons';

import { RecipeService, Recipe } from '../services/recipe.service';

/**
 * gives detailed info about the recepies and the favourites function
 */
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonButton, IonBackButton, IonIcon, IonChip, IonLabel,
    IonList, IonItem, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonSpinner
  ]
})
export class RecipeDetailPage implements OnInit {
  recipe: Recipe | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {
    // Add required icons
    addIcons({ heart, heartOutline, arrowBack, time, people, restaurant, list });
  }

  async ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    
    if (!recipeId) {
      this.error = 'Recipe not found';
      this.loading = false;
      return;
    }

    await this.loadRecipe(recipeId);
  }

  /**
   * Load recipe data by ID
   * @param recipeId - ID of recipe to load
   */
  async loadRecipe(recipeId: string) {
    try {
      this.loading = true;
      this.error = null;
      
      // Fetch recipe data
      this.recipe = await this.recipeService.getRecipeById(recipeId);
      
      if (!this.recipe) {
        this.error = 'Recipe not found';
        return;
      }
      
      // Update favorite status
      const favoriteIds = await this.recipeService.getFavoriteIds();
      this.recipe.isFavorite = favoriteIds.includes(this.recipe.id);
      
    } catch (error) {
      console.error('Failed to load recipe:', error);
      this.error = 'Failed to load recipe. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Navigate back to previous page
   */
  goBack() {
    this.router.navigate(['/']);
  }

  /**
   * Toggle favorite status of current recipe
   */
  async toggleFavorite() {
    if (!this.recipe) return;

    try {
      await this.recipeService.toggleFavorite(this.recipe);
      this.recipe.isFavorite = !this.recipe.isFavorite;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }

  /**
   * Format instructions text for better readability
   * @param instructions - Raw instructions text
   * @returns Formatted instructions with line breaks
   */
  formatInstructions(instructions: string): string {
    return instructions
      .replace(/\r\n/g, '\n')
      .replace(/\.\s+/g, '.\n\n')
      .trim();
  }

  /**
   * Handle image loading errors
   * @param event - Error event
   */
  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Recipe';
  }
}

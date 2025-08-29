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
import { add, heart, trash, arrowDownOutline, arrowBack } from 'ionicons/icons';

import { RecipeService, Recipe } from '../services/recipe.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonButton, IonIcon, IonRefresher, IonRefresherContent,
    IonSpinner, IonGrid, IonRow, IonCol, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonBackButton
  ]
})
export class FavoritesPage implements OnInit {
  favorites: Recipe[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {
    addIcons({ add, heart, trash, arrowDownOutline, arrowBack });
  }

  async ngOnInit() {
    await this.loadFavorites();
  }

  async loadFavorites(event?: any) {
    try {
      this.loading = true;
      this.error = null;
      
      this.favorites = await this.recipeService.getFavorites();
      
    } catch (error) {
      console.error('Failed to load favorites:', error);
      this.error = 'Failed to load favorites. Please try again.';
    } finally {
      this.loading = false;
      
      if (event && event.target) {
        event.target.complete();
      }
    }
  }

  viewRecipe(recipeId: string) {
    this.router.navigate(['/recipe', recipeId]);
  }

  async removeFromFavorites(recipe: Recipe, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await this.recipeService.toggleFavorite(recipe);
      this.favorites = this.favorites.filter(fav => fav.id !== recipe.id);
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goToAddRecipe() {
    this.router.navigate(['/add']);
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Recipe';
  }

  trackByRecipeId(index: number, recipe: Recipe): string {
    return recipe.id;
  }
}

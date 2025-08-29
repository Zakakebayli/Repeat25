import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle,
  IonChip, IonLabel, IonRefresher, IonRefresherContent,
  IonSpinner, IonButtons, IonButton, IonIcon, IonGrid,
  IonRow, IonCol, IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, add, restaurant, bookmarks, moon, sunny, share } from 'ionicons/icons';

import { RecipeService, Recipe } from '../services/recipe.service';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle,
    IonChip, IonLabel, IonRefresher, IonRefresherContent,
    IonSpinner, IonButtons, IonButton, IonIcon, IonGrid,
    IonRow, IonCol, IonToast
  ]
})
export class HomePage implements OnInit {
  recipes: Recipe[] = [];
  searchQuery = '';
  loading = true;
  error: string | null = null;
  isDarkMode = false;
  showShareToast = false;
  shareMessage = '';

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private themeService: ThemeService
  ) {
    addIcons({ heart, heartOutline, add, restaurant, bookmarks, moon, sunny, share });
    this.isDarkMode = this.themeService.isDarkMode();
  }

  async ngOnInit() {
    await this.loadRecipes();
  }

  async loadRecipes(event?: any) {
    try {
      this.loading = true;
      this.error = null;
      
      this.recipes = await this.recipeService.getAllRecipes();
      
      // Check favorite status for each recipe
      const favoriteIds = await this.recipeService.getFavoriteIds();
      this.recipes.forEach(recipe => {
        recipe.isFavorite = favoriteIds.includes(recipe.id);
      });
      
    } catch (error) {
      console.error('Failed to load recipes:', error);
      this.error = 'Failed to load recipes. Please try again.';
    } finally {
      this.loading = false;
      if (event) {
        event.target.complete();
      }
    }
  }

  get filteredRecipes(): Recipe[] {
    if (!this.searchQuery.trim()) {
      return this.recipes;
    }

    const query = this.searchQuery.toLowerCase().trim();
    return this.recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.category.toLowerCase().includes(query) ||
      recipe.area.toLowerCase().includes(query)
    );
  }

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

  async shareRecipe(recipe: Recipe, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: recipe.name,
          text: `Check out this recipe: ${recipe.name}`,
          url: `https://yourapp.com/recipe/${recipe.id}`,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Web falll back
      this.shareMessage = `Shared recipe: ${recipe.name}`;
      this.showShareToast = true;
    }
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  goToMyRecipes() {
    this.router.navigate(['/my-recipes']);
  }

  goToAddRecipe() {
    this.router.navigate(['/add']);
  }

  viewRecipe(recipeId: string) {
    this.router.navigate(['/recipe', recipeId]);
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Recipe';
  }

  trackByRecipeId(index: number, recipe: Recipe): string {
    return recipe.id;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }
}

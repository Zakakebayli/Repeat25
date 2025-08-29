import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonButton, IonBackButton, IonIcon, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, 
  IonInput, IonTextarea, IonSpinner, IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, restaurant, save } from 'ionicons/icons';

import { RecipeService, Recipe } from '../services/recipe.service';

interface RecipeForm {
  name: string;
  category: string;
  area: string;
  thumbnail: string;
  ingredientsText: string;
  instructions: string;
}

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.page.html',
  styleUrls: ['./add-recipe.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonButton, IonBackButton, IonIcon, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, 
    IonInput, IonTextarea, IonSpinner, IonToast
  ]
})
export class AddRecipePage implements OnInit {
  form: RecipeForm = {
    name: '',
    category: '',
    area: '',
    thumbnail: '',
    ingredientsText: '',
    instructions: ''
  };

  saving = false;
  showSuccessToast = false;
  showErrorToast = false;

  constructor(
    private router: Router,
    private recipeService: RecipeService
  ) {
    addIcons({ arrowBack, restaurant, save });
  }

  ngOnInit() {}

  isFormValid(): boolean {
    return !!(
      this.form.name.trim() && 
      this.form.ingredientsText.trim() && 
      this.form.instructions.trim()
    );
  }

  async saveRecipe() {
    if (!this.isFormValid()) {
      return;
    }

    this.saving = true;

    try {
      // Split ingredients by new lines
      const ingredients = this.form.ingredientsText
        .split('\n')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);

      const newRecipe: Omit<Recipe, 'id'> = {
        name: this.form.name.trim(),
        category: this.form.category.trim() || 'User Recipe',
        area: this.form.area.trim() || 'Custom',
        thumbnail: this.form.thumbnail.trim() || 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Recipe',
        instructions: this.form.instructions.trim(),
        ingredients: ingredients,
        isFavorite: false
      };

      await this.recipeService.addRecipe(newRecipe);
      this.showSuccessToast = true;

      // goes back after saving
      setTimeout(() => {
        this.resetForm();
        this.router.navigate(['/']);
      }, 1500);

    } catch (error) {
      console.error('Failed to save recipe:', error);
      this.showErrorToast = true;
    } finally {
      this.saving = false;
    }
  }

  resetForm() {
    this.form = {
      name: '',
      category: '',
      area: '',
      thumbnail: '',
      ingredientsText: '',
      instructions: ''
    };
  }
}

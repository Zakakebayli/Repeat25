  import { Routes } from '@angular/router';

  export const routes: Routes = [
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      loadComponent: () => import('./home/home.page').then(m => m.HomePage)
    },
    {
      path: 'recipe/:id',
      loadComponent: () => import('./recipe-detail/recipe-detail.page').then(m => m.RecipeDetailPage)
    },
    {
      path: 'favorites',
      loadComponent: () => import('./favorites/favorites.page').then(m => m.FavoritesPage)
    },
    {
      path: 'my-recipes',
      loadComponent: () => import('./my-recipes/my-recipes.page').then(m => m.MyRecipesPage)
    },
    {
      path: 'add',
      loadComponent: () => import('./add-recipe/add-recipe.page').then(m => m.AddRecipePage)
    },
    {
      path: '**',
      redirectTo: '/home',
      pathMatch: 'full'
    }
  ];
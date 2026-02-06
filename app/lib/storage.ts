import { UserSettings, MealPlan } from '@/app/types';

const MAX_HISTORY_ENTRIES = 100;

export function getUserSettings(): UserSettings {
  if (typeof window === 'undefined') {
    return getDefaultSettings();
  }
  
  const stored = localStorage.getItem('userSettings');
  return stored ? JSON.parse(stored) : getDefaultSettings();
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }
}

export function getDefaultSettings(): UserSettings {
  return {
    allergies: [],
    dislikes: [],
    isVegetarian: false,
    isGlutenFree: false,
    isVegan: false,
    ignoreNGIngredients: false,
  };
}

export function getMealHistory(): MealPlan[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = localStorage.getItem('mealHistory');
  return stored ? JSON.parse(stored) : [];
}

export function saveMealToHistory(mealPlan: MealPlan): void {
  if (typeof window !== 'undefined') {
    const history = getMealHistory();
    history.unshift(mealPlan);
    // Keep only last MAX_HISTORY_ENTRIES entries
    if (history.length > MAX_HISTORY_ENTRIES) {
      history.pop();
    }
    localStorage.setItem('mealHistory', JSON.stringify(history));
  }
}

export function toggleFavorite(mealPlanId: string): void {
  if (typeof window !== 'undefined') {
    const history = getMealHistory();
    const plan = history.find(p => p.id === mealPlanId);
    if (plan) {
      plan.isFavorite = !plan.isFavorite;
      localStorage.setItem('mealHistory', JSON.stringify(history));
    }
  }
}

export function getFavorites(): MealPlan[] {
  return getMealHistory().filter(plan => plan.isFavorite);
}

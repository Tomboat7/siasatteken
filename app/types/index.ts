export interface UserSettings {
  allergies: string[];
  dislikes: string[];
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isVegan: boolean;
  ignoreNGIngredients: boolean;
}

export interface MealInput {
  breakfast?: string;
  lunch?: string;
  snack?: string;
  dinner?: string;
  additionalRequests?: string;
}

export interface Meal {
  name: string;
  description: string;
  ingredients: string[];
  nutrition: NutritionalInfo;
  imageUrl?: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export interface MealPlan {
  id: string;
  date: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack?: Meal;
  totalNutrition: NutritionalInfo;
  isFavorite: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

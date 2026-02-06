'use client';

import { Meal } from '@/app/types';
import Image from 'next/image';

interface MealCardProps {
  meal: Meal;
  mealType: string;
  onGenerateImage?: (mealName: string, description: string) => void;
  isGeneratingImage?: boolean;
}

export default function MealCard({ meal, mealType, onGenerateImage, isGeneratingImage }: MealCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-2 text-gray-800">{mealType}</h3>
      <h4 className="text-lg font-semibold mb-2 text-gray-700">{meal.name}</h4>
      
      {meal.imageUrl && (
        <div className="mb-4 relative w-full h-64">
          <Image
            src={meal.imageUrl}
            alt={meal.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      
      {!meal.imageUrl && onGenerateImage && (
        <button
          onClick={() => onGenerateImage(meal.name, meal.description)}
          disabled={isGeneratingImage}
          className="mb-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {isGeneratingImage ? '画像生成中...' : '画像を生成'}
        </button>
      )}
      
      <p className="text-gray-600 mb-4">{meal.description}</p>
      
      <div className="mb-4">
        <h5 className="font-semibold text-gray-700 mb-2">材料:</h5>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          {meal.ingredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div className="border-t pt-4">
        <h5 className="font-semibold text-gray-700 mb-2">栄養価:</h5>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>カロリー: {meal.nutrition.calories}kcal</div>
          <div>タンパク質: {meal.nutrition.protein}g</div>
          <div>炭水化物: {meal.nutrition.carbs}g</div>
          <div>脂質: {meal.nutrition.fat}g</div>
          <div>食物繊維: {meal.nutrition.fiber}g</div>
          <div>塩分: {meal.nutrition.sodium}mg</div>
        </div>
      </div>
    </div>
  );
}

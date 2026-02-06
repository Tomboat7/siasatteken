'use client';

import { MealPlan } from '@/app/types';
import MealCard from './MealCard';

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
  onSaveToHistory: () => void;
  onToggleFavorite: () => void;
  onGenerateImage: (mealType: string, mealName: string, description: string) => void;
  generatingImageFor?: string;
}

export default function MealPlanDisplay({
  mealPlan,
  onSaveToHistory,
  onToggleFavorite,
  onGenerateImage,
  generatingImageFor,
}: MealPlanDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">本日の献立</h2>
        <div className="flex gap-2">
          <button
            onClick={onToggleFavorite}
            className={`px-4 py-2 rounded-lg ${
              mealPlan.isFavorite
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:opacity-80`}
          >
            {mealPlan.isFavorite ? '★ お気に入り' : '☆ お気に入りに追加'}
          </button>
          <button
            onClick={onSaveToHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            履歴に保存
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MealCard
          meal={mealPlan.breakfast}
          mealType="朝食"
          onGenerateImage={(name, desc) => onGenerateImage('breakfast', name, desc)}
          isGeneratingImage={generatingImageFor === 'breakfast'}
        />
        <MealCard
          meal={mealPlan.lunch}
          mealType="昼食"
          onGenerateImage={(name, desc) => onGenerateImage('lunch', name, desc)}
          isGeneratingImage={generatingImageFor === 'lunch'}
        />
        {mealPlan.snack && (
          <MealCard
            meal={mealPlan.snack}
            mealType="間食"
            onGenerateImage={(name, desc) => onGenerateImage('snack', name, desc)}
            isGeneratingImage={generatingImageFor === 'snack'}
          />
        )}
        <MealCard
          meal={mealPlan.dinner}
          mealType="夕食"
          onGenerateImage={(name, desc) => onGenerateImage('dinner', name, desc)}
          isGeneratingImage={generatingImageFor === 'dinner'}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">1日の合計栄養価</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">総カロリー</div>
            <div className="text-2xl font-bold">{mealPlan.totalNutrition.calories}</div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">タンパク質</div>
            <div className="text-2xl font-bold">{mealPlan.totalNutrition.protein}</div>
            <div className="text-xs text-gray-500">g</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">炭水化物</div>
            <div className="text-2xl font-bold">{mealPlan.totalNutrition.carbs}</div>
            <div className="text-xs text-gray-500">g</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">脂質</div>
            <div className="text-2xl font-bold">{mealPlan.totalNutrition.fat}</div>
            <div className="text-xs text-gray-500">g</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">食物繊維</div>
            <div className="text-2xl font-bold">{mealPlan.totalNutrition.fiber}</div>
            <div className="text-xs text-gray-500">g</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">塩分</div>
            <div className="text-2xl font-bold">{mealPlan.totalNutrition.sodium}</div>
            <div className="text-xs text-gray-500">mg</div>
          </div>
        </div>
      </div>
    </div>
  );
}

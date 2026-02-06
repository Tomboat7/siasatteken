'use client';

import { useState, useEffect } from 'react';
import { getMealHistory, getFavorites, toggleFavorite } from '@/app/lib/storage';
import { MealPlan } from '@/app/types';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<MealPlan[]>([]);
  const [favorites, setFavorites] = useState<MealPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHistory(getMealHistory());
    setFavorites(getFavorites());
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    loadData();
  };

  const displayedPlans = activeTab === 'history' ? history : favorites;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← トップページに戻る
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">履歴とお気に入り</h1>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            履歴 ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'favorites'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            お気に入り ({favorites.length})
          </button>
        </div>

        {displayedPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              {activeTab === 'history'
                ? 'まだ履歴がありません'
                : 'まだお気に入りがありません'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayedPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{plan.date}</p>
                    <h3 className="text-xl font-bold text-gray-800">献立プラン</h3>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(plan.id)}
                    className={`px-4 py-2 rounded-lg ${
                      plan.isFavorite
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    } hover:opacity-80`}
                  >
                    {plan.isFavorite ? '★' : '☆'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">朝食</h4>
                    <p className="text-sm text-gray-600">{plan.breakfast.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {plan.breakfast.nutrition.calories}kcal
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">昼食</h4>
                    <p className="text-sm text-gray-600">{plan.lunch.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {plan.lunch.nutrition.calories}kcal
                    </p>
                  </div>
                  {plan.snack && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2">間食</h4>
                      <p className="text-sm text-gray-600">{plan.snack.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {plan.snack.nutrition.calories}kcal
                      </p>
                    </div>
                  )}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">夕食</h4>
                    <p className="text-sm text-gray-600">{plan.dinner.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {plan.dinner.nutrition.calories}kcal
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">1日の合計栄養価</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">カロリー</div>
                      <div className="font-semibold">{plan.totalNutrition.calories}kcal</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">タンパク質</div>
                      <div className="font-semibold">{plan.totalNutrition.protein}g</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">炭水化物</div>
                      <div className="font-semibold">{plan.totalNutrition.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">脂質</div>
                      <div className="font-semibold">{plan.totalNutrition.fat}g</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">食物繊維</div>
                      <div className="font-semibold">{plan.totalNutrition.fiber}g</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">塩分</div>
                      <div className="font-semibold">{plan.totalNutrition.sodium}mg</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

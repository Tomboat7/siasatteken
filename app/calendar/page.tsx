'use client';

import { useState, useEffect } from 'react';
import { getMealHistory } from '@/app/lib/storage';
import { MealPlan, NutritionalInfo } from '@/app/types';
import Link from 'next/link';

export default function CalendarPage() {
  const [history, setHistory] = useState<MealPlan[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setHistory(getMealHistory());
  }, []);

  const getMealForDate = (date: string): MealPlan | undefined => {
    return history.find((plan) => plan.date === date);
  };

  const calculatePeriodNutrition = (): NutritionalInfo => {
    const emptyNutrition: NutritionalInfo = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
    };

    let plansInPeriod: MealPlan[] = [];
    const selected = new Date(selectedDate);

    if (selectedPeriod === 'day') {
      const plan = getMealForDate(selectedDate);
      return plan ? plan.totalNutrition : emptyNutrition;
    } else if (selectedPeriod === 'week') {
      const startOfWeek = new Date(selected);
      startOfWeek.setDate(selected.getDate() - selected.getDay());
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const plan = getMealForDate(dateStr);
        if (plan) plansInPeriod.push(plan);
      }
    } else if (selectedPeriod === 'month') {
      const year = selected.getFullYear();
      const month = selected.getMonth();
      
      plansInPeriod = history.filter((plan) => {
        const planDate = new Date(plan.date);
        return planDate.getFullYear() === year && planDate.getMonth() === month;
      });
    }

    return plansInPeriod.reduce(
      (total, plan) => ({
        calories: total.calories + plan.totalNutrition.calories,
        protein: total.protein + plan.totalNutrition.protein,
        carbs: total.carbs + plan.totalNutrition.carbs,
        fat: total.fat + plan.totalNutrition.fat,
        fiber: total.fiber + plan.totalNutrition.fiber,
        sodium: total.sodium + plan.totalNutrition.sodium,
      }),
      emptyNutrition
    );
  };

  const periodNutrition = calculatePeriodNutrition();
  const todayMeal = getMealForDate(selectedDate);

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

        <h1 className="text-3xl font-bold mb-8 text-gray-800">カレンダー・栄養記録</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                日付を選択
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                表示期間
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">1日</option>
                <option value="week">1週間</option>
                <option value="month">1ヶ月</option>
              </select>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {selectedPeriod === 'day' && `${selectedDate}の栄養価`}
            {selectedPeriod === 'week' && '1週間の合計栄養価'}
            {selectedPeriod === 'month' && '1ヶ月の合計栄養価'}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">総カロリー</div>
              <div className="text-3xl font-bold text-blue-600">
                {periodNutrition.calories}
              </div>
              <div className="text-xs text-gray-500">kcal</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">タンパク質</div>
              <div className="text-3xl font-bold text-green-600">
                {periodNutrition.protein}
              </div>
              <div className="text-xs text-gray-500">g</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">炭水化物</div>
              <div className="text-3xl font-bold text-yellow-600">
                {periodNutrition.carbs}
              </div>
              <div className="text-xs text-gray-500">g</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">脂質</div>
              <div className="text-3xl font-bold text-red-600">
                {periodNutrition.fat}
              </div>
              <div className="text-xs text-gray-500">g</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">食物繊維</div>
              <div className="text-3xl font-bold text-purple-600">
                {periodNutrition.fiber}
              </div>
              <div className="text-xs text-gray-500">g</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">塩分</div>
              <div className="text-3xl font-bold text-orange-600">
                {periodNutrition.sodium}
              </div>
              <div className="text-xs text-gray-500">mg</div>
            </div>
          </div>
        </div>

        {selectedPeriod === 'day' && todayMeal && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {selectedDate}の献立詳細
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">朝食</h4>
                <p className="text-sm text-gray-600 mb-2">{todayMeal.breakfast.name}</p>
                <p className="text-xs text-gray-500">
                  {todayMeal.breakfast.nutrition.calories}kcal
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">昼食</h4>
                <p className="text-sm text-gray-600 mb-2">{todayMeal.lunch.name}</p>
                <p className="text-xs text-gray-500">
                  {todayMeal.lunch.nutrition.calories}kcal
                </p>
              </div>
              {todayMeal.snack && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">間食</h4>
                  <p className="text-sm text-gray-600 mb-2">{todayMeal.snack.name}</p>
                  <p className="text-xs text-gray-500">
                    {todayMeal.snack.nutrition.calories}kcal
                  </p>
                </div>
              )}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">夕食</h4>
                <p className="text-sm text-gray-600 mb-2">{todayMeal.dinner.name}</p>
                <p className="text-xs text-gray-500">
                  {todayMeal.dinner.nutrition.calories}kcal
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedPeriod === 'day' && !todayMeal && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">この日の献立記録がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MealInputForm from './components/MealInputForm';
import MealPlanDisplay from './components/MealPlanDisplay';
import ChatInterface from './components/ChatInterface';
import { MealPlan, MealInput, ChatMessage, Meal } from './types';
import { getUserSettings, saveMealToHistory } from './lib/storage';

export default function Home() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);

  const generateMealPlan = async (mealInput: MealInput, conversationHistory: ChatMessage[] = []) => {
    setIsLoading(true);
    try {
      const userSettings = getUserSettings();
      
      const response = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealInput,
          userSettings,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('献立の生成に失敗しました');
      }

      const data = await response.json();
      
      // Create meal plan object
      const newMealPlan: MealPlan = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        breakfast: data.breakfast,
        lunch: data.lunch,
        dinner: data.dinner,
        snack: data.snack || undefined,
        totalNutrition: data.totalNutrition,
        isFavorite: false,
      };
      
      setMealPlan(newMealPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('献立の生成中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (input: MealInput) => {
    setChatMessages([]);
    generateMealPlan(input);
  };

  const handleChatMessage = async (message: string) => {
    if (!mealPlan) return;

    const newMessages: ChatMessage[] = [
      ...chatMessages,
      { role: 'user', content: message },
    ];
    setChatMessages(newMessages);

    // Regenerate meal plan with conversation context
    const mealInput: MealInput = {
      breakfast: mealPlan.breakfast.name,
      lunch: mealPlan.lunch.name,
      dinner: mealPlan.dinner.name,
      snack: mealPlan.snack?.name,
      additionalRequests: message,
    };

    await generateMealPlan(mealInput, newMessages);
  };

  const handleGenerateImage = async (mealType: string, mealName: string, description: string) => {
    if (!mealPlan) return;
    
    setGeneratingImageFor(mealType);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealName, mealDescription: description }),
      });

      if (!response.ok) {
        throw new Error('画像の生成に失敗しました');
      }

      const data = await response.json();
      
      // Update meal plan with image URL
      setMealPlan((prev) => {
        if (!prev) return prev;
        
        const updatedPlan = { ...prev };
        if (mealType === 'breakfast') {
          updatedPlan.breakfast = { ...prev.breakfast, imageUrl: data.imageUrl };
        } else if (mealType === 'lunch') {
          updatedPlan.lunch = { ...prev.lunch, imageUrl: data.imageUrl };
        } else if (mealType === 'snack' && prev.snack) {
          updatedPlan.snack = { ...prev.snack, imageUrl: data.imageUrl };
        } else if (mealType === 'dinner') {
          updatedPlan.dinner = { ...prev.dinner, imageUrl: data.imageUrl };
        }
        
        return updatedPlan;
      });
    } catch (error) {
      console.error('Error generating image:', error);
      alert('画像の生成中にエラーが発生しました');
    } finally {
      setGeneratingImageFor(null);
    }
  };

  const handleSaveToHistory = () => {
    if (mealPlan) {
      saveMealToHistory(mealPlan);
      alert('履歴に保存しました');
    }
  };

  const handleToggleFavorite = () => {
    if (mealPlan) {
      setMealPlan({ ...mealPlan, isFavorite: !mealPlan.isFavorite });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">AI献立プランナー</h1>
            <div className="flex gap-4">
              <Link
                href="/settings"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                設定
              </Link>
              <Link
                href="/history"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                履歴
              </Link>
              <Link
                href="/calendar"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                カレンダー
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                今日食べたいものは？
              </h2>
              <MealInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {mealPlan && (
              <ChatInterface
                onSendMessage={handleChatMessage}
                messages={chatMessages}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            {mealPlan ? (
              <MealPlanDisplay
                mealPlan={mealPlan}
                onSaveToHistory={handleSaveToHistory}
                onToggleFavorite={handleToggleFavorite}
                onGenerateImage={handleGenerateImage}
                generatingImageFor={generatingImageFor || undefined}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">
                  食べたいものを入力して、AIに献立を作成してもらいましょう！
                </p>
                <p className="text-gray-400 text-sm">
                  栄養バランスを考慮した最適な献立を提案します
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

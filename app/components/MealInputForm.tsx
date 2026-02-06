'use client';

import { useState } from 'react';
import { MealInput } from '@/app/types';

interface MealInputFormProps {
  onSubmit: (input: MealInput) => void;
  isLoading: boolean;
}

export default function MealInputForm({ onSubmit, isLoading }: MealInputFormProps) {
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [snack, setSnack] = useState('');
  const [dinner, setDinner] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      breakfast: breakfast || undefined,
      lunch: lunch || undefined,
      snack: snack || undefined,
      dinner: dinner || undefined,
      additionalRequests: additionalRequests || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          朝食に食べたいもの
        </label>
        <input
          type="text"
          value={breakfast}
          onChange={(e) => setBreakfast(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: コロッケサンド"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          昼食に食べたいもの
        </label>
        <input
          type="text"
          value={lunch}
          onChange={(e) => setLunch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: ラーメン"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          間食に食べたいもの
        </label>
        <input
          type="text"
          value={snack}
          onChange={(e) => setSnack(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: ポテチ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          夕食に食べたいもの
        </label>
        <input
          type="text"
          value={dinner}
          onChange={(e) => setDinner(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: ハンバーグ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          その他の要望
        </label>
        <textarea
          value={additionalRequests}
          onChange={(e) => setAdditionalRequests(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 朝は少なくしたい、野菜を多めに、など"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
      >
        {isLoading ? '献立を作成中...' : '献立を作成する'}
      </button>
    </form>
  );
}

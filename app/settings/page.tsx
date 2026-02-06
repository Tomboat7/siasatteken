'use client';

import { useState, useEffect } from 'react';
import { getUserSettings, saveUserSettings } from '@/app/lib/storage';
import { UserSettings } from '@/app/types';
import Link from 'next/link';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    allergies: [],
    dislikes: [],
    isVegetarian: false,
    isGlutenFree: false,
    isVegan: false,
    ignoreNGIngredients: false,
  });
  
  const [allergyInput, setAllergyInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getUserSettings());
  }, []);

  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      setSettings({
        ...settings,
        allergies: [...settings.allergies, allergyInput.trim()],
      });
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setSettings({
      ...settings,
      allergies: settings.allergies.filter((_, i) => i !== index),
    });
  };

  const handleAddDislike = () => {
    if (dislikeInput.trim()) {
      setSettings({
        ...settings,
        dislikes: [...settings.dislikes, dislikeInput.trim()],
      });
      setDislikeInput('');
    }
  };

  const handleRemoveDislike = (index: number) => {
    setSettings({
      ...settings,
      dislikes: settings.dislikes.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    saveUserSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← トップページに戻る
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザー設定</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">食事制限</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.isVegetarian}
                onChange={(e) =>
                  setSettings({ ...settings, isVegetarian: e.target.checked })
                }
                className="w-5 h-5"
              />
              <span className="text-gray-700">ベジタリアン</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.isVegan}
                onChange={(e) =>
                  setSettings({ ...settings, isVegan: e.target.checked })
                }
                className="w-5 h-5"
              />
              <span className="text-gray-700">ヴィーガン</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.isGlutenFree}
                onChange={(e) =>
                  setSettings({ ...settings, isGlutenFree: e.target.checked })
                }
                className="w-5 h-5"
              />
              <span className="text-gray-700">グルテンフリー</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">アレルギー食材</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
              placeholder="アレルギー食材を入力"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddAllergy}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              追加
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings.allergies.map((allergy, index) => (
              <div
                key={index}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span>{allergy}</span>
                <button
                  onClick={() => handleRemoveAllergy(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">苦手な食材</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={dislikeInput}
              onChange={(e) => setDislikeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDislike()}
              placeholder="苦手な食材を入力"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddDislike}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              追加
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings.dislikes.map((dislike, index) => (
              <div
                key={index}
                className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span>{dislike}</span>
                <button
                  onClick={() => handleRemoveDislike(index)}
                  className="text-yellow-500 hover:text-yellow-700 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.ignoreNGIngredients}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  ignoreNGIngredients: e.target.checked,
                })
              }
              className="w-5 h-5"
            />
            <div>
              <div className="text-gray-700 font-semibold">NG食材設定を無視する</div>
              <div className="text-sm text-gray-500">
                チェックすると、アレルギーや苦手な食材の設定を無視して献立を作成します
              </div>
            </div>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            設定を保存
          </button>
          {saved && (
            <div className="flex items-center text-green-600 font-semibold">
              ✓ 保存しました
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const { mealInput, userSettings, conversationHistory } = await req.json();

    // Build the system prompt with user settings
    let systemPrompt = `あなたは栄養士AIです。ユーザーの希望を全て取り入れつつ、一日の栄養バランスを最適化した献立を提案してください。

以下の形式でJSON形式で返してください：
{
  "breakfast": {
    "name": "朝食名",
    "description": "詳細な説明",
    "ingredients": ["材料1", "材料2", ...],
    "nutrition": {
      "calories": カロリー数,
      "protein": タンパク質(g),
      "carbs": 炭水化物(g),
      "fat": 脂質(g),
      "fiber": 食物繊維(g),
      "sodium": 塩分(mg)
    }
  },
  "lunch": { ... },
  "dinner": { ... },
  "snack": { ... },
  "totalNutrition": {
    "calories": 合計カロリー,
    "protein": 合計タンパク質(g),
    "carbs": 合計炭水化物(g),
    "fat": 合計脂質(g),
    "fiber": 合計食物繊維(g),
    "sodium": 合計塩分(mg)
  },
  "advice": "栄養面でのアドバイス"
}`;

    if (!userSettings.ignoreNGIngredients) {
      if (userSettings.allergies && userSettings.allergies.length > 0) {
        systemPrompt += `\n\nアレルギー: ${userSettings.allergies.join(', ')}は絶対に使用しないでください。`;
      }
      if (userSettings.dislikes && userSettings.dislikes.length > 0) {
        systemPrompt += `\n\n苦手な食材: ${userSettings.dislikes.join(', ')}は可能な限り避けてください。`;
      }
      if (userSettings.isVegetarian) {
        systemPrompt += '\n\nベジタリアン対応：肉類・魚類は使用しないでください。';
      }
      if (userSettings.isVegan) {
        systemPrompt += '\n\nヴィーガン対応：動物性食品は一切使用しないでください。';
      }
      if (userSettings.isGlutenFree) {
        systemPrompt += '\n\nグルテンフリー対応：小麦、大麦、ライ麦などのグルテンを含む食材は使用しないでください。';
      }
    }

    // Build the user message
    let userMessage = '以下の希望で献立を作成してください：\n\n';
    if (mealInput.breakfast) userMessage += `朝食: ${mealInput.breakfast}\n`;
    if (mealInput.lunch) userMessage += `昼食: ${mealInput.lunch}\n`;
    if (mealInput.snack) userMessage += `間食: ${mealInput.snack}\n`;
    if (mealInput.dinner) userMessage += `夕食: ${mealInput.dinner}\n`;
    if (mealInput.additionalRequests) userMessage += `\nその他の要望: ${mealInput.additionalRequests}`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history if exists
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    messages.push({ role: 'user', content: userMessage });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    const mealPlan = JSON.parse(response || '{}');

    return NextResponse.json(mealPlan);
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { generateGeminiText } from '@/lib/gemini';

export async function POST(request) {
  const { question, hintNumber } = await request.json();

  const prompt = `Give a ${hintNumber === 1 ? 'subtle' : 'more obvious'} hint for this CS question without revealing the answer: "${question}". Keep it to 1-2 sentences.`;

  try {
    const hint =
      (await generateGeminiText({
        prompt,
        temperature: 0.7,
        maxOutputTokens: 150,
      })) || 'Think carefully about the data structure involved.';

    return NextResponse.json({ hint });
  } catch (err) {
    console.error('Hint generation failed:', err.message);
    return NextResponse.json({ hint: 'Consider the execution order step by step.' });
  }
}

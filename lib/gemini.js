const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

export async function generateGeminiText({
  prompt,
  temperature = 0.2,
  maxOutputTokens = 400,
  responseMimeType,
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in .env.local');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens,
        ...(responseMimeType ? { responseMimeType } : {}),
      },
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.candidates?.length) {
    const quotaReason =
      response.status === 429
        ? 'This API key is currently being charged against Gemini API free-tier quota. If you already pay on Google Cloud, that does not automatically upgrade an AI Studio API key. Use a billed Gemini API project/key or switch this app to Vertex AI service-account auth.'
        : null;

    console.error('Gemini API error:', JSON.stringify(data));
    throw new Error(quotaReason || data.error?.message || `HTTP ${response.status}`);
  }

  return data.candidates[0]?.content?.parts?.[0]?.text?.trim() || '';
}

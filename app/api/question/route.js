import { NextResponse } from 'next/server';
import { generateGeminiText } from '@/lib/gemini';

const Q_TYPES = ['mcq', 'predict_output'];
const DIFFICULTIES = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard', 'Medium', 'Hard', 'Easy', 'Medium', 'Hard'];

export async function POST(request) {
  const { topics } = await request.json();
  const safeTopics = Array.isArray(topics) && topics.length > 0 ? topics : ['General CS'];
  const topicList = safeTopics.join(', ');

  const prompt = `Create exactly 10 CS practice questions for a student about these topics: ${topicList}.

Question requirements:
- Return a JSON array of exactly 10 question objects.
- Alternate types in this order across the 10 questions: mcq, predict_output, mcq, predict_output, mcq, predict_output, mcq, predict_output, mcq, predict_output.
- Use these difficulties by position: 1:Easy, 2:Easy, 3:Medium, 4:Medium, 5:Hard, 6:Medium, 7:Hard, 8:Easy, 9:Medium, 10:Hard.
- Each question must focus on conceptual understanding, debugging, complexity, code reasoning, or best practices.
- Each question must include exactly 4 options and a valid correctIndex from 0 to 3.
- For predict_output questions, include a short JavaScript or Python snippet no longer than 12 lines.
- Use one of the provided topics in each question's topic field.
- Explanations should be 2-3 sentences.

Return ONLY valid JSON (no markdown, no backticks) in this shape:
[
  {
    "type": "mcq",
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct and the others are wrong (2-3 sentences).",
    "topic": "${safeTopics[0]}",
    "difficulty": "Easy"
  },
  {
    "type": "predict_output",
    "language": "JavaScript",
    "code": "code here (use \\n for newlines)",
    "question": "What does this code output?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Step-by-step explanation (2-3 sentences).",
    "topic": "${safeTopics[0]}",
    "difficulty": "Easy"
  }
]`;

  try {
    const text = await generateGeminiText({
      prompt,
      temperature: 0,
      maxOutputTokens: 4000,
      responseMimeType: 'application/json',
    });

    const clean = text.replace(/```json|```/g, '').trim();
    const questions = normalizeQuestions(JSON.parse(clean), safeTopics);
    return NextResponse.json(questions);
  } catch (err) {
    console.error('Question generation failed:', err.message);
    return NextResponse.json(getFallbackQuestions(safeTopics));
  }
}

function normalizeQuestions(questions, topics) {
  if (!Array.isArray(questions)) {
    throw new Error('Question response was not an array.');
  }

  return Array.from({ length: 10 }, (_, index) => {
    const fallback = getFallbackQuestion(index, topics[index % topics.length]);
    const candidate = questions[index] ?? {};

    return {
      ...fallback,
      ...candidate,
      topic: candidate.topic || fallback.topic,
      difficulty: candidate.difficulty || fallback.difficulty,
      options:
        Array.isArray(candidate.options) && candidate.options.length === 4
          ? candidate.options
          : fallback.options,
      correctIndex:
        Number.isInteger(candidate.correctIndex) &&
        candidate.correctIndex >= 0 &&
        candidate.correctIndex < 4
          ? candidate.correctIndex
          : fallback.correctIndex,
    };
  });
}

function getFallbackQuestions(topics) {
  return Array.from({ length: 10 }, (_, index) =>
    getFallbackQuestion(index, topics[index % topics.length])
  );
}

function getFallbackQuestion(index, topic) {
  const type = Q_TYPES[index % 2];
  const difficulty = DIFFICULTIES[index];

  if (type === 'mcq') {
    return {
      type: 'mcq',
      question: 'What is the average time complexity of searching in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 1,
      explanation: 'A balanced BST halves the search space at each step, giving O(log n). Only hash tables offer O(1) average search.',
      topic,
      difficulty,
    };
  }

  return {
    type: 'predict_output',
    language: 'JavaScript',
    code: 'const a = [1, 2, 3];\nconst b = a;\nb.push(4);\nconsole.log(a.length);',
    question: 'What does this code output?',
    options: ['3', '4', 'undefined', 'ReferenceError'],
    correctIndex: 1,
    explanation: 'Arrays are objects, so assignment copies the reference. b and a point to the same array, so push affects both.',
    topic,
    difficulty,
  };
}

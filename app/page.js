'use client';

import { useState, useCallback, useEffect } from 'react';
import TopicSelection from '@/components/topic-selection/TopicSelection';
import Dashboard from '@/components/dashboard/Dashboard';
import PracticeScreen from '@/components/practice/PracticeScreen';
import Summary from '@/components/summary/Summary';
import TopNav from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';

export default function Home() {
  const [screen, setScreen] = useState('topics');   // 'topics' | 'dashboard' | 'practice' | 'summary'
  const [playerName, setPlayerName] = useState('MasterArch');
  const [topics, setTopics] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [wrong, setWrong] = useState(0);

  useEffect(() => {
    const storedName = window.localStorage.getItem('skillpulse-player-name');

    if (storedName) {
      setPlayerName(storedName);
      return;
    }

    const generatedName = `Player-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    window.localStorage.setItem('skillpulse-player-name', generatedName);
    setPlayerName(generatedName);
  }, []);

  const handleStart = useCallback((selected) => {
    setTopics(selected);
    setSessionId(crypto.randomUUID());
    setQuestions([]);
    setQuestionIndex(0);
    setCorrect(0);
    setRevealed(0);
    setWrong(0);
    setScreen('dashboard');
  }, []);

  const handleAnswer = useCallback((isCorrect, wasRevealed) => {
    if (wasRevealed)     setRevealed((r) => r + 1);
    else if (isCorrect)  setCorrect((c) => c + 1);
    else                 setWrong((w) => w + 1);

    if (questionIndex >= 9) {
      setScreen('summary');
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }, [questionIndex]);

  const questionsDone = screen === 'summary' ? 10 : questionIndex;
  const showShell = screen !== 'topics';

  return (
    <>
      <TopNav questionsDone={questionsDone} playerName={playerName} />

      {showShell && (
        <Sidebar
          activeScreen={screen}
          onNavigate={(target) => {
            if (target === 'dashboard') setScreen('dashboard');
            if (target === 'practice')  setScreen('practice');
          }}
        />
      )}

      <main style={{ paddingTop: 52, marginLeft: showShell ? 200 : 0 }}>
        {screen === 'topics' && (
          <TopicSelection onStart={handleStart} />
        )}
        {screen === 'dashboard' && (
          <Dashboard
            topics={topics}
            questionsDone={questionsDone}
            correctCount={correct}
            onContinue={() => setScreen('practice')}
            onEditTopics={() => setScreen('topics')}
          />
        )}
        {screen === 'practice' && (
          <PracticeScreen
            topics={topics}
            questions={questions}
            setQuestions={setQuestions}
            questionIndex={questionIndex}
            onAnswer={handleAnswer}
            onBack={() => setScreen('dashboard')}
          />
        )}
        {screen === 'summary' && (
          <Summary
            sessionId={sessionId}
            playerName={playerName}
            topics={topics}
            correct={correct}
            revealed={revealed}
            wrong={wrong}
            onNewSession={() => setScreen('topics')}
          />
        )}
      </main>
    </>
  );
}

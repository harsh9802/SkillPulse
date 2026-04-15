'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import QuestionCard from './QuestionCard';
import { Spinner } from '@/components/layout/UI';
import styles from './PracticeScreen.module.css';

export default function PracticeScreen({
  topics,
  questions,
  setQuestions,
  questionIndex,
  onAnswer,
  onBack,
}) {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [hintUsed, setHintUsed] = useState(0);
  const [hintText, setHintText] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [timer, setTimer] = useState(0);
  const [wasRevealed, setWasRevealed] = useState(false);

  const timerRef = useRef(null);
  const question = questions[questionIndex] ?? null;

  useEffect(() => {
    let cancelled = false;

    setSelected(null);
    setHintUsed(0);
    setHintText(null);
    setWasRevealed(false);
    setTimer(0);

    if (questions.length === 10) {
      setLoading(false);
    } else {
      setLoading(true);
      fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (!cancelled) {
            setQuestions(Array.isArray(data) ? data : []);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) setLoading(false);
        });
    }

    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);

    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
    };
  }, [questionIndex, questions.length, setQuestions, topics]);

  const handleSelect = useCallback((idx) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(idx);
  }, [selected]);

  const handleReveal = useCallback(() => {
    if (!question || selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(question.correctIndex);
    setWasRevealed(true);
  }, [question, selected]);

  const handleGetHint = useCallback(async () => {
    if (!question || hintUsed >= 2 || selected !== null || loadingHint) return;
    setLoadingHint(true);
    const nextHintNum = hintUsed + 1;

    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.question, hintNumber: nextHintNum }),
      });
      const data = await res.json();
      setHintText(data.hint);
    } catch {
      setHintText('Think carefully about the data structure involved.');
    }

    setHintUsed((h) => h + 1);
    setLoadingHint(false);
  }, [question, hintUsed, selected, loadingHint]);

  const handleNext = useCallback(() => {
    if (selected === null || !question) return;
    const isCorrect = !wasRevealed && selected === question.correctIndex;
    onAnswer(isCorrect, wasRevealed);
  }, [selected, question, onAnswer, wasRevealed]);

  const segments = Array.from({ length: 10 }, (_, i) => ({
    done: i < questionIndex,
    active: i === questionIndex,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.progressBar}>
        {segments.map((s, i) => (
          <div
            key={i}
            className={`${styles.segment} ${s.done ? styles.segDone : s.active ? styles.segActive : ''}`}
          />
        ))}
      </div>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>Back to Dashboard</button>
        <span className={styles.qCounter}>Question {questionIndex + 1} / 10</span>
      </div>

      <div className={styles.content}>
        {loading && (
          <div className={styles.loadingState}>
            <Spinner />
            <span className={styles.loadingText}>Generating 10 questions...</span>
          </div>
        )}

        {!loading && !question && (
          <div className={styles.loadingState}>
            <span className={styles.loadingText}>Failed to load questions. Please refresh.</span>
          </div>
        )}

        {!loading && question && (
          <QuestionCard
            question={question}
            selected={selected}
            onSelect={handleSelect}
            hintText={hintText}
            hintUsed={hintUsed}
            loadingHint={loadingHint}
            onGetHint={handleGetHint}
            onReveal={handleReveal}
            onNext={handleNext}
            isLast={questionIndex >= 9}
            timer={timer}
          />
        )}
      </div>
    </div>
  );
}

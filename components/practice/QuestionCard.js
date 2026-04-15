'use client';

import CodeBlock from './CodeBlock';
import { Chip, BtnPrimary, BtnGhost } from '@/components/layout/UI';
import styles from './QuestionCard.module.css';

const LETTER = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  selected,
  onSelect,
  hintText,
  hintUsed,
  loadingHint,
  onGetHint,
  onReveal,
  onNext,
  isLast,
  timer,
}) {
  const diffVariant = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }[question.difficulty] ?? 'easy';
  const answered = selected !== null;

  return (
    <div className={styles.wrapper}>
      {/* ── Meta row ── */}
      <div className={styles.meta}>
        <div className={styles.metaLeft}>
          <Chip variant={diffVariant}>{question.difficulty}</Chip>
          <span className={styles.qType}>
            {question.type === 'mcq' ? 'MCQ' : 'Predict Output'}
          </span>
          <span className={styles.topic}>{question.topic}</span>
        </div>
        <span className={styles.timer}>
          ⏱ {String(Math.floor(timer / 60)).padStart(2, '0')}:
          {String(timer % 60).padStart(2, '0')}
        </span>
      </div>

      {/* ── Question body ── */}
      <div className={styles.body}>
        <p className={styles.questionText}>{question.question}</p>

        {question.type === 'predict_output' && question.code && (
          <CodeBlock code={question.code} language={question.language ?? 'JavaScript'} />
        )}
      </div>

      {/* ── Hint banner ── */}
      {hintText && (
        <div className={styles.hintBanner}>
          <span className={styles.hintIcon}>💡</span>
          <p>{hintText}</p>
        </div>
      )}

      {/* ── Options ── */}
      <div className={styles.options}>
        {question.options.map((opt, i) => {
          const isCorrect  = i === question.correctIndex;
          const isSelected = selected === i;
          let state = '';
          if (answered) {
            if (isCorrect)       state = styles.optCorrect;
            else if (isSelected) state = styles.optWrong;
            else                 state = styles.optDimmed;
          }

          return (
            <button
              key={i}
              className={`${styles.option} ${state}`}
              onClick={() => !answered && onSelect(i)}
              disabled={answered}
            >
              <span className={`${styles.letter} ${answered && isCorrect ? styles.letterCorrect : answered && isSelected ? styles.letterWrong : ''}`}>
                {answered ? (isCorrect ? '✓' : isSelected ? '✗' : LETTER[i]) : LETTER[i]}
              </span>
              <span className={styles.optText}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* ── Explanation ── */}
      {answered && (
        <div className={styles.explanation}>
          <span className={styles.explainLabel}>Explanation</span>
          <p className={styles.explainText}>{question.explanation}</p>
        </div>
      )}

      {/* ── Action row ── */}
      <div className={styles.actions}>
        <div className={styles.actionsLeft}>
          <button
            className={styles.hintBtn}
            onClick={onGetHint}
            disabled={hintUsed >= 2 || answered || loadingHint}
          >
            {loadingHint ? '...' : `💡 Hint ${hintUsed}/2`}
          </button>

          {!answered && (
            <button className={styles.revealBtn} onClick={onReveal}>
              👁 Reveal Answer
            </button>
          )}
        </div>

        {answered && (
          <BtnPrimary onClick={onNext}>
            {isLast ? 'View Summary →' : 'Next Question →'}
          </BtnPrimary>
        )}
      </div>
    </div>
  );
}

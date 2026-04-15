'use client';

import { TOPICS } from '@/lib/constants';
import { Card, CardSm, BtnPrimary, PulsingDot, Label } from '@/components/layout/UI';
import styles from './Dashboard.module.css';

export default function Dashboard({ topics, questionsDone, correctCount, onContinue, onEditTopics }) {
  const efficiency = questionsDone === 0 ? 0 : Math.round((correctCount / questionsDone) * 100);
  const efficiencyColor =
    efficiency >= 70 ? 'var(--secondary)' : efficiency >= 40 ? 'var(--tertiary)' : 'var(--error)';

  return (
    <div className={styles.page}>
      {/* Welcome hero */}
      <Card className={styles.welcome}>
        <div className={styles.sessionLabel}>
          <PulsingDot /> Session Active
        </div>
        <h1 className={styles.welcomeTitle}>Welcome back, Architect.</h1>
        <p className={styles.welcomeDesc}>
          Your neural path is clear. Complete today&apos;s logic sequences to maintain your streak and unlock the &apos;Compiler&apos; badge.
        </p>
        <div className={styles.xpRow}>
          <div>
            <Label>Total Experience</Label>
            <div className={styles.xpValue}>
              12,450 <span className={styles.xpUnit}>pts</span>
            </div>
          </div>
          <BtnPrimary onClick={onContinue}>Continue Sequence →</BtnPrimary>
        </div>
      </Card>

      {/* Two-column grid */}
      <div className={styles.grid}>
        {/* Daily Matrix */}
        <Card>
          <div className={styles.matrixHeader}>
            <h3 className={styles.sectionTitle}>Daily Matrix</h3>
            <span className={styles.matrixCounter}>{questionsDone}/10</span>
          </div>

          <div className={styles.matrixGrid}>
            {Array.from({ length: 10 }, (_, i) => {
              const done   = i < questionsDone;
              const active = i === questionsDone;
              return (
                <div
                  key={i}
                  className={`${styles.matrixCell} ${done ? styles.cellDone : active ? styles.cellActive : styles.cellLocked}`}
                  onClick={() => active && onContinue()}
                  style={{ cursor: active ? 'pointer' : 'default' }}
                >
                  <span className={styles.cellNum}>{i + 1}</span>
                  <span className={styles.cellStatus}>
                    {done ? 'DONE' : active ? 'NOW' : '—'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.efficiencyBar}>
            <Label>Daily Efficiency</Label>
            <span className={styles.efficiencyVal} style={{ color: efficiencyColor }}>
              {efficiency}%
            </span>
          </div>
        </Card>

        {/* Right column */}
        <div className={styles.rightCol}>
          <Card className={styles.statsCard}>
            <h3 className={styles.sectionTitle} style={{ marginBottom: 14 }}>Runtime Stats</h3>
            {[
              ['Last Compilation', 'Success',           'var(--secondary)'],
              ['Avg Response',     '14ms',               'var(--on-surface)'],
              ['Questions Left',   `${10 - questionsDone}`, 'var(--primary)'],
            ].map(([key, val, color]) => (
              <div key={key} className={styles.statRow}>
                <span className={styles.statKey}>{key}</span>
                <span className={styles.statVal} style={{ color }}>{val}</span>
              </div>
            ))}
          </Card>

          <CardSm className={styles.milestoneCard}>
            <div className={styles.milestoneIcon}>🏆</div>
            <div>
              <Label style={{ color: 'var(--tertiary)' }}>Next Milestone</Label>
              <div className={styles.milestoneVal}>15/20 Correct Submissions</div>
            </div>
          </CardSm>
        </div>
      </div>

      {/* Topic tracks */}
      <Card className={styles.tracksCard}>
        <div className={styles.tracksHeader}>
          <h3 className={styles.sectionTitle}>Your Practice Tracks</h3>
          <button className={styles.editBtn} onClick={onEditTopics}>Edit Interests</button>
        </div>
        <div className={styles.chips}>
          {topics.map((id) => {
            const t = TOPICS.find((t) => t.id === id);
            return t ? (
              <div key={id} className={styles.trackChip}>
                <span>{t.icon}</span>
                {t.label}
              </div>
            ) : null;
          })}
        </div>
      </Card>
    </div>
  );
}

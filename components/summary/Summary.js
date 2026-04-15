'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, BtnPrimary, BtnGhost, PulsingDot } from '@/components/layout/UI';
import styles from './Summary.module.css';

const FALLBACK_LEADERBOARD = [
  { rank: 1, initial: 'A', name: 'Aeron_Flux', points: 24590 },
  { rank: 2, initial: 'V', name: 'VectorNode', points: 23810 },
  { rank: 3, initial: 'Q', name: 'Quantum_Leap', points: 23400 },
];

function useCountdown(initial) {
  const [secs, setSecs] = useState(initial);

  useEffect(() => {
    const timerId = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timerId);
  }, []);

  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;

  return `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
}

export default function Summary({
  sessionId,
  playerName,
  topics,
  correct,
  revealed,
  wrong,
  onNewSession,
}) {
  const countdown = useCountdown(14 * 3600 + 22 * 60 + 9);
  const earnedPts = Math.max(0, correct * 200 - wrong * 50);
  const [leaderboard, setLeaderboard] = useState(FALLBACK_LEADERBOARD);
  const [playerStanding, setPlayerStanding] = useState(null);

  const totalPts = useMemo(
    () => (playerStanding?.points ?? earnedPts).toLocaleString(),
    [earnedPts, playerStanding]
  );

  const insightTitle =
    correct >= 7 ? 'Strong Performance!' : correct >= 5 ? 'Solid Foundation' : 'Keep Practicing';
  const insightBody =
    correct >= 7
      ? 'You are performing above average. Challenge yourself with harder problem sets tomorrow.'
      : 'Focus on the topics where you revealed answers and revisit those concepts for tomorrow\'s session.';

  useEffect(() => {
    let cancelled = false;

    async function persistSummary() {
      try {
        const response = await fetch('/api/session-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            playerName,
            topics,
            correct,
            revealed,
            wrong,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save session summary');
        }

        const data = await response.json();

        if (!cancelled) {
          setLeaderboard(data.leaderboard?.length ? data.leaderboard : FALLBACK_LEADERBOARD);
          setPlayerStanding(data.currentUser);
        }
      } catch (error) {
        console.error('Summary persistence failed:', error);
      }
    }

    if (sessionId) {
      persistSummary();
    }

    return () => {
      cancelled = true;
    };
  }, [correct, playerName, revealed, sessionId, topics, wrong]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Daily Performance</h1>
          <p className={styles.pageSubtitle}>
            Session complete. Your architectural precision has improved today.
          </p>
        </div>
        <div className={styles.timerBox}>
          <span className={styles.timerLabel}>Next Challenge In</span>
          <span className={styles.timerValue}>{countdown}</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <Card className={styles.breakdownCard}>
            <div className={styles.cardHeading}>
              <span className={styles.headingIcon}>Score</span>
              <h3 className={styles.sectionTitle}>Question Breakdown</h3>
            </div>

            <div className={styles.scoreBar}>
              <div
                className={`${styles.scoreSeg} ${styles.segCorrect}`}
                style={{ flex: correct }}
              >
                {correct > 0 && `${correct} Correct`}
              </div>
              <div
                className={`${styles.scoreSeg} ${styles.segRevealed}`}
                style={{ flex: revealed }}
              >
                {revealed > 0 && `${revealed} Revealed`}
              </div>
              <div
                className={`${styles.scoreSeg} ${styles.segWrong}`}
                style={{ flex: Math.max(wrong, 0.5) }}
              >
                {wrong > 0 && 'Wrong'}
              </div>
            </div>

            <div className={styles.statTrio}>
              {[
                { label: 'Solved Correctly', value: correct, pts: `+${correct * 200} pts`, cls: styles.statCorrect },
                { label: 'Answers Revealed', value: revealed, pts: '+0 pts', cls: styles.statRevealed },
                { label: 'Incorrect', value: wrong, pts: `-${wrong * 50} pts`, cls: styles.statWrong },
              ].map(({ label, value, pts, cls }) => (
                <div key={label} className={`${styles.statItem} ${cls}`}>
                  <span className={styles.statLabel}>{label}</span>
                  <div className={styles.statRow}>
                    <span className={styles.statNum}>{String(value).padStart(2, '0')}</span>
                    <span className={styles.statPts}>{pts}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pointsRow}>
              <div className={styles.pointsLeft}>
                <div className={styles.pointsIcon}>Pts</div>
                <div>
                  <span className={styles.pointsLabel}>Daily Points Earned</span>
                  <div className={styles.pointsValue}>
                    {earnedPts.toLocaleString()}
                    <span className={styles.pointsUnit}>Synthets</span>
                  </div>
                </div>
              </div>
              <BtnGhost disabled>Saved To Prisma</BtnGhost>
            </div>
          </Card>

          <div className={styles.bottomRow}>
            <Card className={styles.insightCard}>
              <div className={styles.insightBg} />
              <div className={styles.insightBody}>
                <span className={styles.insightBadge}>Daily Insight</span>
                <h4 className={styles.insightTitle}>{insightTitle}</h4>
                <p className={styles.insightText}>{insightBody}</p>
              </div>
            </Card>

            <Card className={styles.masteryCard}>
              <div className={styles.masteryIcon}>DB</div>
              <h4 className={styles.masteryTitle}>Mastery Takes Consistency</h4>
              <p className={styles.masteryText}>
                This run has been saved. Start another session to keep building your leaderboard score.
              </p>
              <div className={styles.masteryBtns}>
                <BtnPrimary onClick={onNewSession} style={{ fontSize: 11, padding: '8px 14px' }}>
                  New Session
                </BtnPrimary>
                <BtnGhost style={{ fontSize: 11, padding: '8px 14px' }} disabled>
                  Synced
                </BtnGhost>
              </div>
            </Card>
          </div>
        </div>

        <Card className={styles.leaderboard}>
          <div className={styles.ldbHeader}>
            <h3 className={styles.sectionTitle}>Global Standings</h3>
            <div className={styles.liveBadge}>
              <PulsingDot /> LIVE
            </div>
          </div>

          {leaderboard.map((player, index) => (
            <div key={`${player.rank}-${player.name}`} className={styles.ldbRow}>
              <span className={styles.ldbRank}>{String(player.rank).padStart(2, '0')}</span>
              <div
                className={styles.ldbAvatar}
                style={{
                  background:
                    index === 0
                      ? 'rgba(195,245,255,0.1)'
                      : index === 1
                        ? 'rgba(218,226,253,0.08)'
                        : 'rgba(255,180,171,0.1)',
                  color:
                    index === 0
                      ? 'var(--primary)'
                      : index === 2
                        ? 'var(--error)'
                        : 'var(--on-surface)',
                }}
              >
                {player.initial}
              </div>
              <div className={styles.ldbInfo}>
                <div className={styles.ldbName}>{player.name}</div>
                <div className={styles.ldbPts}>{player.points.toLocaleString()} pts</div>
              </div>
              <span className={styles.ldbTrend} style={{ color: 'var(--secondary)' }}>
                {index === 1 ? '--' : 'UP'}
              </span>
            </div>
          ))}

          <div className={styles.separator}>. . .</div>

          <div className={`${styles.ldbRow} ${styles.youRow}`}>
            <span className={styles.ldbRank}>{String(playerStanding?.rank ?? 0).padStart(2, '0')}</span>
            <div className={styles.ldbAvatar} style={{ background: 'rgba(62,236,111,0.1)', color: 'var(--secondary)' }}>
              {playerName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.ldbInfo}>
              <div className={styles.ldbName}>
                You ({playerName})
                <span className={styles.topTag}>{playerStanding ? `#${playerStanding.rank}` : 'SYNCING'}</span>
              </div>
              <div className={styles.ldbPts}>{totalPts} pts</div>
            </div>
          </div>

          <button className={styles.fullLdbBtn}>Full Leaderboard</button>
        </Card>
      </div>
    </div>
  );
}

'use client';

import styles from './TopNav.module.css';

export default function TopNav({ questionsDone = 0, playerName = 'M' }) {
  return (
    <header className={styles.nav}>
      <div className={styles.left}>
        <div className={styles.logo}>Synthetique</div>
        <nav className={styles.links}>
          {['Practice', 'Contests', 'Roadmaps'].map((l) => (
            <button key={l} className={`${styles.link} ${l === 'Practice' ? styles.active : ''}`}>
              {l}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.right}>
        <div className={styles.counter}>
          <span className={styles.dot} />
          {questionsDone}/10 Questions
        </div>
        <div className={styles.avatar}>{playerName.charAt(0).toUpperCase()}</div>
      </div>
    </header>
  );
}

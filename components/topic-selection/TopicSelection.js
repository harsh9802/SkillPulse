'use client';

import { useState } from 'react';
import { TOPICS } from '@/lib/constants';
import { BtnPrimary, PulsingDot } from '@/components/layout/UI';
import styles from './TopicSelection.module.css';

export default function TopicSelection({ onStart }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          Curate Your Path
        </div>

        <h1 className={styles.title}>Choose Your Specialization</h1>
        <p className={styles.subtitle}>
          Select CS domains to master. Each track generates daily MCQs and
          code-prediction challenges tailored to your level.
        </p>

        <div className={styles.grid}>
          {TOPICS.map((topic) => {
            const isSel = selected.includes(topic.id);
            return (
              <button
                key={topic.id}
                className={`${styles.card} ${isSel ? styles.selected : ''}`}
                onClick={() => toggle(topic.id)}
              >
                <span className={styles.bgIcon}>{topic.icon}</span>

                <div className={`${styles.iconBox} ${isSel ? styles.iconBoxActive : ''}`}>
                  {topic.icon}
                </div>

                <h3 className={styles.cardTitle}>{topic.label}</h3>
                <p className={styles.cardDesc}>{topic.desc}</p>

                <div className={styles.cardFooter}>
                  <div className={styles.meta}>
                    {topic.badge && (
                      <span className={styles.badge}>{topic.badge}</span>
                    )}
                    <span className={styles.count}>{topic.count} Problems</span>
                  </div>
                  <div className={`${styles.radio} ${isSel ? styles.radioActive : ''}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.status}>
          <PulsingDot />
          System Engine Ready
        </div>
        <span className={styles.version}>V2.4.0-STABLE // ARCHITECTURE_ID: X7712</span>
        <BtnPrimary onClick={() => selected.length > 0 && onStart(selected)} disabled={selected.length === 0}>
          Start Practicing →
        </BtnPrimary>
      </footer>
    </div>
  );
}

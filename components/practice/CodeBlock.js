import { highlight } from '@/lib/highlight';
import styles from './CodeBlock.module.css';

export default function CodeBlock({ code, language }) {
  const lines = code.split('\n');

  return (
    <div className={styles.wrapper}>
      <span className={styles.langTag}>{language}</span>
      <pre className={styles.pre}>
        {lines.map((line, i) => (
          <div key={i} className={styles.line}>
            <span className={styles.lineNum}>{i + 1}</span>
            <span
              className={styles.lineCode}
              dangerouslySetInnerHTML={{ __html: highlight(line) || '&nbsp;' }}
            />
          </div>
        ))}
      </pre>
    </div>
  );
}

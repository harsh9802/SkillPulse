import styles from './UI.module.css';

export function Chip({ variant = 'easy', children }) {
  return <span className={`${styles.chip} ${styles[variant]}`}>{children}</span>;
}

export function Label({ children, color }) {
  return (
    <span className={styles.label} style={color ? { color } : undefined}>
      {children}
    </span>
  );
}

export function PulsingDot({ color }) {
  return <span className={styles.pulse} style={color ? { background: color } : undefined} />;
}

export function Spinner() {
  return <div className={styles.spinner} />;
}

export function Card({ children, className = '', style }) {
  return (
    <div className={`${styles.card} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardSm({ children, className = '', style }) {
  return (
    <div className={`${styles.cardSm} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function BtnPrimary({ children, onClick, disabled, style }) {
  return (
    <button className={styles.btnPrimary} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}

export function BtnGhost({ children, onClick, style }) {
  return (
    <button className={styles.btnGhost} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

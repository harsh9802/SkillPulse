'use client';

import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',         icon: '⊞' },
  { id: 'practice',  label: 'Problem Sets',      icon: '</>' },
  { id: 'history',   label: 'Submission History', icon: '◷' },
  { id: 'bookmarks', label: 'Bookmarks',          icon: '◖' },
  { id: 'settings',  label: 'Settings',           icon: '◎' },
];

export default function Sidebar({ activeScreen, onNavigate }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.user}>
        <div className={styles.userName}>CS Mastery</div>
        <div className={styles.userLevel}>Level 4 Architect</div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const clickable = item.id === 'dashboard' || item.id === 'practice';
          const active = activeScreen === item.id;
          return (
            <div
              key={item.id}
              className={`${styles.item} ${active ? styles.active : ''} ${clickable ? styles.clickable : ''}`}
              onClick={() => clickable && onNavigate(item.id)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <button className={styles.upgradeBtn}>Upgrade to Pro</button>
        <div className={styles.footer}>
          <a href="#">❓ Support</a>
          <a href="#">📄 Documentation</a>
        </div>
      </div>
    </aside>
  );
}

import Head from "next/head";
import styles from "./Header.module.css";

interface HeaderProps {
  count: number;
  isLoading: boolean;
}

export default function Header({ count, isLoading }: HeaderProps) {
  return (
    <>
      <Head>
        <title>Campus Notifications | Stay Updated</title>
        <meta name="description" content="Real-time campus notifications for placements, results, and events — prioritized for you." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoGroup}>
            <div className={styles.logoIcon} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <h1 className={styles.title}>Campus Notifications</h1>
              <p className={styles.subtitle}>Your priority feed — updated in real-time</p>
            </div>
          </div>

          <div className={styles.statGroup}>
            <div className={styles.statBadge}>
              <span className={styles.pulseDot} aria-hidden="true" />
              {isLoading ? (
                <span className={styles.statText}>Loading...</span>
              ) : (
                <span className={styles.statText}>{count} notification{count !== 1 ? "s" : ""}</span>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

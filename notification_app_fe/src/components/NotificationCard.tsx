import React from "react";
import styles from "./NotificationCard.module.css";

export interface Notification {
  ID: string | number;
  Type: string;
  Message: string;
  Timestamp: string;
  score?: number;
}

interface NotificationCardProps {
  notification: Notification;
  index: number;
}

const TYPE_ICONS: Record<string, React.ReactElement> = {
  Placement: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Result: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Event: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return then.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function NotificationCard({ notification, index }: NotificationCardProps) {
  const { Type, Message, Timestamp } = notification;
  const typeClass = styles[`type${Type}`] || "";
  const icon = TYPE_ICONS[Type] || null;
  const relativeTime = formatRelativeTime(Timestamp);

  return (
    <article
      className={`${styles.card} ${typeClass} fade-in-up`}
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={`${Type} notification: ${Message}`}
    >
      <div className={styles.cardTop}>
        <div className={`${styles.typeBadge} ${styles[`badge${Type}`]}`}>
          <span className={styles.typeIcon} aria-hidden="true">{icon}</span>
          <span>{Type}</span>
        </div>
        <time className={styles.timestamp} dateTime={Timestamp} title={new Date(Timestamp).toLocaleString()}>
          {relativeTime}
        </time>
      </div>

      <p className={styles.message}>{Message}</p>

      <div className={styles.cardFooter}>
        <div className={`${styles.accentLine} ${styles[`line${Type}`]}`} aria-hidden="true" />
      </div>
    </article>
  );
}

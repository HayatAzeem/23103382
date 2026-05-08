import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Header from "../components/Header";
import FilterBar, { NotificationType } from "../components/FilterBar";
import NotificationCard, { Notification } from "../components/NotificationCard";
import styles from "./index.module.css";

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<NotificationType>("All");

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    axios
      .get("http://localhost:5000/priority-notifications")
      .then((res) => {
        setNotifications(res.data);
      })
      .catch(() => {
        setError("Failed to load notifications. Please ensure the backend is running.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: notifications.length };
    notifications.forEach((n) => {
      c[n.Type] = (c[n.Type] || 0) + 1;
    });
    return c;
  }, [notifications]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n) => n.Type === activeFilter);
  }, [notifications, activeFilter]);

  return (
    <div className={styles.page}>
      <Header count={filtered.length} isLoading={isLoading} />

      <main className={styles.main}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <FilterBar
            active={activeFilter}
            onChange={setActiveFilter}
            counts={counts}
          />
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className={styles.grid} aria-busy="true" aria-label="Loading notifications">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeletonCard}`} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className={styles.errorState} role="alert">
            <div className={styles.errorIcon} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className={styles.emptyTitle}>No notifications found</p>
            <p className={styles.emptySubtitle}>There are no <strong>{activeFilter}</strong> notifications at the moment.</p>
          </div>
        )}

        {/* Notification grid */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((item, i) => (
              <NotificationCard key={item.ID} notification={item} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
import styles from "./FilterBar.module.css";

export type NotificationType = "All" | "Placement" | "Result" | "Event";

interface FilterBarProps {
  active: NotificationType;
  onChange: (type: NotificationType) => void;
  counts: Record<string, number>;
}

const FILTERS: NotificationType[] = ["All", "Placement", "Result", "Event"];

export default function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className={styles.filterBar} role="tablist" aria-label="Filter notifications by type">
      {FILTERS.map((type) => (
        <button
          key={type}
          id={`filter-${type.toLowerCase()}`}
          role="tab"
          aria-selected={active === type}
          className={`${styles.filterBtn} ${styles[`filter${type}`]} ${active === type ? styles.active : ""}`}
          onClick={() => onChange(type)}
        >
          <span className={styles.filterLabel}>{type}</span>
          {counts[type] !== undefined && (
            <span className={styles.filterCount}>{counts[type]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

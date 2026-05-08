# Stage 1

## Campus Notifications – Priority Inbox: System Design

---

## Problem Statement

Students receive a high volume of campus notifications across three categories:
**Placements**, **Results**, and **Events**. Important notifications get buried.
The goal is to always surface the **top-n most important unread notifications**
in a Priority Inbox, determined by a combination of **type weight** and **recency**.

---

## Priority Scoring Model

Each notification receives a composite score:

```
score = typeWeight × RECENCY_SCALE + recencyScore
```

### Type Weights

| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

Rationale: Placement notifications are most career-critical, Results are
academically important, and Events are the least time-sensitive.

### Recency Score

```
recencyScore = 1 / (ageInSeconds + 1)
```

This is a decaying function that ranges in `(0, 1]`:
- Brand-new notification → score ≈ 1.0
- 1-hour-old notification → score ≈ 0.000278

### RECENCY_SCALE

Set to `1000` so that the type weight always dominates recency within the same
category, while still allowing recency to differentiate notifications of the
same type.

**Example:**
- Placement (3 min old) → `3 × 1000 + 0.0056 = 3000.0056`
- Result (1 sec old)    → `2 × 1000 + 0.5000 = 2000.5000`
- Placement always wins over Result regardless of age ✓

---

## Efficiently Maintaining Top-N (Streaming / Live Updates)

### The Challenge

New notifications keep arriving continuously. Naively re-sorting all
notifications every time is `O(m log m)` per update — expensive at scale.

### Solution: Min-Heap of Size N

We maintain a **min-heap** of exactly `n` elements (the current top-n):

```
For each incoming notification:
  score = computePriorityScore(notification)

  if heap.size < n:
    heap.push(notification)          // Always fill up first
  elif score > heap.min:
    heap.pop()                       // Evict the lowest-priority item
    heap.push(notification)          // Replace with higher-priority one
```

**Complexity:**
| Operation        | Time Complexity |
|------------------|-----------------|
| Per notification | O(log n)        |
| Total (m items)  | O(m log n)      |
| vs. Sort-all     | O(m log m)      |

For `n = 10` and `m = 10,000`, this is ~1,000× fewer comparisons.

### Score Decay Handling

Since `recencyScore` decays over time, a notification's effective priority
decreases as it ages. In a live system, periodic re-scoring (e.g., every
minute) ensures the heap stays accurate. The heap eviction mechanism
automatically displaces older, lower-score items as newer ones arrive.

---

## Data Flow

```
Notification API (GET)
        │
        ▼
fetchNotifications()
  → validates HTTP response
  → parses JSON array
        │
        ▼
computePriorityScore(notification)
  → typeWeight × RECENCY_SCALE + recencyScore
        │
        ▼
getTopNPriorityNotifications(notifications, n=10)
  → min-heap simulation over scored notifications
  → returns top-n sorted descending by score
        │
        ▼
displayPriorityInbox()
  → renders ranked table to stdout
```

---

## Logging

All operations use the **Logging Middleware** (`../logging_middleware`):
- API fetch start/success/failure
- Per-notification score debug output
- Top-n selection result
- Service lifecycle events (start, complete, error)

No `console.log` or built-in loggers are used directly in business logic.

---

## Assumptions

1. The API is pre-authorised — no auth tokens or login required.
2. "Unread" state is managed at the client/UI layer (Stage 2); Stage 1 treats
   all fetched notifications as unread candidates.
3. Timestamps in the API response are in UTC.
4. `n` defaults to 10 but is parameterised — callers can request top-15, top-20, etc.

---

## Repository Structure

```

## Repository Structure

```
campus-notification-system/
│
├── .gitignore
├── Readme.md
├── notification_system_design.md
│
├── output/
│   └── image.png
│
├── logging_middleware/                  ← Shared reusable package
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       └── logger.ts
│
├── notification_app_be/                 ← Express backend
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts
│       └── services/
│           └── notificationService.ts
│
└── notification_app_fe/                 ← Next.js frontend
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── styles/
        │   └── globals.css
        ├── pages/
        │   ├── _app.tsx
        │   ├── index.tsx
        │   └── index.module.css
        └── components/
            ├── Header.tsx
            ├── Header.module.css
            ├── FilterBar.tsx
            ├── FilterBar.module.css
            ├── NotificationCard.tsx
            └── NotificationCard.module.css

```
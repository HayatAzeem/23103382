# Campus Notification System

## Output



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

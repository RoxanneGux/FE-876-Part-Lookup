# Project Structure

```
fe-harness-FE-876/
├── .npmrc                    # Private registry auth for @assetworks-llc
├── MOCK-DATA-GUIDE.md        # Single source of truth for all mock data
├── angular.json              # Build config (includes library assets + styles)
├── src/
│   ├── index.html            # Entry HTML (body has "mat-typography light-theme")
│   ├── styles.scss           # Global styles + library SCSS import
│   ├── main.ts               # Bootstrap
│   ├── app/
│   │   ├── app.component.*   # Root shell with AwNavigationMenu + AwTopNavigation
│   │   ├── app.config.ts     # App configuration (providers)
│   │   ├── app.routes.ts     # Route definitions (lazy-loaded)
│   │   ├── components/       # Reusable custom components
│   │   │   └── dialogs/      # Base dialog + custom dialogs
│   │   ├── pages/            # Feature pages (one folder per feature/route)
│   │   └── services/         # Shared services (DialogService, etc.)
│   └── assets/
│       └── mocks/            # Mock JSON data files
└── public/                   # Static assets (favicon, etc.)
```

## Conventions
- Feature pages go in `src/app/pages/` with lazy-loaded routes
- Reusable components go in `src/app/components/`
- Services go in `src/app/services/`
- Mock JSON files go in `src/assets/mocks/`
- When copying components from the main repo, remap imports:
  - `@core/services` → `../../services/`
  - `@core/components/dialogs` → `../../components/dialogs/`
  - `@lib/models/...` → Create local interfaces or use `any`

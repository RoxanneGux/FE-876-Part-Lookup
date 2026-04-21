# Tech Stack & Build

## Stack
- **Framework**: Angular 18 (standalone components, no NgModules)
- **Language**: TypeScript
- **Styling**: SCSS (component-scoped + global)
- **Component Library**: `@assetworks-llc/aw-component-lib@26.1.1-ng18`
- **Package Registry**: Azure DevOps private npm (`pkgs.dev.azure.com/assetworks-it`)
- **Font**: Roboto (global)

## Key Angular Patterns
- Standalone components with direct imports
- Angular signals (`signal()`, `computed()`, `input()`) for reactivity
- `ChangeDetectionStrategy.OnPush` preferred
- Reactive forms (`FormGroup`, `FormControl`)
- Lazy-loaded routes via `loadComponent` in `app.routes.ts`
- Dependency injection via `inject()` function (not constructor injection)

## Commands

| Action | Command |
|--------|---------|
| Serve locally | `npm start` |
| Build (dev) | `npx ng build --configuration=development` |
| Build (prod) | `npx ng build` |
| Run tests | `npx ng test` |
| Generate component | `npx ng generate component <name>` |
| Generate service | `npx ng generate service <name>` |

## Private Registry Auth
The `.npmrc` in the project root must contain valid Azure DevOps credentials for the `@assetworks-llc` scope. Without it, `npm install` will fail for the component library.

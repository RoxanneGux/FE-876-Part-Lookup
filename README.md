# FE-876 Harness

## Ticket

FE-876 — *(add ticket description here)*

## What's Been Built

- App shell with AssetWorks navigation menu and top navigation bar
- DialogService for programmatic dialog opening
- BaseDialogComponent for extending custom dialogs

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | *(default)* | App shell with nav — no feature pages yet |

## How to Run Locally

1. Clone this repository
2. Ensure your `.npmrc` has valid Azure DevOps credentials for the `@assetworks-llc` scope
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm start
   ```
5. Open `http://localhost:4200` in your browser

## Integration Instructions

When integrating into FA Suite:

1. Pull down this branch to inspect the working code
2. Core component logic is in: `src/app/pages/` and `src/app/components/`
3. Mock data is in: `src/assets/mocks/`
4. Copy the component folders into the main FA Suite app
5. Replace local `HttpClient.get()` calls with your real API services

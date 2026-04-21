# README Sync Rule

## Mandatory: Keep README.md Current

`README.md` at the project root must be updated whenever:

- A new feature page or component is added
- Routes are added or changed in `app.routes.ts`
- New mock data files are created or existing ones change significantly
- The project setup steps change (new dependencies, config changes)
- Integration instructions need updating (new component folders, new API patterns)

## What the README Must Always Contain

1. **Ticket description** — What FE-876 is about
2. **What's been built** — List of all features/components in the harness
3. **How to view** — Which routes/pages exist and what they show
4. **How to run locally** — Step-by-step: clone, npm install, npm start
5. **Integration instructions** — How to copy components into FA Suite and swap mock data for real APIs

## When in Doubt, Update It

If you created or modified a component, page, or route — update the README. It's the first thing an engineer reads when picking up this harness.

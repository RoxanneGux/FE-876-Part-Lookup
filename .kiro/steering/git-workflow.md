# Git & Handoff Workflow

## Commits

- Commit after every major milestone
- Push to the `main` branch (harness repos use main directly)
- Commit message format: `feat: implement [COMPONENT_NAME] reference logic`
- Stage all changes: `git add .` then `git commit`

## README.md Requirements

The README in this harness must include:

1. **Ticket description** — What the ticket issue is about
2. **What was built** — What components/features exist in this harness
3. **How to view** — How a developer running locally can see the new designs
4. **How to run locally** — Step-by-step setup instructions (npm install, npm start, etc.)
5. **Integration instructions** — How to incorporate the harness into the main app workflow:
   - Pull down the branch to inspect the working code
   - Core component logic location: `src/app/features/[COMPONENT_NAME]/`
   - Mock data structure location: `src/assets/mocks/[DATA].json`
   - Copy the component folder into FA Suite and replace local `HttpClient.get()` calls with real API services

## Handoff Protocol

The goal is to deliver a validated, version-controlled code artifact to Engineering. The harness should be runnable out of the box after cloning and `npm install`.

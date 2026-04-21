# Mock Data Rules

## MOCK-DATA-GUIDE.md Sync — Mandatory

`MOCK-DATA-GUIDE.md` at the project root is the single source of truth for designers and reviewers. It MUST be updated in the same commit whenever any of the following change:

- Mock JSON files in `src/assets/mocks/`
- Hardcoded mock data in component TypeScript files (table data arrays, asset lists, etc.)
- Job type options or form behavior changes
- New form fields, sections, or conditional visibility logic
- New components that consume or display mock data
- Quick scenario changes (new UI states the designer can test)

The **Quick Scenarios** table must always be current — it is used for live demos.

## Mock Data Strategy

- Create mock data arrays directly in components or as JSON files in `src/assets/mocks/`
- Use signals for reactive data: `tableData = signal<DataType[]>([])`
- Use computed signals for filtered/derived views
- Use `HttpClient.get()` for loading mock JSON so it's easy to swap for real APIs later

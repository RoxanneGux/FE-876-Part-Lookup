# Implementation Plan: Part Lookup

## Overview

This plan implements the Part Lookup feature for the FE-876 harness app. It builds incrementally: mock data service first, then the form page shell with two buttons per field, then the simple flat-table dialog, then the advanced slide-in lookup with filters, then field validation and wiring, and finally integration and polish. Each task references specific requirements and builds on previous steps so there is no orphaned code.

## Tasks

- [x] 1. Create MockDataService and data models
  - [x] 1.1 Create the part record interfaces
    - Create `src/app/features/part-lookup/part-lookup.models.ts`
    - Define `SimplePartRecord` interface with fields: `partId`, `partDescription`, `keyword`, `crossReference`, `cost` (number)
    - Define `ExtendedPartRecord` interface extending `SimplePartRecord` with fields: `categoryId`, `categoryDescription`, `onHand` (number), `onOrder` (number), `committed` (number), `requestOutPending` (number), `manufacturerPartNumber`, `manufacturer`, `imageUrl`
    - _Requirements: 11.1, 11.2_

  - [x] 1.2 Create MockDataService with flat part data and filter dropdown data
    - Create `src/app/services/mock-data.service.ts` as a root-provided injectable service
    - Implement `simpleParts` signal with flat list of 14 parts per the design's mock data table (PRT-OIL-001 through PRT-ELEC-002), each with partId, partDescription, keyword, crossReference, cost
    - Implement `extendedParts` signal with the same 14 parts plus extended fields: categoryId, categoryDescription, onHand, onOrder, committed, requestOutPending, manufacturerPartNumber, manufacturer, imageUrl
    - Implement `flatPartLookup` as a `computed` signal that returns all simple parts for type-and-tab-off resolution
    - Implement `stockLocations` signal with mock stock location options (LOC-MAIN, LOC-EAST, LOC-WEST)
    - Implement `productCategories` signal with mock product category options (CAT-ENG, CAT-BRK, CAT-ELEC)
    - Implement `equipmentTypes` signal with mock equipment type options (EQT-VEH, EQT-HVY, EQT-GEN)
    - Implement `taskTypes` signal with mock task type options (TSK-REP, TSK-PM, TSK-INS)
    - Implement `classTypes` signal with mock class type options (CLS-A, CLS-B, CLS-C)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 1.3 Write unit tests for MockDataService
    - Verify `simpleParts` provides flat list with correct count and fields
    - Verify `extendedParts` provides extended records with all additional fields
    - Verify `flatPartLookup` contains all parts from simpleParts
    - Verify `stockLocations`, `productCategories`, `equipmentTypes`, `taskTypes`, `classTypes` each provide correct options
    - Verify data variety across fields for search demonstration
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2. Create PartFormPageComponent shell with routing
  - [x] 2.1 Create PartFormPageComponent with form layout and two buttons per field
    - Create `src/app/features/part-lookup/part-form-page.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`
    - Inject `DialogService` using `inject()`
    - Add signals: `partId: signal<string>('')`, `partDescription: signal<string>('')`, `partDescriptionError: signal<boolean>(false)`, `selectedParts: signal<SimplePartRecord[]>([])`, `showAdvancedLookup: signal<boolean>(false)`, `advancedLookupMode: signal<'single' | 'multi'>('single')`
    - Render page breadcrumbs using `AwBreadCrumbComponent` (e.g., "Home > Part Form")
    - Render page title `<h4 class="aw-h-4">Any Form with a part lookup</h4>`
    - Render `AwDividerComponent` below the title
    - Render Part field row: `AwFormFieldComponent` + `AwInputDirective` (label "Part") with adjacent `AwButtonIconOnlyDirective` (magnifying glass icon) and `AwButtonDirective` with `[buttonType]="'outlined'"` (text "Lookup"), and a description text area below driven by `partDescription` / `partDescriptionError` signals
    - Render Parts field row: `AwFormFieldComponent` + `AwInputDirective` (label "Parts") with adjacent `AwButtonIconOnlyDirective` (magnifying glass icon) and `AwButtonDirective` with `[buttonType]="'outlined'"` (text "Lookup"), and selected parts display below (chips or comma-separated list in "(PART_ID) Part Description" format)
    - Both fields on a single row below the divider
    - Render `AwActionBarComponent` with "Cancel" button on the left and "Save" button on the right
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 12.3, 12.4_

  - [x] 2.2 Add default route for PartFormPageComponent
    - Update `src/app/app.routes.ts` to add a default route (`path: ''`) that lazy-loads `PartFormPageComponent` via `loadComponent`
    - _Requirements: 12.1, 12.2_

  - [ ]* 2.3 Write unit tests for PartFormPageComponent layout
    - Verify breadcrumbs, title, divider, Part field, Parts field, and action bar render
    - Verify Part field has label "Part", magnifying glass icon button, and "Lookup" outlined button
    - Verify Parts field has label "Parts", magnifying glass icon button, and "Lookup" outlined button
    - Verify action bar has "Cancel" and "Save" buttons
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 3. Checkpoint
  - Ensure the app builds and the form page renders at the default route with two buttons per field. Ensure all tests pass, ask the user if questions arise.

- [x] 4. Create SimplePartLookupDialogComponent with flat table
  - [x] 4.1 Implement SimplePartLookupDialogComponent with flat table display
    - Create `src/app/features/part-lookup/simple-part-lookup-dialog.component.ts` extending `BaseDialogComponent`, standalone, `ChangeDetectionStrategy.OnPush`
    - Add `mode` input: `input<'single' | 'multi'>('single')`
    - Inject `MockDataService` using `inject()`
    - Implement signals: `tableData`, `searchText` (plain field)
    - Define flat column definitions: Part (custom 2-line: ID + Description), Keyword, Cross-Ref, Cost (right-aligned currency "$XX.XX") — NO drill-down column, NO breadcrumbs
    - Configure `DialogOptions`: `variant: DialogVariants.TABLE`, `title: 'Part Lookup'`, `primaryButtonLabel: 'Add'`, `secondaryButtonLabel: 'Cancel'`, `enableBackdropClick: true`, `enableSearch: false`
    - Set `enableSingleSelection` or `enableMultiSelection` on `aw-dialog` based on `mode` input
    - Load flat part data from `MockDataService.simpleParts` into `tableData`
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3.1, 3.2, 3.3, 3.4, 3.5, 14.1, 14.2, 14.3_

  - [x] 4.2 Add search filtering and scan button to SimplePartLookupDialogComponent
    - Render `AwSearchComponent` in the `table-top` slot
    - Render disabled `Scan_Button` (barcode-scan icon, `AwButtonIconOnlyDirective` with `awButtonFill`, `[disabled]="true"`) next to the search bar
    - Implement `onSearchChange(value)`: filter flat data across partId, partDescription, keyword, crossReference, and cost (as string) — case-insensitive substring match
    - Empty search shows all data
    - _Requirements: 2.9, 4.1, 4.2, 4.3, 4.4_

  - [x] 4.3 Add footer buttons and "Advanced Lookup" bridge
    - Add "Advanced Lookup" tertiary button to the dialog footer (between Cancel and Add)
    - Implement `handleAdvancedLookup()`: emit `{ advancedLookup: true, mode: this.mode() }` via `close.emit()` to signal the parent to close this dialog and open the advanced lookup
    - Implement `handleAdd(event)`: in single-select mode, emit selected row via `close.emit()`; in multi-select mode, emit array of selected items
    - Implement `handleCancel()`: emit `null` via `close.emit()`
    - _Requirements: 2.10, 2.11, 5.1, 5.4, 5.5, 5.6, 14.4_

  - [ ]* 4.4 Write property test: Search filter completeness and soundness (Property 2)
    - **Property 2: Search filter completeness and soundness**
    - Generate random `SimplePartRecord[]` arrays and random search query strings. Apply the search filter function. Verify every returned row contains the query in at least one of the five visible fields (case-insensitive), and every excluded row does not contain the query in any field
    - Use `fast-check` with minimum 100 iterations
    - **Validates: Requirements 4.2, 4.3**

  - [ ]* 4.5 Write unit tests for SimplePartLookupDialogComponent
    - Test initial state shows flat part data with no breadcrumbs and no drill-down arrows
    - Test search filtering across all columns
    - Test clearing search shows all data
    - Test dialog options (TABLE variant, title, button labels)
    - Test single-select mode enables radio buttons
    - Test multi-select mode enables checkboxes
    - Test scan button renders as disabled placeholder
    - Test "Advanced Lookup" button emits advancedLookup signal with correct mode
    - Test handleAdd emits selected row in single-select, array in multi-select
    - Test handleCancel emits null
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 2.9, 2.10, 2.11, 4.2, 4.3, 4.4, 14.2, 14.3_

- [x] 5. Checkpoint
  - Ensure the simple dialog opens from both magnifying glass buttons and displays flat part data with search. Ensure all tests pass, ask the user if questions arise.

- [x] 6. Create AdvancedPartsLookupComponent slide-in service
  - [x] 6.1 Implement AdvancedPartsLookupComponent with extended table and quick filters
    - Create `src/app/features/part-lookup/advanced-parts-lookup.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`
    - Add `mode` input: `input<'single' | 'multi'>('single')`
    - Add `close` output: `output<any>()`
    - Inject `MockDataService` using `inject()`
    - Implement signals for all quick filter states: `searchText`, `stockLocation`, `partFilter`, `categoryFilter`, `includeXRefs` (default true), `showFilterDrawer`
    - Implement signals for side drawer filter states: `equipmentTypeFilter`, `taskTypeFilter`, `classTypeFilter`
    - Implement `tableData` computed signal that applies all filters to `MockDataService.extendedParts`
    - Render title "Part Search Advanced Lookup"
    - Render quick filters row: `AwSearchComponent`, Stock Location dropdown (single-select, search enabled), Part dropdown (multi-select, Select All, search enabled, placeholder "Filter on ID or Description"), Product Category dropdown (multi-select, Select All, search enabled, placeholder "Filter on Category"), Include XRefs toggle (default ON), filter icon button
    - Define extended column definitions: Image (thumbnail placeholder), Part (custom 2-line), Category (custom 2-line), On Hand, On Order, Committed, Request Out Pending, Manufacturer Part Number, Manufacturer
    - Set `enableSingleSelection` or `enableMultiSelection` based on `mode` input
    - Render empty state message: "No results returned. Adjust quick filters and/or side filter."
    - Render footer: Cancel (left), Select (right)
    - Follow the slide-in service pattern from FE-528 Add Usage panel
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 14.1, 14.5_

  - [x] 6.2 Implement side drawer filter panel
    - Add `AwSideDrawerComponent` with filter type, opening from the right
    - Render title "Filter" and "Clear All" link at top
    - Render Equipment Type dropdown (`AwSelectMenuComponent`, multi-select, search enabled, placeholder "Filter on Equipment Type")
    - Render Task Type dropdown (`AwSelectMenuComponent`, multi-select, search enabled, placeholder "Filter on Task Type")
    - Render Class Type dropdown (`AwSelectMenuComponent`, multi-select, search enabled, placeholder "Filter on Class Type")
    - Implement `clearAllFilters()`: reset all side drawer filter selections
    - Wire side drawer filter changes into the `tableData` computed signal
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 6.3 Implement selection and close actions for AdvancedPartsLookupComponent
    - Implement `handleSelect(event)`: in single-select mode, emit selected row via `close` output; in multi-select mode, emit array of selected items
    - Implement `handleCancel()`: emit `null` via `close` output
    - _Requirements: 6.8, 6.9_

  - [ ]* 6.4 Write unit tests for AdvancedPartsLookupComponent
    - Test title renders as "Part Search Advanced Lookup"
    - Test quick filters row renders all filter controls (search, stock location, part, product category, toggle, filter icon)
    - Test extended table columns render (Image, Part, Category, On Hand, On Order, Committed, Request Out Pending, Mfr Part #, Manufacturer)
    - Test empty state message when no results
    - Test filter icon opens side drawer filter panel
    - Test side drawer contains Equipment Type, Task Type, Class Type dropdowns
    - Test "Clear All" resets side drawer filters
    - Test footer has Cancel and Select buttons
    - Test single-select mode shows radio buttons
    - Test multi-select mode shows checkboxes
    - Test handleSelect emits selected data
    - Test handleCancel emits null
    - _Requirements: 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.10, 9.1, 9.4, 9.5, 9.6, 9.7_

- [x] 7. Checkpoint
  - Ensure the advanced lookup slide-in opens from both "Lookup" buttons and from the "Advanced Lookup" bridge in the simple dialog. Ensure quick filters and side drawer filter panel work. Ensure all tests pass, ask the user if questions arise.

- [x] 8. Wire dialog and slide-in results to form fields and implement validation
  - [x] 8.1 Wire simple dialog results to form fields
    - Implement `openSimplePartLookup()` in `PartFormPageComponent`: call `DialogService.open(SimplePartLookupDialogComponent, { mode: 'single' }, callback)` where callback handles three cases: (a) selected part → populate Part field, (b) `advancedLookup` flag → open advanced lookup in same mode, (c) null → ignore
    - Implement `openSimplePartsLookup()` in `PartFormPageComponent`: call `DialogService.open(SimplePartLookupDialogComponent, { mode: 'multi' }, callback)` with same three-case handling for Parts field
    - Connect Part field magnifying glass button click to `openSimplePartLookup()`
    - Connect Parts field magnifying glass button click to `openSimplePartsLookup()`
    - Single-select result: populate `partId` with `"(PART_ID) Part Description"` format and `partDescription` with the description
    - Multi-select result: set `selectedParts` signal with the returned array
    - Display selected parts below the Parts_Field in "(PART_ID) Part Description" format
    - _Requirements: 2.1, 2.2, 2.11, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 13.3_

  - [x] 8.2 Wire advanced lookup results to form fields
    - Implement `openAdvancedLookup(mode)` in `PartFormPageComponent`: set `advancedLookupMode` and `showAdvancedLookup` signals
    - Implement `onAdvancedLookupClose(result)`: handle selected part(s) or null, populate fields accordingly, set `showAdvancedLookup` to false
    - Connect Part field "Lookup" button click to `openAdvancedLookup('single')`
    - Connect Parts field "Lookup" button click to `openAdvancedLookup('multi')`
    - Conditionally render `AdvancedPartsLookupComponent` when `showAdvancedLookup()` is true
    - _Requirements: 6.1, 6.2, 6.8, 6.9, 13.3, 14.6_

  - [x] 8.3 Implement Part field type-and-tab-off validation
    - Implement `lookupPart(value: string): { text: string; isError: boolean }` in `PartFormPageComponent`: case-insensitive match against `MockDataService.flatPartLookup` computed signal
    - Implement `onPartBlur()`: resolve typed value via `lookupPart()`, update `partDescription` and `partDescriptionError` signals, uppercase the input value (trim + toUpperCase)
    - Implement `onPartInput(event)`: when input is cleared, immediately hide description (set `partDescription` to empty, `partDescriptionError` to false)
    - Bind `(blur)` on Part input to `onPartBlur()` and `(input)` to `onPartInput($event)`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 8.4 Write property test: Lookup resolution correctness (Property 1)
    - **Property 1: Lookup resolution correctness**
    - Generate random strings (empty, valid part IDs with random casing, invalid strings). Verify `lookupPart` returns correct result for each case: empty → `{ text: '', isError: false }`, valid match → `{ text: description, isError: false }`, no match → `{ text: 'NOT DEFINED', isError: true }`
    - Use `fast-check` with minimum 100 iterations
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

  - [ ]* 8.5 Write property test: Part field display format (Property 3)
    - **Property 3: Part field display format**
    - Generate random `partId` and `partDescription` strings. Verify the formatted output equals `"(" + partId + ") " + partDescription`
    - Use `fast-check` with minimum 100 iterations
    - **Validates: Requirements 5.2**

  - [ ]* 8.6 Write property test: Blur uppercases non-empty input (Property 4)
    - **Property 4: Blur uppercases non-empty input**
    - Generate random non-empty strings. Apply the blur uppercase logic. Verify the result equals `input.trim().toUpperCase()`
    - Use `fast-check` with minimum 100 iterations
    - **Validates: Requirements 10.5**

  - [ ]* 8.7 Write unit tests for field wiring and validation
    - Test clicking Part magnifying glass calls `DialogService.open()` with mode 'single'
    - Test clicking Parts magnifying glass calls `DialogService.open()` with mode 'multi'
    - Test clicking Part "Lookup" button opens advanced lookup with mode 'single'
    - Test clicking Parts "Lookup" button opens advanced lookup with mode 'multi'
    - Test single-select simple dialog result populates Part field with formatted string
    - Test multi-select simple dialog result populates Parts field with selected parts display
    - Test single-select advanced lookup result populates Part field
    - Test multi-select advanced lookup result populates Parts field
    - Test dialog cancel/null result preserves existing state for both fields
    - Test "Advanced Lookup" bridge: dialog advancedLookup result opens advanced lookup in same mode
    - Test blur with valid part ID shows description
    - Test blur with invalid non-empty value shows "NOT DEFINED" error
    - Test blur with empty value hides description
    - Test blur uppercases the input value
    - Test clearing Part field input immediately hides description
    - _Requirements: 2.1, 2.2, 2.11, 5.2, 5.3, 5.4, 5.7, 6.1, 6.2, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 13.3_

- [x] 9. Document mock data in MOCK-DATA-GUIDE.md
  - [x] 9.1 Update MOCK-DATA-GUIDE.md with part data documentation
    - Document all mock data in `MOCK-DATA-GUIDE.md` following the FE-528 reference harness pattern
    - Include the flat parts list (simple and extended records)
    - Document filter dropdown data (stock locations, product categories, equipment types, task types, class types)
    - Document the data fields and their purposes
    - _Requirements: 11.6_

- [x] 10. Final checkpoint
  - Ensure the app builds successfully. Both Part and Parts fields work end-to-end: magnifying glass opens simple dialog, "Lookup" opens advanced slide-in, "Advanced Lookup" bridges from dialog to slide-in, search and filters work, selection populates fields, blur validation works. Ensure all tests pass, ask the user if questions arise.

- [x] 11. Accessibility audit
  - [x] 11.1 Audit and fix ARIA labels and properties across all components
    - Review every component template (PartFormPageComponent, SimplePartLookupDialogComponent, AdvancedPartsLookupComponent) for missing or incorrect ARIA attributes
    - Ensure all `AwButtonIconOnlyDirective` instances have descriptive `ariaLabel` attributes (e.g., "Search parts", "Scan barcode", "Open filters", "Open part lookup", "Open advanced part lookup")
    - Ensure all `AwDialogComponent` instances have `[ariaLabel]` set (e.g., "Part Lookup Dialog")
    - Ensure all `AwSearchComponent` instances have `[ariaLabel]` set (e.g., "Search parts")
    - Ensure all `AwSelectMenuComponent` instances have `[ariaLabel]` set matching their label text (e.g., "Stock Location", "Part filter", "Product Category", "Equipment Type", "Task Type", "Class Type")
    - Ensure all `AwToggleComponent` instances have `[ariaLabel]` set (e.g., "Include cross references")
    - Ensure all `AwTableComponent` / `aw-dialog` table instances have appropriate ARIA attributes
    - Ensure all `<input>` elements have either an associated `<label>`, `aria-label`, or `aria-labelledby`
    - Ensure the `AwSideDrawerComponent` has `[ariaLabel]` set (e.g., "Filter panel")
    - Ensure the `AwActionBarComponent` has appropriate ARIA attributes
    - Ensure the `AwBreadCrumbComponent` has `[ariaLabel]` set (e.g., "Page navigation breadcrumb")
    - Verify description text below Part field uses `aria-live="polite"` so screen readers announce changes
    - Verify error state ("NOT DEFINED") is conveyed via `role="alert"` or `aria-live="assertive"`

  - [x] 11.2 WCAG AA compliance review
    - Verify all interactive elements are keyboard accessible (Tab, Enter, Escape, Arrow keys where applicable)
    - Verify focus management: when dialog opens, focus moves to dialog; when dialog closes, focus returns to the triggering button
    - Verify focus management: when side drawer opens, focus moves to drawer; when drawer closes, focus returns to the filter icon button
    - Verify color contrast meets WCAG AA minimum (4.5:1 for normal text, 3:1 for large text) — the component library handles most of this, but verify any custom styles
    - Verify all form fields have visible labels (not just placeholder text)
    - Verify the empty state message in the advanced lookup is accessible to screen readers
    - Verify the "NOT DEFINED" error state is distinguishable by more than just color (text content provides the distinction)
    - Verify the selected parts display below the Parts field is accessible (screen reader can identify the list of selected parts)
    - Document any WCAG AA items that cannot be fully verified without manual assistive technology testing
    - Note: Full WCAG AA validation requires manual testing with assistive technologies (screen readers, keyboard-only navigation) and expert accessibility review. This task covers what can be verified programmatically and through code inspection.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All components use `ChangeDetectionStrategy.OnPush`, standalone components, `inject()` for DI, and Angular signals
- The simple dialog follows the FE-528 Asset Search Dialog pattern (flat AwDialog with TABLE)
- The advanced lookup follows the FE-528 Add Usage panel pattern (slide-in service)
- The side drawer filter panel uses `AwSideDrawerComponent` with filter type
- All filter dropdowns use `AwSelectMenuComponent` with `[enableSearch]="true"`

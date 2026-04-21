# Requirements Document

## Introduction

This document defines the requirements for a Part Lookup feature in the FE-876 Angular 18 harness application. The feature provides a form page with two Part lookup fields: a single-select "Part" field and a multi-select "Parts" field. Each field has two lookup mechanisms: a magnifying glass icon button that opens a simple flat-table dialog, and a "Lookup" outlined secondary button that opens an Advanced Parts Lookup slide-in service. The single-select Part field also supports direct text entry with type-and-tab-off validation. The form includes a standard action bar. All data is mock — no API calls are made.

## Glossary

- **Harness_App**: The Angular 18 sandbox application (`fe-harness-FE-876`) used for prototyping UI features with `@assetworks-llc/aw-component-lib@26.1.1-ng18`.
- **Form_Page**: The main page of the Harness_App displaying a form with Part and Parts fields, breadcrumb navigation, a title, a divider, and an action bar.
- **Part_Field**: A text input field on the Form_Page where the user enters or selects a single Part ID. Accompanied by a magnifying glass icon-only button (opens Simple_Part_Lookup_Dialog in single-select mode) and a "Lookup" outlined secondary button (opens Advanced_Parts_Lookup in single-select mode).
- **Parts_Field**: A text input field on the Form_Page for selecting multiple parts. Accompanied by a magnifying glass icon-only button (opens Simple_Part_Lookup_Dialog in multi-select mode) and a "Lookup" outlined secondary button (opens Advanced_Parts_Lookup in multi-select mode). Selected parts are displayed below the field as chips or a comma-separated list.
- **Simple_Part_Lookup_Dialog**: A modal dialog using `AwDialogComponent` with `DialogVariants.TABLE` that displays a flat table of parts (no hierarchy, no drill-down). Supports both single-select (radio buttons) and multi-select (checkboxes) modes. Includes a tertiary "Advanced Lookup" button that closes this dialog and opens the Advanced_Parts_Lookup instead.
- **Advanced_Parts_Lookup**: A slide-in service panel using `AwSideDrawerComponent` that provides advanced part search with quick filters, an extended table with more columns, and a side drawer filter panel. Follows the same slide-in pattern as the Add Usage panel in FE-528.
- **Side_Drawer_Filter_Panel**: A filter panel inside the Advanced_Parts_Lookup that opens from the right using `AwSideDrawerComponent` with filter type. Contains additional filter dropdowns for Equipment Type, Task Type, and Class Type.
- **Scan_Button**: A disabled placeholder barcode-scan icon button displayed next to the search bar in the Simple_Part_Lookup_Dialog. Visually styled as a blue filled button but non-functional in this harness.
- **Mock_Data_Service**: A centralized Angular service providing mock part data via signals for use across components.
- **Lookup_Field_Validation**: The type-and-tab-off pattern where the Part_Field value is resolved against mock data on blur, displaying a description or "NOT DEFINED" error.
- **Action_Bar**: The footer bar on the Form_Page containing Cancel (left) and Save (right) buttons using `AwActionBarComponent`.
- **Breadcrumb_Navigation**: Navigation elements displayed above the form title on the Form_Page.

## Requirements

### Requirement 1: Form Page Layout

**User Story:** As a designer, I want to see a form page with Part and Parts fields, each with two lookup buttons, so that I can review the layout for both simple and advanced lookup patterns.

#### Acceptance Criteria

1. THE Form_Page SHALL display a breadcrumb navigation bar above the page title.
2. THE Form_Page SHALL display the title "Any Form with a part lookup" below the breadcrumb navigation.
3. THE Form_Page SHALL display a full-width divider below the title.
4. THE Form_Page SHALL display the Part_Field and the Parts_Field on a single row below the divider.
5. THE Part_Field SHALL consist of a text input with a label "Part", a magnifying glass icon-only button adjacent to the input, and a "Lookup" outlined secondary button adjacent to the icon button.
6. THE Parts_Field SHALL consist of a text input with a label "Parts", a magnifying glass icon-only button adjacent to the input, and a "Lookup" outlined secondary button adjacent to the icon button.
7. THE Form_Page SHALL display an Action_Bar at the bottom with a "Cancel" button on the left and a "Save" button on the right.
8. WHEN parts are selected via the Parts_Field multi-select dialog or advanced lookup, THE Form_Page SHALL display the selected parts below the Parts_Field (e.g., as chips or a comma-separated list in the format "(PART_ID) Part Description").

### Requirement 2: Simple Part Lookup Dialog

**User Story:** As a user, I want to open a simple Part Lookup dialog by clicking the magnifying glass icon so that I can browse and select parts from a flat list.

#### Acceptance Criteria

1. WHEN the user clicks the magnifying glass icon-only button adjacent to the Part_Field, THE Harness_App SHALL open the Simple_Part_Lookup_Dialog in single-select mode using the DialogService.
2. WHEN the user clicks the magnifying glass icon-only button adjacent to the Parts_Field, THE Harness_App SHALL open the Simple_Part_Lookup_Dialog in multi-select mode using the DialogService.
3. THE Simple_Part_Lookup_Dialog SHALL use `AwDialogComponent` with `DialogVariants.TABLE` variant.
4. THE Simple_Part_Lookup_Dialog SHALL display a dark header with the title "Part Lookup".
5. THE Simple_Part_Lookup_Dialog SHALL display a flat table of parts with NO hierarchical drill-down, NO breadcrumbs, and NO drill-down arrows.
6. IN single-select mode, THE Simple_Part_Lookup_Dialog SHALL enable single-select (radio buttons) on the table.
7. IN multi-select mode, THE Simple_Part_Lookup_Dialog SHALL enable multi-select (checkboxes) on the table.
8. THE Simple_Part_Lookup_Dialog SHALL extend BaseDialogComponent to support escape key dismissal and backdrop click closing.
9. THE Simple_Part_Lookup_Dialog SHALL display a Scan_Button (barcode-scan icon) next to the search bar, styled as a blue filled button, in a disabled state as a non-functional placeholder.
10. THE Simple_Part_Lookup_Dialog footer SHALL display three buttons: "Cancel" (secondary) on the left, "Advanced Lookup" (tertiary) in the center, and "Add" (primary) on the right.
11. WHEN the user clicks the "Advanced Lookup" tertiary button, THE Simple_Part_Lookup_Dialog SHALL close and THE Harness_App SHALL open the Advanced_Parts_Lookup in the same selection mode (single or multi).

### Requirement 3: Simple Part Lookup Dialog Table Columns

**User Story:** As a user, I want to see part information in a structured flat table so that I can identify the correct part.

#### Acceptance Criteria

1. THE Simple_Part_Lookup_Dialog table SHALL display a selection column (checkbox or radio) as the first column.
2. THE Simple_Part_Lookup_Dialog table SHALL display a "Part" column using a custom cell template that shows the Part ID on the first line and the Part Description on the second line.
3. THE Simple_Part_Lookup_Dialog table SHALL display a "Keyword" column as a text column.
4. THE Simple_Part_Lookup_Dialog table SHALL display a "Cross-Ref" column as a text column.
5. THE Simple_Part_Lookup_Dialog table SHALL display a "Cost" column as a right-aligned currency column formatted as "$XX.XX".

### Requirement 4: Simple Part Lookup Dialog Search

**User Story:** As a user, I want to search across all part data in the simple dialog table so that I can quickly find a specific part.

#### Acceptance Criteria

1. THE Simple_Part_Lookup_Dialog SHALL display a search bar above the table.
2. WHEN the user types in the search bar, THE Simple_Part_Lookup_Dialog SHALL filter the table data across all visible columns (Part ID, Part Description, Keyword, Cross-Ref, and Cost).
3. THE search filtering SHALL be case-insensitive.
4. WHEN the user clears the search bar, THE Simple_Part_Lookup_Dialog SHALL display all data.

### Requirement 5: Part Selection from Simple Dialog

**User Story:** As a user, I want to select a part (or multiple parts) from the simple dialog and have it populate the corresponding field so that I can complete the form.

#### Acceptance Criteria

1. WHEN the user selects a row and clicks "Add" in single-select mode, THE Simple_Part_Lookup_Dialog SHALL close and return the selected part data to the Form_Page.
2. WHEN the Simple_Part_Lookup_Dialog returns a selected part in single-select mode, THE Part_Field SHALL be populated with the format "(PART_ID) Part Description".
3. WHEN the Simple_Part_Lookup_Dialog returns a selected part in single-select mode, THE Form_Page SHALL display the part description below the Part_Field.
4. WHEN the user clicks "Cancel" in the Simple_Part_Lookup_Dialog, THE Simple_Part_Lookup_Dialog SHALL close without modifying the Part_Field or Parts_Field.
5. IN multi-select mode, THE Simple_Part_Lookup_Dialog SHALL allow the user to select multiple parts using checkboxes.
6. WHEN the user selects one or more rows and clicks "Add" in multi-select mode, THE Simple_Part_Lookup_Dialog SHALL close and return an array of selected part data to the Form_Page.
7. WHEN the Simple_Part_Lookup_Dialog returns selected parts in multi-select mode, THE Form_Page SHALL display the selected parts below the Parts_Field (e.g., as chips or a comma-separated list in the format "(PART_ID) Part Description").

### Requirement 6: Advanced Parts Lookup Slide-In Service

**User Story:** As a user, I want an advanced parts lookup with more filters and columns so that I can find parts using detailed criteria.

#### Acceptance Criteria

1. WHEN the user clicks the "Lookup" outlined secondary button adjacent to the Part_Field, THE Harness_App SHALL open the Advanced_Parts_Lookup in single-select mode.
2. WHEN the user clicks the "Lookup" outlined secondary button adjacent to the Parts_Field, THE Harness_App SHALL open the Advanced_Parts_Lookup in multi-select mode.
3. THE Advanced_Parts_Lookup SHALL be implemented as a slide-in service using `AwSideDrawerComponent`, following the same pattern as the Add Usage panel in FE-528.
4. THE Advanced_Parts_Lookup SHALL display the title "Part Search Advanced Lookup".
5. THE Advanced_Parts_Lookup SHALL display a footer with a "Cancel" button on the left and a "Select" button on the right.
6. IN single-select mode, THE Advanced_Parts_Lookup table SHALL enable single-select (radio buttons).
7. IN multi-select mode, THE Advanced_Parts_Lookup table SHALL enable multi-select (checkboxes).
8. WHEN the user selects part(s) and clicks "Select", THE Advanced_Parts_Lookup SHALL close and return the selected part data to the Form_Page.
9. WHEN the user clicks "Cancel", THE Advanced_Parts_Lookup SHALL close without modifying the Part_Field or Parts_Field.

### Requirement 7: Advanced Parts Lookup Quick Filters

**User Story:** As a user, I want quick filter controls above the advanced lookup table so that I can narrow down results efficiently.

#### Acceptance Criteria

1. THE Advanced_Parts_Lookup SHALL display a quick filters row above the table.
2. THE quick filters row SHALL include a search bar using `AwSearchComponent`.
3. THE quick filters row SHALL include a "Stock Location" dropdown using `AwSelectMenuComponent` with SINGLE-select, search enabled, showing "(Default Location ID) Desc..." as the default value.
4. THE quick filters row SHALL include a "Part" dropdown using `AwSelectMenuComponent` with MULTI-select, "Select All" option, search enabled, and placeholder "Filter on ID or Description".
5. THE quick filters row SHALL include a "Product Category" dropdown using `AwSelectMenuComponent` with MULTI-select, "Select All" option, search enabled, and placeholder "Filter on Category".
6. THE quick filters row SHALL include an "Include XRefs" toggle using `AwToggleComponent`, defaulting to ON/checked.
7. THE quick filters row SHALL include a filter icon button using `AwButtonIconOnlyDirective` that opens the Side_Drawer_Filter_Panel.

### Requirement 8: Advanced Parts Lookup Table Columns

**User Story:** As a user, I want to see extended part information in the advanced lookup table so that I can make informed selections.

#### Acceptance Criteria

1. THE Advanced_Parts_Lookup table SHALL display an "Image" column with a thumbnail placeholder.
2. THE Advanced_Parts_Lookup table SHALL display a "Part" column using a custom cell template that shows the Part ID on the first line and the Part Description on the second line.
3. THE Advanced_Parts_Lookup table SHALL display a "Category" column using a custom cell template that shows the Category ID on the first line and the Category Description on the second line.
4. THE Advanced_Parts_Lookup table SHALL display an "On Hand" column as a numeric column.
5. THE Advanced_Parts_Lookup table SHALL display an "On Order" column as a numeric column.
6. THE Advanced_Parts_Lookup table SHALL display a "Committed" column as a numeric column.
7. THE Advanced_Parts_Lookup table SHALL display a "Request Out Pending" column as a numeric column.
8. THE Advanced_Parts_Lookup table SHALL display a "Manufacturer Part Number" column as a text column.
9. THE Advanced_Parts_Lookup table SHALL display a "Manufacturer" column as a text column.
10. WHEN no results match the applied filters, THE Advanced_Parts_Lookup table SHALL display the empty state message "No results returned. Adjust quick filters and/or side filter."

### Requirement 9: Advanced Parts Lookup Side Drawer Filter Panel

**User Story:** As a user, I want additional filter options in a side drawer so that I can apply more specific criteria to narrow down parts.

#### Acceptance Criteria

1. WHEN the user clicks the filter icon button in the quick filters row, THE Advanced_Parts_Lookup SHALL open the Side_Drawer_Filter_Panel from the right.
2. THE Side_Drawer_Filter_Panel SHALL use `AwSideDrawerComponent` with filter type.
3. THE Side_Drawer_Filter_Panel SHALL display the title "Filter".
4. THE Side_Drawer_Filter_Panel SHALL display a "Clear All" link at the top that resets all filter selections.
5. THE Side_Drawer_Filter_Panel SHALL include an "Equipment Type" dropdown using `AwSelectMenuComponent` with MULTI-select, search enabled, and placeholder "Filter on Equipment Type".
6. THE Side_Drawer_Filter_Panel SHALL include a "Task Type" dropdown using `AwSelectMenuComponent` with MULTI-select, search enabled, and placeholder "Filter on Task Type".
7. THE Side_Drawer_Filter_Panel SHALL include a "Class Type" dropdown using `AwSelectMenuComponent` with MULTI-select, search enabled, and placeholder "Filter on Class Type".

### Requirement 10: Part Field Type-and-Tab-Off Validation

**User Story:** As a user, I want to type a Part ID directly into the Part field and have it validated on blur so that I can quickly enter known part IDs without opening the dialog.

#### Acceptance Criteria

1. WHEN the user types a value in the Part_Field and the field loses focus (blur), THE Harness_App SHALL resolve the typed value against the mock part data using case-insensitive matching.
2. WHEN a matching part is found, THE Harness_App SHALL display the part description below the Part_Field.
3. WHEN no matching part is found and the typed value is non-empty, THE Harness_App SHALL display "NOT DEFINED" as an error below the Part_Field.
4. WHEN the Part_Field is empty on blur, THE Harness_App SHALL hide the description text below the Part_Field.
5. WHEN the Part_Field loses focus with a non-empty value, THE Harness_App SHALL uppercase the input value.
6. WHEN the user clears the Part_Field content (e.g., select-all and delete, or clicking a clear button), THE Harness_App SHALL immediately hide the description text without waiting for blur.

### Requirement 11: Mock Data Structure

**User Story:** As a developer, I want well-structured mock data that supports both the simple dialog and the advanced lookup so that the harness accurately represents the Part Lookup feature.

#### Acceptance Criteria

1. THE Mock_Data_Service SHALL provide a flat list of parts for the Simple_Part_Lookup_Dialog, each containing: partId, partDescription, keyword, crossReference, and cost.
2. THE Mock_Data_Service SHALL provide extended part records for the Advanced_Parts_Lookup, each additionally containing: categoryId, categoryDescription, onHand, onOrder, committed, requestOutPending, manufacturerPartNumber, manufacturer, and imageUrl.
3. THE Mock_Data_Service SHALL provide mock data for filter dropdowns: stock locations, product categories, equipment types, task types, and class types.
4. THE Mock_Data_Service SHALL provide a `flatPartLookup` computed signal that contains all parts for type-and-tab-off resolution.
5. EACH part record SHALL contain enough variety across all fields to demonstrate search filtering across all visible columns.
6. THE mock data SHALL be documented in MOCK-DATA-GUIDE.md following the pattern established in the FE-528 reference harness.

### Requirement 12: Application Routing and Navigation

**User Story:** As a user, I want the form page to be the main page of the harness so that I see it immediately on load.

#### Acceptance Criteria

1. THE Harness_App SHALL load the Form_Page as the default route (`/`).
2. THE Harness_App SHALL use lazy-loaded routing via `loadComponent` in `app.routes.ts`.
3. THE Form_Page SHALL be a standalone Angular component using `ChangeDetectionStrategy.OnPush`.
4. THE Form_Page SHALL use `inject()` for dependency injection and Angular signals for reactive state management.

### Requirement 13: Error Handling for Dialog and Slide-In Dismissal

**User Story:** As a user, I want the Part Lookup dialog and advanced lookup to handle dismissal gracefully so that I do not lose form state.

#### Acceptance Criteria

1. WHEN the user presses the Escape key while the Simple_Part_Lookup_Dialog is open, THE Simple_Part_Lookup_Dialog SHALL close without modifying the Part_Field or Parts_Field.
2. WHEN the user clicks the backdrop while the Simple_Part_Lookup_Dialog is open, THE Simple_Part_Lookup_Dialog SHALL close without modifying the Part_Field or Parts_Field.
3. IF the Simple_Part_Lookup_Dialog or Advanced_Parts_Lookup is closed without a selection (via Cancel, Escape, or backdrop click), THEN THE Harness_App SHALL preserve the existing Part_Field value and description state, and the existing Parts_Field selections.

### Requirement 14: Selection Mode Consistency

**User Story:** As a user, I want the selection mode to be consistent between the simple dialog and the advanced lookup so that my experience is seamless.

#### Acceptance Criteria

1. THE Simple_Part_Lookup_Dialog and Advanced_Parts_Lookup SHALL accept a `mode` input property with values `'single'` or `'multi'` to control selection behavior.
2. IN multi-select mode, THE table SHALL display checkboxes in the first column for row selection.
3. IN single-select mode, THE table SHALL display radio buttons for row selection.
4. THE "Add" button label SHALL remain "Add" in the Simple_Part_Lookup_Dialog for both modes.
5. THE "Select" button label SHALL remain "Select" in the Advanced_Parts_Lookup for both modes.
6. WHEN the "Advanced Lookup" button in the Simple_Part_Lookup_Dialog opens the Advanced_Parts_Lookup, THE Advanced_Parts_Lookup SHALL use the same selection mode as the dialog that triggered it.

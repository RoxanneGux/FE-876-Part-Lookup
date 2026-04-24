# Mock Data Guide — fe-harness-FE-876

All data in this harness is mock. No API calls are made. This guide documents every piece of mock data available.

## Available Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` (default) | Part Form Page | Form page with Part (single-select) and Parts (multi-select) lookup fields |

## Mock Data Files

| File | Purpose |
|------|---------|
| `src/app/services/mock-data.service.ts` | Provides all part data and filter dropdown options via Angular signals |
| `src/app/features/part-lookup/part-lookup.models.ts` | Defines `SimplePartRecord` and `ExtendedPartRecord` interfaces |

## Simple Parts (20 records)

Flat list of parts displayed in the Simple Part Lookup Dialog.

| Part ID | Description | Keyword | Cross Reference | Cost |
|---------|-------------|---------|-----------|------|
| PRT-OIL-001 | Oil Pump Assembly | Pump | OP-XREF-601 | $125.00 |
| PRT-OIL-002 | Oil Pan Gasket Set | Gasket | OG-XREF-602 | $22.50 |
| PRT-OIL-003 | Oil Pressure Sensor | Sensor | OS-XREF-603 | $35.75 |
| PRT-FLT-001 | Standard Oil Filter | Filter | OEM-FLT-100 | $12.50 |
| PRT-CLN-001 | Engine Coolant 1 Gal | Coolant | COOL-REF-50 | $18.75 |
| PRT-ENG-001 | Spark Plug Iridium | Ignition | SP-XREF-200 | $8.99 |
| PRT-ENG-002 | Timing Belt Kit | Belt | TB-XREF-300 | $45.00 |
| PRT-BRK-001 | Brake Fluid DOT 4 | Fluid | BF-XREF-400 | $9.50 |
| PRT-BRK-002 | Rear Brake Drum | Drum | BD-XREF-500 | $67.25 |
| PRT-FBK-001 | Front Brake Rotor | Rotor | FR-XREF-701 | $89.99 |
| PRT-FBK-002 | Front Brake Pad Set | Pad | FP-XREF-702 | $42.00 |
| PRT-FBK-003 | Front Caliper Left | Caliper | FC-XREF-703 | $155.00 |
| PRT-ELEC-001 | Alternator 12V 150A | Electrical | ALT-XREF-801 | $210.00 |
| PRT-ELEC-002 | Starter Motor Rebuilt | Starter | SM-XREF-802 | $175.50 |
| PRT-HVY-001 | Hydraulic Cylinder Ram | Hydraulic | HC-XREF-901 | $485.00 |
| PRT-HVY-002 | Track Roller Assembly | Track | TR-XREF-902 | $320.00 |
| PRT-HVY-003 | Bucket Tooth Pin Set | Bucket | BT-XREF-903 | $78.50 |
| PRT-GEN-001 | Generator Voltage Regulator | Regulator | GV-XREF-1001 | $195.00 |
| PRT-GEN-002 | Fuel Injector Nozzle | Injector | FI-XREF-1002 | $142.75 |
| PRT-GEN-003 | Radiator Cooling Fan | Cooling | RC-XREF-1003 | $265.00 |

## Extended Parts (20 records)

Extended part records displayed in the Advanced Parts Lookup table. Each record includes all simple part fields plus inventory and manufacturer data.

| Part ID | Category ID | Category Desc | On Hand | On Order | Committed | Req Out Pending | Mfr Part # | Manufacturer |
|---------|-------------|---------------|---------|----------|-----------|-----------------|-------------|--------------|
| PRT-OIL-001 | CAT-ENG | Engine Components | 15 | 5 | 3 | 1 | MFR-OP-601 | Delphi |
| PRT-OIL-002 | CAT-ENG | Engine Components | 42 | 0 | 8 | 0 | MFR-OG-602 | Fel-Pro |
| PRT-OIL-003 | CAT-ENG | Engine Components | 8 | 10 | 2 | 0 | MFR-OS-603 | Bosch |
| PRT-FLT-001 | CAT-ENG | Engine Components | 120 | 50 | 15 | 3 | MFR-FLT-100 | Fram |
| PRT-CLN-001 | CAT-ENG | Engine Components | 65 | 20 | 10 | 2 | MFR-CLN-50 | Prestone |
| PRT-ENG-001 | CAT-ENG | Engine Components | 200 | 0 | 25 | 0 | MFR-SP-200 | NGK |
| PRT-ENG-002 | CAT-ENG | Engine Components | 18 | 12 | 4 | 1 | MFR-TB-300 | Gates |
| PRT-BRK-001 | CAT-BRK | Brake Components | 90 | 30 | 12 | 0 | MFR-BF-400 | Castrol |
| PRT-BRK-002 | CAT-BRK | Brake Components | 6 | 8 | 1 | 0 | MFR-BD-500 | ACDelco |
| PRT-FBK-001 | CAT-BRK | Brake Components | 22 | 10 | 5 | 2 | MFR-FR-701 | Brembo |
| PRT-FBK-002 | CAT-BRK | Brake Components | 35 | 15 | 7 | 1 | MFR-FP-702 | Wagner |
| PRT-FBK-003 | CAT-BRK | Brake Components | 4 | 6 | 0 | 0 | MFR-FC-703 | Cardone |
| PRT-ELEC-001 | CAT-ELEC | Electrical Components | 10 | 3 | 2 | 0 | MFR-ALT-801 | Denso |
| PRT-ELEC-002 | CAT-ELEC | Electrical Components | 7 | 5 | 1 | 0 | MFR-SM-802 | Remy |
| PRT-HVY-001 | CAT-ENG | Engine Components | 5 | 3 | 1 | 0 | MFR-HC-901 | Parker |
| PRT-HVY-002 | CAT-ENG | Engine Components | 12 | 6 | 2 | 1 | MFR-TR-902 | Caterpillar |
| PRT-HVY-003 | CAT-ENG | Engine Components | 48 | 20 | 8 | 0 | MFR-BT-903 | Komatsu |
| PRT-GEN-001 | CAT-ELEC | Electrical Components | 9 | 4 | 2 | 0 | MFR-GV-1001 | Cummins |
| PRT-GEN-002 | CAT-ENG | Engine Components | 15 | 8 | 3 | 1 | MFR-FI-1002 | Bosch |
| PRT-GEN-003 | CAT-ENG | Engine Components | 3 | 2 | 0 | 0 | MFR-RC-1003 | Denso |

## Filter Dropdown Data

### Stock Locations (3)

Single-select dropdown in the Advanced Parts Lookup quick filters row.

| Value | Label |
|-------|-------|
| LOC-MAIN | (LOC-MAIN) Main Warehouse |
| LOC-EAST | (LOC-EAST) East Bay Storage |
| LOC-WEST | (LOC-WEST) West Yard |

### Product Categories (3)

Multi-select dropdown in the Advanced Parts Lookup quick filters row.

| Value | Label |
|-------|-------|
| CAT-ENG | Engine Components |
| CAT-BRK | Brake Components |
| CAT-ELEC | Electrical Components |

### Equipment Types (3)

Multi-select dropdown in the side drawer filter panel.

| Value | Label |
|-------|-------|
| EQT-VEH | Vehicle |
| EQT-HVY | Heavy Equipment |
| EQT-GEN | Generator |

### Task Types (3)

Multi-select dropdown in the side drawer filter panel.

| Value | Label |
|-------|-------|
| TSK-REP | Repair |
| TSK-PM | Preventive Maintenance |
| TSK-INS | Inspection |

### Class Types (3)

Multi-select dropdown in the side drawer filter panel.

| Value | Label |
|-------|-------|
| CLS-A | Class A — Critical |
| CLS-B | Class B — Standard |
| CLS-C | Class C — Low Priority |

## Lookup Field Descriptions

The Part field supports type-and-tab-off validation. When a user types a value and tabs off (blur), the field resolves the value against mock data and displays a description below the input.

| Field | Data Source | Match Key | Returns |
|-------|-----------|-----------|---------|
| Part | `MockDataService.flatPartLookup()` | `partId` (case-insensitive) | `partDescription` |

All lookups are case-insensitive. Empty or whitespace-only input hides the description. Non-empty input that does not match any part ID shows "NOT DEFINED" as an error. The input value is uppercased on blur.

### Lookup Scenarios

| Scenario | How | Expected Result |
|----------|-----|-----------------|
| Match found | Type `prt-oil-001` in Part field, tab off | "Oil Pump Assembly" appears below the field |
| Match found (uppercase) | Type `PRT-BRK-001` in Part field, tab off | "Brake Fluid DOT 4" appears below the field |
| No match | Type `INVALID` in Part field, tab off | "NOT DEFINED" appears below the field |
| Empty field | Clear the Part field and tab off | Description text is hidden |
| Dialog selection (single) | Select a part via Simple Part Lookup dialog | Part field shows "(PRT-OIL-001) Oil Pump Assembly" |
| Dialog selection (multi) | Select parts via Simple Part Lookup dialog (multi-select) | Parts field shows selected parts as chips or comma-separated list |

## Quick Scenarios

| I want to... | How |
|--------------|-----|
| See the part form page | Navigate to `http://localhost:4200` — the default route loads the Part Form Page |
| Open the simple part lookup (single) | Click the magnifying glass icon next to the Part field |
| Open the simple part lookup (multi) | Click the magnifying glass icon next to the Parts field |
| Open the advanced part lookup (single) | Click the "Lookup" button next to the Part field |
| Open the advanced part lookup (multi) | Click the "Lookup" button next to the Parts field |
| Bridge from simple to advanced lookup | Open the simple dialog → click "Advanced Lookup" tertiary button → advanced lookup opens in the same mode |
| Search parts in simple dialog | Open the simple dialog → type in the search bar to filter across Part ID, Description, Keyword, Cross-Ref, and Cost |
| Filter parts in advanced lookup | Use the quick filters row (search, stock location, part, product category, include cross references dropdown) |
| Open the side drawer filter panel | In the advanced lookup, click the filter icon button → side drawer opens with Equipment Type, Task Type, and Class Type dropdowns |
| Clear all side drawer filters | In the side drawer filter panel, click "Clear All" |
| Select a single part | Open any lookup in single-select mode → select a row (radio button) → click "Add" or "Select" |
| Select multiple parts | Open any lookup in multi-select mode → select rows (checkboxes) → click "Add" or "Select" |
| Validate a typed part ID | Type a part ID in the Part field and tab off → description or "NOT DEFINED" appears below |
| See the empty state | In the advanced lookup, apply filters that match no parts → "No results returned. Adjust quick filters and/or side filter." is displayed |

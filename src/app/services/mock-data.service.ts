import { Injectable, signal, computed } from '@angular/core';
import { SingleSelectOption, MultiSelectOption } from '@assetworks-llc/aw-component-lib';
import { SimplePartRecord, ExtendedPartRecord } from '../features/part-lookup/part-lookup.models';

// ── Simple Parts (flat list for Simple Part Lookup Dialog) ──

const SIMPLE_PARTS: SimplePartRecord[] = [
  { partId: '30001', partSuffix: '00', partDescription: 'OIL FILTER', keyword: 'OIL FILTER', crossReference: 'OEM-FLT-100', cost: 12.50 },
  { partId: '30002', partSuffix: '00', partDescription: 'AIR FILTER ELEMENT', keyword: 'AIR FILTER', crossReference: 'OEM-AIR-200', cost: 18.75 },
  { partId: '30003', partSuffix: '00', partDescription: 'BRAKE PAD SET - FRONT', keyword: 'BRAKE PAD', crossReference: 'BP-XREF-300', cost: 42.00 },
  { partId: '30004', partSuffix: '00', partDescription: 'FUZZY DICE - RED', keyword: 'FUZZY DICE', crossReference: '', cost: 5.99 },
  { partId: '30008', partSuffix: '00', partDescription: 'ALARM HORN ASSEMBLY', keyword: 'ALARM/HORN', crossReference: 'AH-XREF-800', cost: 67.25 },
  { partId: '30021', partSuffix: '00', partDescription: 'HYDRAULIC FILTER', keyword: 'FILTER-OIL', crossReference: 'HF-XREF-210', cost: 35.75 },
  { partId: '30063', partSuffix: '00', partDescription: 'CABIN AIR FILTER', keyword: 'FILTER-AIR', crossReference: 'CA-XREF-630', cost: 22.50 },
  { partId: 'AIR FILTER', partSuffix: '00', partDescription: 'AIR FILTER - STANDARD', keyword: 'AIR FILTER', crossReference: 'AF-STD-001', cost: 15.00 },
  { partId: 'ALTERNATOR', partSuffix: '00', partDescription: 'ALTERNATOR - NEW', keyword: 'ALTERNATOR', crossReference: 'ALT-NEW-001', cost: 210.00 },
  { partId: 'ALTERNATOR', partSuffix: '01', partDescription: 'ALTERNATOR - REBUILT', keyword: 'ALTERNATOR', crossReference: 'ALT-REB-001', cost: 155.00 },
  { partId: 'ALTERNATOR', partSuffix: '02', partDescription: 'ALTERNATOR - USED', keyword: 'ALTERNATOR', crossReference: 'ALT-USD-001', cost: 85.00 },
  { partId: 'BATTERY WITH CORE', partSuffix: '00', partDescription: 'BATTERY 12V WITH CORE', keyword: 'BATTERY', crossReference: 'BAT-CORE-01', cost: 125.00 },
  { partId: 'BATTERY-51R', partSuffix: '00', partDescription: 'BATTERY GROUP 51R', keyword: 'BATTERY', crossReference: 'BAT-51R-01', cost: 139.99 },
  { partId: 'BRAKES', partSuffix: '00', partDescription: 'BRAKE SHOE SET - REAR', keyword: 'BRAKE PAD', crossReference: 'BS-XREF-400', cost: 38.50 },
  { partId: 'ELECTRIC MOTOR', partSuffix: '00', partDescription: 'ELECTRIC MOTOR 1/2 HP', keyword: 'MOTOR', crossReference: 'EM-XREF-500', cost: 175.50 },
  { partId: 'FRAM-30001', partSuffix: '00', partDescription: 'FRAM OIL FILTER PH3506', keyword: 'FILTER-OIL', crossReference: 'FRAM-PH3506', cost: 8.99 },
  { partId: 'OIL FILTER', partSuffix: '00', partDescription: 'OIL FILTER - STANDARD', keyword: 'OIL FILTER', crossReference: 'OF-STD-001', cost: 11.50 },
  { partId: '31-CP', partSuffix: '00', partDescription: 'COOLANT PUMP ASSEMBLY', keyword: 'MOTOR', crossReference: 'CP-XREF-310', cost: 195.00 },
  { partId: '6213251', partSuffix: '00', partDescription: 'FUEL INJECTOR NOZZLE', keyword: 'ALTERNATOR', crossReference: 'FI-XREF-621', cost: 142.75 },
  { partId: 'ACA PART', partSuffix: '00', partDescription: 'ACA CERTIFIED PART', keyword: 'FILTER-AIR', crossReference: 'ACA-CERT-01', cost: 28.00 },
];

// ── Extended Parts (for Advanced Parts Lookup) ──

const EXTENDED_PARTS: ExtendedPartRecord[] = [
  { ...SIMPLE_PARTS[0], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-A', onHand: 120, onOrder: 50, committed: 15, requestOutPending: 3, manufacturerPartNumber: 'MFR-OIL-30001', manufacturer: 'Fram', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[1], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-B', onHand: 85, onOrder: 20, committed: 10, requestOutPending: 0, manufacturerPartNumber: 'MFR-AIR-30002', manufacturer: 'Wix', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[2], categoryId: 'CAT-BRK', categoryDescription: 'Brake Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 35, onOrder: 15, committed: 7, requestOutPending: 1, manufacturerPartNumber: 'MFR-BRK-30003', manufacturer: 'Wagner', imageUrl: 'brakes.svg' },
  { ...SIMPLE_PARTS[3], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-WEST', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-INS', classTypeId: 'CLS-C', onHand: 200, onOrder: 0, committed: 0, requestOutPending: 0, manufacturerPartNumber: '', manufacturer: '', imageUrl: '' },
  { ...SIMPLE_PARTS[4], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-B', onHand: 12, onOrder: 6, committed: 2, requestOutPending: 0, manufacturerPartNumber: 'MFR-AH-30008', manufacturer: 'Bosch', imageUrl: '' },
  { ...SIMPLE_PARTS[5], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-HVY', taskTypeId: 'TSK-PM', classTypeId: 'CLS-A', onHand: 42, onOrder: 10, committed: 8, requestOutPending: 1, manufacturerPartNumber: 'MFR-HF-30021', manufacturer: 'Parker', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[6], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-B', onHand: 65, onOrder: 20, committed: 5, requestOutPending: 2, manufacturerPartNumber: 'MFR-CA-30063', manufacturer: 'Fram', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[7], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-A', onHand: 90, onOrder: 30, committed: 12, requestOutPending: 0, manufacturerPartNumber: 'MFR-AF-STD', manufacturer: 'Wix', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[8], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 10, onOrder: 3, committed: 2, requestOutPending: 0, manufacturerPartNumber: 'MFR-ALT-NEW', manufacturer: 'Denso', imageUrl: 'battery.svg' },
  { ...SIMPLE_PARTS[9], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-B', onHand: 7, onOrder: 5, committed: 1, requestOutPending: 0, manufacturerPartNumber: 'MFR-ALT-REB', manufacturer: 'Remy', imageUrl: 'battery.svg' },
  { ...SIMPLE_PARTS[10], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-C', onHand: 4, onOrder: 2, committed: 0, requestOutPending: 0, manufacturerPartNumber: 'MFR-ALT-USD', manufacturer: 'Cardone', imageUrl: 'battery.svg' },
  { ...SIMPLE_PARTS[11], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 22, onOrder: 8, committed: 3, requestOutPending: 1, manufacturerPartNumber: 'MFR-BAT-CORE', manufacturer: 'Interstate', imageUrl: 'battery.svg' },
  { ...SIMPLE_PARTS[12], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-B', onHand: 18, onOrder: 10, committed: 4, requestOutPending: 0, manufacturerPartNumber: 'MFR-BAT-51R', manufacturer: 'Optima', imageUrl: 'battery.svg' },
  { ...SIMPLE_PARTS[13], categoryId: 'CAT-BRK', categoryDescription: 'Brake Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 28, onOrder: 12, committed: 5, requestOutPending: 2, manufacturerPartNumber: 'MFR-BRK-SHOE', manufacturer: 'Brembo', imageUrl: 'brakes.svg' },
  { ...SIMPLE_PARTS[14], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-WEST', equipmentTypeId: 'EQT-HVY', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 6, onOrder: 3, committed: 1, requestOutPending: 0, manufacturerPartNumber: 'MFR-EM-500', manufacturer: 'Baldor', imageUrl: 'battery.svg' },
  { ...SIMPLE_PARTS[15], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-B', onHand: 150, onOrder: 40, committed: 20, requestOutPending: 5, manufacturerPartNumber: 'FRAM-PH3506', manufacturer: 'Fram', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[16], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-A', onHand: 75, onOrder: 25, committed: 10, requestOutPending: 0, manufacturerPartNumber: 'MFR-OF-STD', manufacturer: 'Purolator', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[17], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-GEN', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 5, onOrder: 3, committed: 1, requestOutPending: 0, manufacturerPartNumber: 'MFR-CP-310', manufacturer: 'Cummins', imageUrl: '' },
  { ...SIMPLE_PARTS[18], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-GEN', taskTypeId: 'TSK-PM', classTypeId: 'CLS-B', onHand: 15, onOrder: 8, committed: 3, requestOutPending: 1, manufacturerPartNumber: 'MFR-FI-621', manufacturer: 'Bosch', imageUrl: '' },
  { ...SIMPLE_PARTS[19], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-WEST', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-INS', classTypeId: 'CLS-C', onHand: 48, onOrder: 15, committed: 8, requestOutPending: 0, manufacturerPartNumber: 'ACA-CERT-01', manufacturer: 'ACA', imageUrl: '' },
];

// ── Filter Dropdown Options ──

const STOCK_LOCATIONS: SingleSelectOption[] = [
  { label: '(LOC-MAIN) Main Warehouse', value: 'LOC-MAIN' },
  { label: '(LOC-EAST) East Bay Storage', value: 'LOC-EAST' },
  { label: '(LOC-WEST) West Yard', value: 'LOC-WEST' },
];

const PRODUCT_CATEGORIES: MultiSelectOption[] = [
  { label: 'Engine Components', value: 'CAT-ENG', checked: false },
  { label: 'Brake Components', value: 'CAT-BRK', checked: false },
  { label: 'Electrical Components', value: 'CAT-ELEC', checked: false },
];

const EQUIPMENT_TYPES: MultiSelectOption[] = [
  { label: 'Vehicle', value: 'EQT-VEH', checked: false },
  { label: 'Heavy Equipment', value: 'EQT-HVY', checked: false },
  { label: 'Generator', value: 'EQT-GEN', checked: false },
];

const TASK_TYPES: MultiSelectOption[] = [
  { label: 'Repair', value: 'TSK-REP', checked: false },
  { label: 'Preventive Maintenance', value: 'TSK-PM', checked: false },
  { label: 'Inspection', value: 'TSK-INS', checked: false },
];

const CLASS_TYPES: MultiSelectOption[] = [
  { label: 'Class A \u2014 Critical', value: 'CLS-A', checked: false },
  { label: 'Class B \u2014 Standard', value: 'CLS-B', checked: false },
  { label: 'Class C \u2014 Low Priority', value: 'CLS-C', checked: false },
];

// ── Service ──

/**
 * Provides mock part data and filter dropdown options for the Part Lookup feature.
 * All data is static — no API calls are made.
 */
@Injectable({ providedIn: 'root' })
export class MockDataService {

  /** Flat list of simple part records for the Simple Part Lookup Dialog. */
  public readonly simpleParts = signal<SimplePartRecord[]>(SIMPLE_PARTS);

  /** Extended part records for the Advanced Parts Lookup table. */
  public readonly extendedParts = signal<ExtendedPartRecord[]>(EXTENDED_PARTS);

  /** All simple parts available for type-and-tab-off resolution. */
  public readonly flatPartLookup = computed(() => this.simpleParts());

  /** Stock location options for the Advanced Parts Lookup single-select dropdown. */
  public readonly stockLocations = signal<SingleSelectOption[]>(STOCK_LOCATIONS);

  /** Product category options for the Advanced Parts Lookup multi-select dropdown. */
  public readonly productCategories = signal<MultiSelectOption[]>(PRODUCT_CATEGORIES);

  /** Equipment type options for the side drawer filter panel multi-select dropdown. */
  public readonly equipmentTypes = signal<MultiSelectOption[]>(EQUIPMENT_TYPES);

  /** Task type options for the side drawer filter panel multi-select dropdown. */
  public readonly taskTypes = signal<MultiSelectOption[]>(TASK_TYPES);

  /** Class type options for the side drawer filter panel multi-select dropdown. */
  public readonly classTypes = signal<MultiSelectOption[]>(CLASS_TYPES);
}

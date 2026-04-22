import { Injectable, signal, computed } from '@angular/core';
import { SingleSelectOption, MultiSelectOption } from '@assetworks-llc/aw-component-lib';
import { SimplePartRecord, ExtendedPartRecord } from '../features/part-lookup/part-lookup.models';

// ── Simple Parts (flat list for Simple Part Lookup Dialog) ──

const SIMPLE_PARTS: SimplePartRecord[] = [
  { partId: 'PRT-OIL-001', partDescription: 'Oil Pump Assembly', keyword: 'Pump', crossReference: 'OP-XREF-601', cost: 125.00 },
  { partId: 'PRT-OIL-002', partDescription: 'Oil Pan Gasket Set', keyword: 'Gasket', crossReference: 'OG-XREF-602', cost: 22.50 },
  { partId: 'PRT-OIL-003', partDescription: 'Oil Pressure Sensor', keyword: 'Sensor', crossReference: 'OS-XREF-603', cost: 35.75 },
  { partId: 'PRT-FLT-001', partDescription: 'Standard Oil Filter', keyword: 'Filter', crossReference: 'OEM-FLT-100', cost: 12.50 },
  { partId: 'PRT-CLN-001', partDescription: 'Engine Coolant 1 Gal', keyword: 'Coolant', crossReference: 'COOL-REF-50', cost: 18.75 },
  { partId: 'PRT-ENG-001', partDescription: 'Spark Plug Iridium', keyword: 'Ignition', crossReference: 'SP-XREF-200', cost: 8.99 },
  { partId: 'PRT-ENG-002', partDescription: 'Timing Belt Kit', keyword: 'Belt', crossReference: 'TB-XREF-300', cost: 45.00 },
  { partId: 'PRT-BRK-001', partDescription: 'Brake Fluid DOT 4', keyword: 'Fluid', crossReference: 'BF-XREF-400', cost: 9.50 },
  { partId: 'PRT-BRK-002', partDescription: 'Rear Brake Drum', keyword: 'Drum', crossReference: 'BD-XREF-500', cost: 67.25 },
  { partId: 'PRT-FBK-001', partDescription: 'Front Brake Rotor', keyword: 'Rotor', crossReference: 'FR-XREF-701', cost: 89.99 },
  { partId: 'PRT-FBK-002', partDescription: 'Front Brake Pad Set', keyword: 'Pad', crossReference: 'FP-XREF-702', cost: 42.00 },
  { partId: 'PRT-FBK-003', partDescription: 'Front Caliper Left', keyword: 'Caliper', crossReference: 'FC-XREF-703', cost: 155.00 },
  { partId: 'PRT-ELEC-001', partDescription: 'Alternator 12V 150A', keyword: 'Electrical', crossReference: 'ALT-XREF-801', cost: 210.00 },
  { partId: 'PRT-ELEC-002', partDescription: 'Starter Motor Rebuilt', keyword: 'Starter', crossReference: 'SM-XREF-802', cost: 175.50 },
];

// ── Extended Parts (for Advanced Parts Lookup) ──

const EXTENDED_PARTS: ExtendedPartRecord[] = [
  { ...SIMPLE_PARTS[0], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 15, onOrder: 5, committed: 3, requestOutPending: 1, manufacturerPartNumber: 'MFR-OP-601', manufacturer: 'Delphi', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[1], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-B', onHand: 42, onOrder: 0, committed: 8, requestOutPending: 0, manufacturerPartNumber: 'MFR-OG-602', manufacturer: 'Fel-Pro', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[2], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-HVY', taskTypeId: 'TSK-INS', classTypeId: 'CLS-A', onHand: 8, onOrder: 10, committed: 2, requestOutPending: 0, manufacturerPartNumber: 'MFR-OS-603', manufacturer: 'Bosch', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[3], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-C', onHand: 120, onOrder: 50, committed: 15, requestOutPending: 3, manufacturerPartNumber: 'MFR-FLT-100', manufacturer: 'Fram', imageUrl: 'oil.svg' },
  { ...SIMPLE_PARTS[4], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-WEST', equipmentTypeId: 'EQT-GEN', taskTypeId: 'TSK-REP', classTypeId: 'CLS-B', onHand: 65, onOrder: 20, committed: 10, requestOutPending: 2, manufacturerPartNumber: 'MFR-CLN-50', manufacturer: 'Prestone', imageUrl: '' },
  { ...SIMPLE_PARTS[5], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 200, onOrder: 0, committed: 25, requestOutPending: 0, manufacturerPartNumber: 'MFR-SP-200', manufacturer: 'NGK', imageUrl: '' },
  { ...SIMPLE_PARTS[6], categoryId: 'CAT-ENG', categoryDescription: 'Engine Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-HVY', taskTypeId: 'TSK-PM', classTypeId: 'CLS-B', onHand: 18, onOrder: 12, committed: 4, requestOutPending: 1, manufacturerPartNumber: 'MFR-TB-300', manufacturer: 'Gates', imageUrl: '' },
  { ...SIMPLE_PARTS[7], categoryId: 'CAT-BRK', categoryDescription: 'Brake Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 90, onOrder: 30, committed: 12, requestOutPending: 0, manufacturerPartNumber: 'MFR-BF-400', manufacturer: 'Castrol', imageUrl: 'brakes.svg' },
  { ...SIMPLE_PARTS[8], categoryId: 'CAT-BRK', categoryDescription: 'Brake Components', stockLocationId: 'LOC-WEST', equipmentTypeId: 'EQT-HVY', taskTypeId: 'TSK-INS', classTypeId: 'CLS-C', onHand: 6, onOrder: 8, committed: 1, requestOutPending: 0, manufacturerPartNumber: 'MFR-BD-500', manufacturer: 'ACDelco', imageUrl: 'brakes.svg' },
  { ...SIMPLE_PARTS[9], categoryId: 'CAT-BRK', categoryDescription: 'Brake Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-PM', classTypeId: 'CLS-B', onHand: 22, onOrder: 10, committed: 5, requestOutPending: 2, manufacturerPartNumber: 'MFR-FR-701', manufacturer: 'Brembo', imageUrl: 'brakes.svg' },
  { ...SIMPLE_PARTS[10], categoryId: 'CAT-BRK', categoryDescription: 'Brake Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-GEN', taskTypeId: 'TSK-REP', classTypeId: 'CLS-A', onHand: 35, onOrder: 15, committed: 7, requestOutPending: 1, manufacturerPartNumber: 'MFR-FP-702', manufacturer: 'Wagner', imageUrl: '' },
  { ...SIMPLE_PARTS[11], categoryId: 'CAT-BRK', categoryDescription: 'Brake Components', stockLocationId: 'LOC-MAIN', equipmentTypeId: 'EQT-VEH', taskTypeId: 'TSK-INS', classTypeId: 'CLS-C', onHand: 4, onOrder: 6, committed: 0, requestOutPending: 0, manufacturerPartNumber: 'MFR-FC-703', manufacturer: 'Cardone', imageUrl: '' },
  { ...SIMPLE_PARTS[12], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-WEST', equipmentTypeId: 'EQT-GEN', taskTypeId: 'TSK-PM', classTypeId: 'CLS-A', onHand: 10, onOrder: 3, committed: 2, requestOutPending: 0, manufacturerPartNumber: 'MFR-ALT-801', manufacturer: 'Denso', imageUrl: 'battery.svg' },
  { ...SIMPLE_PARTS[13], categoryId: 'CAT-ELEC', categoryDescription: 'Electrical Components', stockLocationId: 'LOC-EAST', equipmentTypeId: 'EQT-HVY', taskTypeId: 'TSK-REP', classTypeId: 'CLS-B', onHand: 7, onOrder: 5, committed: 1, requestOutPending: 0, manufacturerPartNumber: 'MFR-SM-802', manufacturer: 'Remy', imageUrl: 'battery.svg' },
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

  /** Flat list of 14 simple part records for the Simple Part Lookup Dialog. */
  public readonly simpleParts = signal<SimplePartRecord[]>(SIMPLE_PARTS);

  /** Extended part records (14) for the Advanced Parts Lookup table. */
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

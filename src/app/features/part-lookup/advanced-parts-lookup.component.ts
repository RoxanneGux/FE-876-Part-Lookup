import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActionBarLeft,
  ActionBarRight,
  AwActionBarComponent,
  AwButtonIconOnlyDirective,
  AwFormFieldLabelComponent,
  AwIconComponent,
  AwSearchComponent,
  AwSelectMenuComponent,
  AwSideDrawerComponent,
  AwTableComponent,
  AwToggleComponent,
  MultiSelectOption,
  SideDrawerInformation,
  SingleSelectOption,
  TableCellInput,
  TableCellTypes,
  TableOptions,
  TableRow,
} from '@assetworks-llc/aw-component-lib';

import { MockDataService } from '../../services/mock-data.service';
import { ExtendedPartRecord } from './part-lookup.models';

/**
 * Advanced Parts Lookup — full-width slide-in panel with quick filters,
 * extended table columns, and a side drawer filter panel.
 *
 * Supports both single-select (radio) and multi-select (checkbox) modes via the `mode` input.
 */
@Component({
  selector: 'app-advanced-parts-lookup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AwActionBarComponent,
    AwButtonIconOnlyDirective,
    AwFormFieldLabelComponent,
    AwIconComponent,
    AwSearchComponent,
    AwSelectMenuComponent,
    AwSideDrawerComponent,
    AwTableComponent,
    AwToggleComponent,
  ],
  templateUrl: './advanced-parts-lookup.component.html',
  styleUrl: './advanced-parts-lookup.component.scss',
})
export class AdvancedPartsLookupComponent {

  /** Selection mode: 'single' for radio buttons, 'multi' for checkboxes. */
  readonly mode = input<'single' | 'multi'>('single');

  /** Emits selected part(s) or null on cancel. */
  readonly close = output<any>();

  private readonly mockDataService = inject(MockDataService);

  // ── Quick Filter Signals ──

  /** FormControl for the search bar — aw-search is a ControlValueAccessor. */
  readonly searchControl = new FormControl('');

  readonly searchText = signal<string>('');

  constructor() {
    this.searchControl.valueChanges.subscribe(val => {
      this.searchText.set(val || '');
    });
  }
  readonly stockLocation = signal<string>('LOC-MAIN');
  readonly partFilter = signal<string[]>([]);
  readonly categoryFilter = signal<string[]>([]);
  readonly includeXRefs = signal<boolean>(true);
  readonly showFilterDrawer = signal<boolean>(false);

  // ── Side Drawer Filter Signals ──

  readonly equipmentTypeFilter = signal<string[]>([]);
  readonly taskTypeFilter = signal<string[]>([]);
  readonly classTypeFilter = signal<string[]>([]);

  // ── Selection State ──

  private selectedSingleRow = signal<any>(null);
  private selectedMultiRows = signal<any[]>([]);

  // ── Computed Filter Options ──

  readonly stockLocationOptions = computed<SingleSelectOption[]>(() =>
    this.mockDataService.stockLocations()
  );

  readonly partFilterOptions = computed<MultiSelectOption[]>(() =>
    this.mockDataService.extendedParts().map(p => ({
      label: `(${p.partId}) ${p.partDescription}`,
      value: p.partId,
      checked: false,
    }))
  );

  readonly categoryFilterOptions = computed<MultiSelectOption[]>(() =>
    this.mockDataService.productCategories()
  );

  readonly equipmentTypeOptions = computed<MultiSelectOption[]>(() =>
    this.mockDataService.equipmentTypes()
  );

  readonly taskTypeOptions = computed<MultiSelectOption[]>(() =>
    this.mockDataService.taskTypes()
  );

  readonly classTypeOptions = computed<MultiSelectOption[]>(() =>
    this.mockDataService.classTypes()
  );

  // ── Computed Table Data ──

  readonly tableData = computed<ExtendedPartRecord[]>(() => {
    let data = this.mockDataService.extendedParts();

    // Search text filter — across multiple fields
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      data = data.filter(p =>
        p.partId.toLowerCase().includes(search) ||
        p.partDescription.toLowerCase().includes(search) ||
        p.keyword.toLowerCase().includes(search) ||
        p.crossReference.toLowerCase().includes(search) ||
        p.cost.toString().includes(search) ||
        p.categoryId.toLowerCase().includes(search) ||
        p.categoryDescription.toLowerCase().includes(search) ||
        p.manufacturerPartNumber.toLowerCase().includes(search) ||
        p.manufacturer.toLowerCase().includes(search)
      );
    }

    // Part filter — by partId
    const partIds = this.partFilter();
    if (partIds.length > 0) {
      data = data.filter(p => partIds.includes(p.partId));
    }

    // Category filter — by categoryId
    const catIds = this.categoryFilter();
    if (catIds.length > 0) {
      data = data.filter(p => catIds.includes(p.categoryId));
    }

    // Stock location filter — by stockLocationId
    const loc = this.stockLocation();
    if (loc) {
      data = data.filter(p => p.stockLocationId === loc);
    }

    // equipmentType, taskType, classType are mock filters —
    // parts don't have those fields, so they don't actually filter the data.
    // The UI still responds to selections for demonstration purposes.

    return data;
  });

  // ── Column Definitions ──

  /** Base data columns (shared between single and multi modes). */
  private readonly dataColumns: TableCellInput[] = [
    {
      type: TableCellTypes.Custom, key: 'imageUrl', label: 'Image', sort: false, align: 'center',
      combineFields: ['imageUrl'],
      combineTemplate: (data: any[]) => {
        const url = data[0] || '';
        if (url) {
          return { template: '<img src="' + url + '" alt="Part image" style="width:40px;height:40px;object-fit:contain;border-radius:4px" />' };
        }
        return { template: '<div style="width:40px;height:40px;background:var(--system-surfaces-surfaces-lower);border-radius:4px"></div>' };
      },
    },
    {
      type: TableCellTypes.Custom, key: 'partId', label: 'Part', sort: true, align: 'left',
      combineFields: ['partId', 'partDescription'],
      combineTemplate: (data: any[]) => ({
        template: '<div><span class="aw-b-1">' + (data[0] || '') + '</span><br><span class="aw-c-1" style="color:var(--system-text-text-secondary)">' + (data[1] || '') + '</span></div>',
      }),
    },
    {
      type: TableCellTypes.Custom, key: 'categoryId', label: 'Category', sort: true, align: 'left',
      combineFields: ['categoryId', 'categoryDescription'],
      combineTemplate: (data: any[]) => ({
        template: '<div><span class="aw-b-1">' + (data[0] || '') + '</span><br><span class="aw-c-1" style="color:var(--system-text-text-secondary)">' + (data[1] || '') + '</span></div>',
      }),
    },
    { type: TableCellTypes.Title, key: 'stockLocationId', label: 'Stock Location', sort: true },
    { type: TableCellTypes.Title, key: 'onHand', label: 'On Hand', sort: true },
    { type: TableCellTypes.Title, key: 'onOrder', label: 'On Order', sort: true },
    { type: TableCellTypes.Title, key: 'committed', label: 'Committed', sort: true },
    { type: TableCellTypes.Title, key: 'requestOutPending', label: 'Request Out Pending', sort: true },
    { type: TableCellTypes.Title, key: 'manufacturerPartNumber', label: 'Mfr Part #', sort: true },
    { type: TableCellTypes.Title, key: 'manufacturer', label: 'Manufacturer', sort: true },
  ];

  /** Column definitions — includes checkbox column for multi-select mode. */
  readonly columnsDefinition = computed<TableCellInput[]>(() => {
    if (this.mode() === 'multi') {
      return [
        { type: TableCellTypes.Checkbox, key: 'selected', label: '' },
        ...this.dataColumns,
      ];
    }
    return this.dataColumns;
  });

  // ── Table Options ──

  readonly tableOptions: TableOptions = {
    noDataPlaceholder: 'No results returned. Adjust quick filters and/or side filter.',
  };

  // ── Footer Action Bar ──

  readonly footerActionsLeft: ActionBarLeft[] = [
    { textCallback: { title: 'Cancel', action: () => this.handleCancel() } },
  ];

  readonly footerActionsRight: ActionBarRight[] = [
    { buttonCallback: { label: 'Select', buttonType: 'outlined', action: () => this.handleSelect() } },
  ];

  // ── Side Drawer Info ──

  readonly filterDrawerInfo: SideDrawerInformation = {
    title: 'Filter',
  };

  // ── Quick Filter Handlers ──

  onStockLocationChange(event: any): void {
    const value = typeof event === 'string' ? event : (event?.value ?? '');
    this.stockLocation.set(value);
  }

  onPartFilterChange(event: any): void {
    const values = this.extractMultiSelectValues(event);
    this.partFilter.set(values);
  }

  onCategoryFilterChange(event: any): void {
    const values = this.extractMultiSelectValues(event);
    this.categoryFilter.set(values);
  }

  // ── Side Drawer Filter Handlers ──

  onEquipmentTypeChange(event: any): void {
    const values = this.extractMultiSelectValues(event);
    this.equipmentTypeFilter.set(values);
  }

  onTaskTypeChange(event: any): void {
    const values = this.extractMultiSelectValues(event);
    this.taskTypeFilter.set(values);
  }

  onClassTypeChange(event: any): void {
    const values = this.extractMultiSelectValues(event);
    this.classTypeFilter.set(values);
  }

  clearAllFilters(): void {
    this.equipmentTypeFilter.set([]);
    this.taskTypeFilter.set([]);
    this.classTypeFilter.set([]);
  }

  // ── Selection Handlers ──

  onRowSelected(event: any): void {
    this.selectedSingleRow.set(event?.row ?? event);
  }

  onCheckboxListChange(event: any): void {
    this.selectedMultiRows.set(event?.rows ?? []);
  }

  // ── Close Actions ──

  handleSelect(): void {
    if (this.mode() === 'single') {
      this.close.emit(this.selectedSingleRow());
    } else {
      this.close.emit(this.selectedMultiRows());
    }
  }

  handleCancel(): void {
    this.close.emit(null);
  }

  // ── Helpers ──

  private extractMultiSelectValues(event: any): string[] {
    if (Array.isArray(event)) {
      return event.map((item: any) => typeof item === 'string' ? item : item?.value ?? '').filter(Boolean);
    }
    if (typeof event === 'string') {
      return event ? [event] : [];
    }
    return [];
  }
}

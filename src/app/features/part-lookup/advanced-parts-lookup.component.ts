import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActionBarLeft,
  ActionBarRight,
  AwActionBarComponent,
  AwButtonIconOnlyDirective,
  AwChipComponent,
  AwFormFieldLabelComponent,
  AwIconComponent,
  AwSearchComponent,
  AwSelectMenuComponent,
  AwSideDrawerComponent,
  AwTableComponent,
  MultiSelectOption,
  SideDrawerInformation,
  SingleSelectOption,
  TableCellInput,
  TableCellTypes,
  TableOptions,
} from '@assetworks-llc/aw-component-lib';

import { MockDataService } from '../../services/mock-data.service';
import { ExtendedPartRecord } from './part-lookup.models';

@Component({
  selector: 'app-advanced-parts-lookup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AwActionBarComponent,
    AwButtonIconOnlyDirective,
    AwChipComponent,
    AwFormFieldLabelComponent,
    AwIconComponent,
    AwSearchComponent,
    AwSelectMenuComponent,
    AwSideDrawerComponent,
    AwTableComponent,
  ],
  templateUrl: './advanced-parts-lookup.component.html',
  styleUrl: './advanced-parts-lookup.component.scss',
})
export class AdvancedPartsLookupComponent {

  readonly mode = input<'single' | 'multi'>('single');
  readonly close = output<any>();

  private readonly mockDataService = inject(MockDataService);

  // ── Side Drawer ViewChild ──

  readonly sideDrawerFilter = viewChild<AwSideDrawerComponent>('sideDrawerFilter');

  // ── Quick Filter FormControls ──

  readonly searchControl = new FormControl('');
  readonly partFilterControl = new FormControl<any[]>([]);
  readonly categoryFilterControl = new FormControl<any[]>([]);

  // ── Side Drawer Filter FormControls ──

  readonly equipmentTypeControl = new FormControl<any[]>([]);
  readonly taskTypeControl = new FormControl<any[]>([]);
  readonly classTypeControl = new FormControl<any[]>([]);

  // ── Filter Signals ──

  readonly searchText = signal<string>('');
  readonly stockLocation = signal<string>('LOC-MAIN');
  readonly partFilter = signal<string[]>([]);
  readonly categoryFilter = signal<string[]>([]);
  readonly includeXRefs = signal<string>('include-xref');

  // ── Xref Filter Options ──

  readonly xrefFilterOptions: SingleSelectOption[] = [
    { label: 'Include Xref', value: 'include-xref' },
    { label: 'Only Xref', value: 'only-xref' },
    { label: 'No Xref', value: 'no-xref' },
    { label: 'Manuf Part Only', value: 'manuf-part-only' },
  ];
  readonly equipmentTypeFilter = signal<string[]>([]);
  readonly taskTypeFilter = signal<string[]>([]);
  readonly classTypeFilter = signal<string[]>([]);

  // ── Filter Chips ──

  readonly activeFilterChips = signal<string[]>([]);

  // ── Selection State ──

  private selectedSingleRow = signal<any>(null);
  private selectedMultiRows = signal<any[]>([]);

  constructor() {
    this.searchControl.valueChanges.subscribe(val => this.searchText.set(val || ''));
    this.partFilterControl.valueChanges.subscribe(val => this.partFilter.set(this.extractMultiSelectValues(val)));
    this.categoryFilterControl.valueChanges.subscribe(val => this.categoryFilter.set(this.extractMultiSelectValues(val)));
    this.equipmentTypeControl.valueChanges.subscribe(val => {
      this.equipmentTypeFilter.set(this.extractMultiSelectValues(val));
      this.updateFilterChips();
    });
    this.taskTypeControl.valueChanges.subscribe(val => {
      this.taskTypeFilter.set(this.extractMultiSelectValues(val));
      this.updateFilterChips();
    });
    this.classTypeControl.valueChanges.subscribe(val => {
      this.classTypeFilter.set(this.extractMultiSelectValues(val));
      this.updateFilterChips();
    });
  }

  // ── Computed Filter Options ──

  readonly stockLocationOptions = computed<SingleSelectOption[]>(() => this.mockDataService.stockLocations());

  readonly partFilterOptions = computed<MultiSelectOption[]>(() =>
    this.mockDataService.extendedParts().map(p => ({
      label: '(' + p.partId + ') ' + p.partDescription,
      value: p.partId,
      checked: false,
    }))
  );

  readonly categoryFilterOptions = computed<MultiSelectOption[]>(() => this.mockDataService.productCategories());
  readonly equipmentTypeOptions = computed<MultiSelectOption[]>(() => this.mockDataService.equipmentTypes());
  readonly taskTypeOptions = computed<MultiSelectOption[]>(() => this.mockDataService.taskTypes());
  readonly classTypeOptions = computed<MultiSelectOption[]>(() => this.mockDataService.classTypes());

  // ── Computed Table Data ──

  readonly tableData = computed<ExtendedPartRecord[]>(() => {
    let data = this.mockDataService.extendedParts();

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

    const partIds = this.partFilter();
    if (partIds.length > 0) data = data.filter(p => partIds.includes(p.partId));

    const catIds = this.categoryFilter();
    if (catIds.length > 0) data = data.filter(p => catIds.includes(p.categoryId));

    const loc = this.stockLocation();
    if (loc) data = data.filter(p => p.stockLocationId === loc);

    const eqTypes = this.equipmentTypeFilter();
    if (eqTypes.length > 0) data = data.filter(p => eqTypes.includes(p.equipmentTypeId));

    const tskTypes = this.taskTypeFilter();
    if (tskTypes.length > 0) data = data.filter(p => tskTypes.includes(p.taskTypeId));

    const clsTypes = this.classTypeFilter();
    if (clsTypes.length > 0) data = data.filter(p => clsTypes.includes(p.classTypeId));

    return data;
  });

  // ── Column Definitions ──

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

  readonly columnsDefinition = computed<TableCellInput[]>(() => {
    if (this.mode() === 'multi') {
      return [{ type: TableCellTypes.Checkbox, key: 'selected', label: '' }, ...this.dataColumns];
    }
    return this.dataColumns;
  });

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

  readonly filterDrawerInfo = computed<SideDrawerInformation>(() => ({
    title: 'Filter',
    userActions: [
      { label: 'Clear all', buttonType: 'secondary', action: () => this.clearAllFilters() },
    ],
  }));

  // ── Quick Filter Handlers ──

  onStockLocationChange(event: any): void {
    const value = typeof event === 'string' ? event : (event?.value ?? '');
    this.stockLocation.set(value);
  }

  onXrefFilterChange(event: any): void {
    const value = typeof event === 'string' ? event : (event?.value ?? 'include-xref');
    this.includeXRefs.set(value);
  }

  // ── Side Drawer Methods ──

  openAdvancedFilter(): void {
    this.sideDrawerFilter()?.openSideDrawer();
  }

  clearAllFilters(): void {
    this.equipmentTypeControl.setValue([], { emitEvent: true });
    this.taskTypeControl.setValue([], { emitEvent: true });
    this.classTypeControl.setValue([], { emitEvent: true });
  }

  // ── Filter Chips ──

  private updateFilterChips(): void {
    const chips: string[] = [];
    for (const val of this.equipmentTypeFilter()) {
      const opt = this.mockDataService.equipmentTypes().find(o => o.value === val);
      chips.push('Equipment Type: ' + (opt?.label ?? val));
    }
    for (const val of this.taskTypeFilter()) {
      const opt = this.mockDataService.taskTypes().find(o => o.value === val);
      chips.push('Task Type: ' + (opt?.label ?? val));
    }
    for (const val of this.classTypeFilter()) {
      const opt = this.mockDataService.classTypes().find(o => o.value === val);
      chips.push('Class Type: ' + (opt?.label ?? val));
    }
    this.activeFilterChips.set(chips);
  }

  removeFilterChip(chip: string): void {
    if (chip.startsWith('Equipment Type: ')) {
      const label = chip.replace('Equipment Type: ', '');
      const opt = this.mockDataService.equipmentTypes().find(o => o.label === label);
      if (opt) {
        this.equipmentTypeFilter.update(vals => vals.filter(v => v !== opt.value));
        this.equipmentTypeControl.setValue([], { emitEvent: false });
      }
    } else if (chip.startsWith('Task Type: ')) {
      const label = chip.replace('Task Type: ', '');
      const opt = this.mockDataService.taskTypes().find(o => o.label === label);
      if (opt) {
        this.taskTypeFilter.update(vals => vals.filter(v => v !== opt.value));
        this.taskTypeControl.setValue([], { emitEvent: false });
      }
    } else if (chip.startsWith('Class Type: ')) {
      const label = chip.replace('Class Type: ', '');
      const opt = this.mockDataService.classTypes().find(o => o.label === label);
      if (opt) {
        this.classTypeFilter.update(vals => vals.filter(v => v !== opt.value));
        this.classTypeControl.setValue([], { emitEvent: false });
      }
    }
    this.updateFilterChips();
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
    if (typeof event === 'string') return event ? [event] : [];
    return [];
  }
}

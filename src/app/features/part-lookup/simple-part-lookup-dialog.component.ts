import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AwButtonIconOnlyDirective,
  AwButtonDirective,
  AwDialogComponent,
  AwIconComponent,
  AwSearchComponent,
  AwToastComponent,
  DialogOptions,
  DialogVariants,
  TableCellInput,
  TableCellTypes,
} from '@assetworks-llc/aw-component-lib';

import { BaseDialogComponent } from '../../components/dialogs/base-dialog.component';
import { MockDataService } from '../../services/mock-data.service';
import { SimplePartRecord } from './part-lookup.models';

/**
 * Filters an array of SimplePartRecord by a case-insensitive substring match
 * across all five visible fields: partId, partDescription, keyword, crossReference, cost (as string).
 *
 * Exported as a public static method for independent testability (Property 2).
 */
export function filterParts(parts: SimplePartRecord[], query: string): SimplePartRecord[] {
  const q = query.toLowerCase().trim();
  if (!q) return parts;
  return parts.filter(p =>
    p.partId.toLowerCase().includes(q) ||
    p.partDescription.toLowerCase().includes(q) ||
    p.keyword.toLowerCase().includes(q) ||
    p.crossReference.toLowerCase().includes(q) ||
    p.cost.toString().includes(q)
  );
}

/**
 * Simple Part Lookup Dialog — flat table with search, scan button placeholder,
 * and "Advanced Lookup" bridge button.
 *
 * Supports both single-select (radio) and multi-select (checkbox) modes via the `mode` input.
 */
@Component({
  selector: 'app-simple-part-lookup-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AwDialogComponent,
    AwIconComponent,
    AwSearchComponent,
    AwButtonIconOnlyDirective,
    AwButtonDirective,
    AwToastComponent,
  ],
  template: `
    <aw-dialog
      [ariaLabel]="'Part Lookup Dialog'"
      [visible]="true"
      [dialogOptions]="dialogOptions"
      [columnsDefinition]="columnsDefinition"
      [tableData]="tableData()"
      [enableSingleSelection]="mode === 'single'"
      (primaryAction)="handleAdd($event)"
      (secondaryAction)="handleCancel()">

      <div table-top class="search-controls">
        <div style="padding: 16px 16px 0 16px; display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1;">
            <aw-search
              #searchComponent
              [ngModel]="searchText"
              (ngModelChange)="onSearchChange($event)"
              [placeholder]="'Search'"
              [ariaLabel]="'Search parts'">
            </aw-search>
          </div>
          <button AwButtonIconOnly [buttonType]="'primary'"
                  ariaLabel="Scan barcode" type="button"
                  (click)="$event.stopPropagation(); onScanClick()">
            <aw-icon [iconName]="'barcode-scan'" [iconColor]="''"></aw-icon>
          </button>
        </div>
      </div>
    </aw-dialog>

    <!-- Toast for no camera -->
    <aw-toast #toastComponent></aw-toast>

    <!-- Camera preview overlay -->
    @if (showCameraPreview()) {
      <div class="camera-overlay">
        <div class="camera-container">
          <video #cameraVideo autoplay playsinline></video>
          <div class="camera-actions" style="display: flex; justify-content: center; gap: 16px; margin-top: 16px;">
            <button AwButton [buttonType]="'primary'" (click)="captureBarcode()">
              <aw-icon [iconName]="'photo_camera'" [iconColor]="''"></aw-icon>
              <span>Capture</span>
            </button>
            <button AwButton [buttonType]="'secondary'" (click)="closeCameraPreview()">
              <aw-icon [iconName]="'close'" [iconColor]="''"></aw-icon>
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      .search-controls {
        border-bottom: 1px solid var(--system-line-divider-stroke-line-color);
      }
      .camera-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .camera-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 640px;
        width: 90%;
        video {
          width: 100%;
          border-radius: 8px;
          background: #000;
        }
      }
    }
  `],
})
export class SimplePartLookupDialogComponent extends BaseDialogComponent {

  /** Selection mode: 'single' for radio buttons, 'multi' for checkboxes.
   *  Writable property (not an input signal) so DialogService can set it via Object.assign. */
  mode: 'single' | 'multi' = 'single';

  private readonly mockDataService = inject(MockDataService);
  readonly toastComponent = viewChild<any>('toastComponent');
  readonly searchComponent = viewChild<any>('searchComponent');

  /** Filtered table data displayed in the dialog. */
  readonly tableData = signal<SimplePartRecord[]>([]);

  /** Search form control — mirrors the FE-528 pattern. */
  readonly searchControl = new FormControl('');

  /** Current search text (plain field for external access). */
  searchText = '';

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
    { type: TableCellTypes.Title, key: 'keyword', label: 'Keyword', sort: true },
    { type: TableCellTypes.Title, key: 'crossReference', label: 'Cross-Ref', sort: true },
    {
      type: TableCellTypes.Custom, key: 'cost', label: 'Cost', sort: true, align: 'right',
      combineFields: ['cost'],
      combineTemplate: (data: any[]) => ({
        template: '<span class="aw-b-1">$' + (data[0] ?? 0).toFixed(2) + '</span>',
      }),
    },
  ];

  /**
   * Column definitions — in multi-select mode, prepends a Checkbox column
   * so the table renders checkboxes on the far left.
   */
  get columnsDefinition(): TableCellInput[] {
    if (this.mode === 'multi') {
      return [
        { type: TableCellTypes.Checkbox, key: 'selected', label: '' },
        ...this.dataColumns,
      ];
    }
    return this.dataColumns;
  }

  // ── Dialog Options ──

  readonly dialogOptions: DialogOptions = {
    variant: DialogVariants.TABLE,
    title: 'Part Lookup',
    primaryButtonLabel: 'Add',
    secondaryButtonLabel: 'Cancel',
    enableBackdropClick: true,
    enableSearch: false,
    additionalActions: [
      {
        label: 'Advanced Lookup',
        ariaLabel: 'Advanced Lookup',
        action: () => this.handleAdvancedLookup(),
      },
    ],
  };

  constructor() {
    super();

    // Load initial data — use extendedParts so imageUrl is available
    this.tableData.set(this.mockDataService.extendedParts());

    // Subscribe to search input changes
    this.searchControl.valueChanges.subscribe(val => {
      this.onSearchChange(val || '');
    });
  }

  // ── Search ──

  /**
   * Filters flat part data across all visible columns (case-insensitive substring match).
   * Empty search shows all data.
   */
  onSearchChange(value: string): void {
    this.searchText = value;
    const allParts = this.mockDataService.extendedParts();
    this.tableData.set(filterParts(allParts, value));
  }

  // ── Actions ──

  /**
   * Emits the "Advanced Lookup" bridge signal so the parent can close this dialog
   * and open the advanced lookup in the same selection mode.
   */
  handleAdvancedLookup(): void {
    this.close.emit({ advancedLookup: true, mode: this.mode });
  }

  /**
   * Handles the primary "Add" action.
   * In single-select mode, emits the selected row.
   * In multi-select mode, emits the array of selected items.
   */
  handleAdd(event: any): void {
    if (this.mode === 'single') {
      // aw-dialog emits { row: TableRow } for single selection
      this.close.emit(event?.row ?? event);
    } else {
      // aw-dialog emits { checkboxList: { rows, key }, toggleList: { rows, key } } for multi
      const selected = event?.checkboxList?.rows ?? [];
      this.close.emit(selected);
    }
  }

  /**
   * Handles the secondary "Cancel" action. Emits null to signal no selection.
   */
  handleCancel(): void {
    this.close.emit(null);
  }

  // ── Scan ──

  readonly showCameraPreview = signal<boolean>(false);
  readonly cameraVideo = viewChild<any>('cameraVideo');
  private _mediaStream: MediaStream | null = null;

  async onScanClick(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(d => d.kind === 'videoinput');
      if (!hasCamera) {
        this.toastComponent()?.showToast({
          variant: 'alert',
          title: 'No camera or scanner detected',
          description: 'Enter part ID manually',
        });
        return;
      }
      this._mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.showCameraPreview.set(true);
      setTimeout(() => {
        const videoEl = this.cameraVideo()?.nativeElement;
        if (videoEl && this._mediaStream) {
          videoEl.srcObject = this._mediaStream;
        }
      }, 100);
    } catch {
      this.toastComponent()?.showToast({
        variant: 'alert',
        title: 'No camera or scanner detected',
        description: 'Enter part ID manually',
      });
    }
  }

  captureBarcode(): void {
    const mockScannedId = 'PRT-OIL-001';
    this.closeCameraPreview();
    this.searchText = mockScannedId;
    this.onSearchChange(mockScannedId);
    // Workaround: aw-search writeValue() bug — set internal controls directly
    const search = this.searchComponent();
    if (search) {
      search.searchControl.setValue(mockScannedId);
      search.selectedValue.set({ label: mockScannedId });
    }
  }

  closeCameraPreview(): void {
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach(t => t.stop());
      this._mediaStream = null;
    }
    this.showCameraPreview.set(false);
  }

  // ── Static filter for testability ──

  /**
   * Static filter method exposed for property-based testing (Property 2).
   */
  static filterParts = filterParts;
}

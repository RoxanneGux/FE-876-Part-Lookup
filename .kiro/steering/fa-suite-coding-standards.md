---
inclusion: always
---

# FA-Suite Coding Standards for Harness Code

This harness produces reference implementations that full-stack developers copy into FA-Suite. Code must follow FA-Suite's Angular coding standards so developers can lift components with minimal rework.

## Bootstrap-First Styling (CRITICAL)

**ALWAYS use Bootstrap utility classes before writing custom SCSS.** This is the #1 source of developer friction when consuming harness code.

| Need | Use Bootstrap | NOT custom SCSS |
|------|---------------|-----------------|
| Flex layout | `d-flex`, `d-inline-flex` | `display: flex` |
| Block display | `d-block`, `d-none` | `display: block` |
| Flex direction | `flex-column`, `flex-row` | `flex-direction: column` |
| Alignment | `align-items-center`, `align-items-start`, `justify-content-between` | `align-items: center` |
| Spacing | `m-3`, `mt-2`, `mb-4`, `p-3`, `px-2`, `gap-2`, `gap-3` | `margin-top: 8px`, `padding: 16px` |
| Sizing | `w-100`, `h-100`, `mw-100` | `width: 100%` |
| Responsive | `d-md-flex`, `d-lg-none` | `@media` queries for simple show/hide |
| Text | `text-center`, `text-start`, `text-end` | `text-align: center` |
| Wrapping | `flex-wrap`, `flex-nowrap` | `flex-wrap: wrap` |

### When Custom SCSS IS Acceptable

Only create a `.scss` file when Bootstrap cannot achieve the layout:
- Complex selectors or pseudo-elements
- CCL component overrides via `::ng-deep` (use sparingly)
- Animations or transitions
- Grid layouts with specific track definitions
- Component-specific max-width constraints

### Common Bootstrap Patterns for Harness Layouts

```html
<!-- Form row: two fields side by side, stacking on mobile -->
<div class="d-flex flex-column flex-lg-row gap-3">
  <div class="flex-fill"><!-- field 1 --></div>
  <div class="flex-fill"><!-- field 2 --></div>
</div>

<!-- Field with adjacent icon button -->
<div class="d-flex gap-2 align-items-start">
  <aw-form-field class="flex-fill">
    <input AwInput />
  </aw-form-field>
  <button AwButtonIconOnly>...</button>
</div>

<!-- Description text below a field -->
<span class="aw-c-1 text-secondary">Description text</span>

<!-- Selected items list -->
<div class="d-flex flex-column gap-1 ms-1">
  <span class="aw-c-1">Item 1</span>
  <span class="aw-c-1">Item 2</span>
</div>

<!-- Page content with padding -->
<div class="p-3 p-lg-4">
  <!-- content -->
</div>

<!-- Sticky footer -->
<div class="sticky-bottom">
  <aw-action-bar ...></aw-action-bar>
</div>

<!-- Table wrapper (required by FA-Suite standards) -->
<div class="table-responsive d-block">
  <aw-table ...></aw-table>
</div>

<!-- Full-width expansion panel -->
<aw-expansion-panel class="d-block" [title]="'Section'" [showExpander]="true">
  <div class="p-3"><!-- content --></div>
</aw-expansion-panel>
```

## CCL Component Rules

### Buttons — Wrap Text in `<span>`

```html
<!-- ❌ WRONG -->
<button AwButton [buttonType]="'outlined'">Lookup</button>

<!-- ✅ RIGHT -->
<button AwButton [buttonType]="'outlined'"><span>Lookup</span></button>
```

### aw-select-menu — Use formControlName, Not ngModel

```html
<!-- ❌ WRONG -->
<aw-select-menu [ngModel]="value()" (ngModelChange)="onChange($event)">

<!-- ✅ RIGHT -->
<aw-select-menu formControlName="myField" [enableListReset]="true" [singleSelectListItems]="options()">
```

### aw-expansion-panel — Add d-block

```html
<aw-expansion-panel class="d-block" [title]="'Section'" [showExpander]="true">
```

### Tables — Wrap in table-responsive

```html
<div class="table-responsive d-block">
  <aw-table [columnsDefinition]="columns" [tableData]="data()"></aw-table>
</div>
```

### Section Headers — Use aw-divider with title

```html
<!-- ❌ WRONG -->
<h6>Section Name</h6>

<!-- ✅ RIGHT -->
<aw-divider [title]="'Section Name'"></aw-divider>
```

## Component Patterns

### Use inject(), Not Constructor Injection

```typescript
// ✅ RIGHT
private readonly _dialogService = inject(DialogService);
private readonly _mockData = inject(MockDataService);

// ❌ WRONG
constructor(private dialogService: DialogService) {}
```

### Use input() and output(), Not Decorators

```typescript
// ✅ RIGHT
readonly mode = input<'single' | 'multi'>('single');
readonly close = output<any>();

// ❌ WRONG
@Input() mode: 'single' | 'multi' = 'single';
@Output() close = new EventEmitter<any>();
```

Note: When a property must be set via `DialogService.open()` (which uses `Object.assign`), use a plain writable property instead of `input()` since signal inputs are read-only.

### No Empty Lifecycle Hooks

```typescript
// ❌ WRONG
ngOnInit(): void { }

// ✅ RIGHT — just don't include it
```

### Minimal Comments

Code should be self-documenting. Skip JSDoc for obvious signals, computed properties, and simple methods.

## SCSS File Decision

| Scenario | Create SCSS? |
|----------|:---:|
| Layout uses only Bootstrap utilities | ❌ |
| Only `:host { display: block }` needed | ❌ |
| Complex selectors, pseudo-elements, CCL overrides | ✅ |
| Custom animations or transitions | ✅ |

## Checklist for Every Component

- [ ] Layout uses Bootstrap utilities (`d-flex`, `gap-*`, `p-*`, `m-*`) before custom SCSS
- [ ] Button text wrapped in `<span>` tags
- [ ] Tables wrapped in `<div class="table-responsive d-block">`
- [ ] `aw-expansion-panel` has `class="d-block"`
- [ ] `aw-select-menu` uses `formControlName` + `[enableListReset]="true"` + computed options
- [ ] Section headers use `aw-divider [title]` (not `<h6>`)
- [ ] Uses `inject()` function (not constructor injection)
- [ ] Uses `input()` / `output()` (not decorators) — except DialogService-assigned properties
- [ ] No empty lifecycle hooks
- [ ] No inline styles (`style="..."`)
- [ ] SCSS file only created when Bootstrap can't achieve the layout
- [ ] Custom SCSS uses design-system tokens (`var(--system-*)`) not hardcoded colors

## WCAG AA Accessibility Audit (Pre-Ship)

**Before finalizing any harness for handoff, perform a WCAG AA audit across all components.** This is a required step — developers copying harness code into FA-Suite inherit whatever accessibility state the harness has.

### What to Audit

**ARIA Labels & Properties:**
- [ ] All `<input>` elements have `aria-label` or associated `<label>`
- [ ] All `AwButtonIconOnlyDirective` instances have descriptive `ariaLabel` (e.g., "Open part lookup", not just "Search")
- [ ] All `AwDialogComponent` instances have `[ariaLabel]`
- [ ] All `AwSearchComponent` instances have `[ariaLabel]`
- [ ] All `AwSelectMenuComponent` instances have `[ariaLabel]` matching their visible label
- [ ] All `AwToggleComponent` instances have `[ariaLabel]`
- [ ] All `AwSideDrawerComponent` instances have `[attr.aria-label]`
- [ ] All `AwTableComponent` instances have `[ariaLabel]` or `[attr.aria-label]`
- [ ] `AwBreadCrumbComponent` has `[ariaLabel]`
- [ ] Dynamic description text uses `aria-live="polite"` for screen reader announcements
- [ ] Error states use `role="alert"` or `aria-live="assertive"`
- [ ] Lists of items use `role="list"` with `role="listitem"` children

**Keyboard & Focus:**
- [ ] All interactive elements reachable via Tab key
- [ ] Buttons activate with Enter and Space
- [ ] Dialogs trap focus and return focus to trigger on close
- [ ] Side drawers return focus to trigger button on close
- [ ] Escape key closes dialogs and drawers

**Visual:**
- [ ] All form fields have visible labels (not just placeholder text)
- [ ] Error states distinguishable by more than color alone (text content like "NOT DEFINED")
- [ ] Color contrast meets 4.5:1 for normal text, 3:1 for large text (CCL handles most of this)

### What Requires Manual Testing

Document these items in a comment block at the top of the main page component:
- Keyboard navigation flow (Tab order, arrow keys in tables/dropdowns)
- Screen reader announcements (NVDA, JAWS, VoiceOver)
- Focus management on dialog/drawer open and close
- Precise color contrast measurement (use axe or Lighthouse)
- Touch target sizes (44x44px minimum per WCAG 2.5.5)

Note: Full WCAG AA validation requires manual testing with assistive technologies and expert accessibility review. The audit above covers what can be verified through code inspection.

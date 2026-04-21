# Design System Rules

## Component Library First — Mandatory

NEVER write custom HTML/CSS for UI patterns that exist in `@assetworks-llc/aw-component-lib`. Before creating any custom element:

1. Assume the library has it — it covers most UI patterns
2. Check `.d.ts` files in `node_modules/@assetworks-llc/aw-component-lib/` or use Storybook MCP
3. Check `ng-content` projection slots in component templates
4. Only create custom elements when the library genuinely has no equivalent after thorough search

## Figma MCP Integration

- Treat Figma MCP output (React + Tailwind) as design intent, not final code
- Replace Tailwind utility classes with SCSS patterns and `aw-component-lib` tokens
- Reuse existing library components instead of duplicating functionality
- Strive for 1:1 visual parity with Figma designs; prefer design-system tokens on conflict
- Validate final UI against the Figma screenshot

## Tokens & Theming

- Design tokens come from `@assetworks-llc/aw-component-lib/styles/styles.scss`
- Theme activated via `<body class="mat-typography light-theme">`
- No Tailwind CSS — do not use utility-first classes
- No custom token transformation — consume library SCSS tokens directly

### Color Tokens (Figma → CSS)

| Figma Name | CSS Variable |
|---|---|
| `text-primary` | `var(--system-text-text-primary)` |
| `text-secondary` | `var(--system-text-text-secondary)` |
| `text-disabled` | `var(--system-text-text-disabled)` |
| `link-active` | `var(--system-links-link-active)` |
| `surfaces-raised` | `var(--system-surfaces-surfaces-raised)` |
| `surfaces-background` | `var(--system-surfaces-surfaces-background)` |
| `stat-info` | `var(--system-status-status-info)` |
| `stat-success` | `var(--system-status-status-success)` |
| `stat-warning` | `var(--system-status-status-warning)` |
| `stat-error` | `var(--system-status-status-error)` |

### Typography (Figma → CSS Class)

| Figma Style | CSS Class |
|---|---|
| `headline-1` | `.aw-h-1` |
| `headline-2` | `.aw-h-2` |
| `headline-3` | `.aw-h-3` |
| `headline-4` | `.aw-h-4` |
| `headline-5` | `.aw-h-5` |
| `subtitle 1` | `.aw-st-1` |
| `subtitle 1 medium` | `.aw-st-1-medium` |
| `body 1` | `.aw-b-1` |
| `body 1 medium` | `.aw-b-1-medium` |
| `caption` | `.aw-c-1` |

Never use raw `font-size`/`line-height`/`font-weight` in SCSS when a typography class exists. Apply the class in the template.

## Key Component Patterns

### Dialogs
- Extend `BaseDialogComponent`
- Open via `DialogService.open()`
- Emit results via `this.close.emit({ valid: true, formData: {...} })`

### Side Drawers
- Use `<aw-side-drawer>` with child content components directly inside
- Do NOT use `aw-drawer-item`

### Tables
- Click navigation uses event delegation on container divs (no built-in cell click handlers)
- Options menu: `[optionsMenuHandler]="tempCustomOptionsMenu"` with bound function

### Currency Inputs
- Use `<input AwInput>` with `placeholder="$0.00"` and `type="text"`
- Format on blur as `$X.XX` with comma separators, strip on focus
- Never use `aw-icon` prefix or `CurrencyPipe` inside input values

## Common Imports Quick Reference

```typescript
// Navigation
import { AwNavigationMenuComponent, AwTopNavigationComponent } from '@assetworks-llc/aw-component-lib';
// Forms
import { AwFormFieldComponent, AwFormFieldLabelComponent, AwInputDirective, AwSelectMenuComponent } from '@assetworks-llc/aw-component-lib';
// Data Display
import { AwTableComponent, AwBadgeComponent, AwChipComponent } from '@assetworks-llc/aw-component-lib';
// Overlays
import { AwDialogComponent, AwSideDrawerComponent } from '@assetworks-llc/aw-component-lib';
// Types
import { TableCellInput, TableCellTypes, DialogOptions, SideDrawerInformation } from '@assetworks-llc/aw-component-lib';
```

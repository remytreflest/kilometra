import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterChip {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-bar" role="tablist" [attr.aria-label]="ariaLabel">
      @for (chip of chips; track chip.value) {
        <button
          class="filter-chip"
          role="tab"
          [class.active]="chip.value === activeValue"
          [attr.aria-selected]="chip.value === activeValue"
          (click)="select(chip.value)"
        >
          {{ chip.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    @use 'styles/design-tokens/colors' as *;
    @use 'styles/design-tokens/spacing' as *;
    @use 'styles/design-tokens/typography' as *;
    @use 'styles/design-tokens/elevation' as *;

    .filter-bar {
      display: flex;
      gap: $space-2;
      overflow-x: auto;
      padding-bottom: $space-1;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
    }
    .filter-chip {
      flex-shrink: 0;
      padding: $space-2 $space-4;
      border-radius: $radius-pill;
      border: 1.5px solid $border-subtle;
      background: $surface-card;
      font-size: $text-small;
      font-weight: $weight-semibold;
      color: $text-secondary;
      cursor: pointer;
      transition: all 140ms ease;
      &:hover { background: $color-grey-50; color: $text-primary; }
      &.active {
        background: $color-blue-700;
        color: $text-on-brand;
        border-color: $color-blue-700;
        box-shadow: $elevation-brand;
      }
    }
  `]
})
export class FilterBarComponent {
  @Input() chips: FilterChip[] = [];
  @Input() activeValue = '';
  @Input() ariaLabel = 'Filtres';
  @Output() filterChange = new EventEmitter<string>();

  select(value: string) {
    this.activeValue = value;
    this.filterChange.emit(value);
  }
}

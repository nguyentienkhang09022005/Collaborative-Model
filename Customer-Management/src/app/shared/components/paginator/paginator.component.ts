import { Component, inject, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferenceService } from '../../../core/services/preference.service';

export interface PaginatorChange {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent {
  pageIndex = input<number>(0);
  pageSize = input<number>(10);
  totalCount = input<number>(0);
  pageSizeOptions = input<number[]>([10, 25, 50]);

  pageChange = output<PaginatorChange>();

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));

  readonly startItem = computed(() => {
    if (this.totalCount() === 0) return 0;
    return this.pageIndex() * this.pageSize() + 1;
  });

  readonly endItem = computed(() => Math.min((this.pageIndex() + 1) * this.pageSize(), this.totalCount()));

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.pageIndex();
    const maxButtons = 5;
    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i);
    }
    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, start + maxButtons - 1);
    start = Math.max(0, end - maxButtons + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  readonly canPrev = computed(() => this.pageIndex() > 0);
  readonly canNext = computed(() => this.pageIndex() < this.totalPages() - 1);

  onPageSizeChange(size: number): void {
    this.pageChange.emit({ pageIndex: 0, pageSize: size });
  }

  goToPage(idx: number): void {
    if (idx < 0 || idx >= this.totalPages() || idx === this.pageIndex()) return;
    this.pageChange.emit({ pageIndex: idx, pageSize: this.pageSize() });
  }

  prev(): void {
    if (this.canPrev()) this.goToPage(this.pageIndex() - 1);
  }

  next(): void {
    if (this.canNext()) this.goToPage(this.pageIndex() + 1);
  }
}

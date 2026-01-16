import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionLogOutOutline, ionDownloadOutline, ionSearch, ionMenu, ionDocumentTextOutline,ionIdCardOutline, 
  ionCardOutline,ionTimeOutline,ionCalendarOutline,ionPrismOutline,ionReaderOutline,ionColorFilterOutline } from '@ng-icons/ionicons';
import { LogsService } from '../../core/services/Developer/logs.service';
import { DateUtilsService } from '../../core/services/utils/date-utils.service';
import { AuthSessionService } from '../../core/services/auth/auth-session.service';
import { getLogLevelClass } from '../../core/enums/logs/log-level.enum';

@Component({
  selector: 'app-logs',
  imports: [CommonModule, FormsModule, NgIcon],
  viewProviders: [provideIcons({ ionLogOutOutline, ionDownloadOutline, ionSearch, ionMenu, ionDocumentTextOutline,ionIdCardOutline, 
    ionCardOutline,ionTimeOutline,ionCalendarOutline,ionPrismOutline,ionReaderOutline, ionColorFilterOutline})],
  templateUrl: './logs.html',
  styleUrl: './logs.css',
})
export class Logs implements OnInit, OnDestroy {

  paginatedLogs: Array<{ id: number; date: string; time: string; logLevel: string; content: string }> = [];
  startDate: string = '';
  endDate: string = '';
  currentPage = 1;
  selectedPage = 1;
  totalPages = 1;
  availablePages: number[] = [];
  totalLogsCount = 0;
  loading = false;
  error: string | null = null;

  private pollingSubscription?: Subscription;

  constructor(
    private logsService: LogsService,
    private authSessionService: AuthSessionService,
    private dateUtils: DateUtilsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authSessionService.startSessionTimer();
      const today = this.dateUtils.getTodayFormatted();
      this.startDate = today;
      this.endDate = today;
      this.onDateChange();
    }
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  onDateChange(): void {
    if (this.startDate && this.endDate) {
      this.loading = true;
      this.logsService.getPaginationLogsByDate(this.startDate, this.endDate).subscribe({
        next: (resp) => {
          this.loading = false;
          if (resp && resp.result && resp.data) {
            this.totalPages = resp.data.totalPages;
            this.totalLogsCount = resp.data.totalLogs;
            this.availablePages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
            this.selectedPage = 1;
            this.loadLogsForPage(1);
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.message || 'Error al obtener información de paginación';
        },
      });
    }
  }

  clearDateFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.selectedPage = 1;
    this.totalPages = 1;
    this.availablePages = [];
    this.paginatedLogs = [];
    this.totalLogsCount = 0;
  }

  getLogLevelClass(logLevel: string): string {
    return getLogLevelClass(logLevel);
  }

  loadLogsForPage(page: number): void {
    if (!this.startDate || !this.endDate) return;

    this.loading = true;
    this.logsService.getLogs(this.startDate, this.endDate, page).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp && resp.result && resp.data) {
          this.paginatedLogs = (resp.data as any) || [];
          this.currentPage = page;
          this.selectedPage = page;
          this.error = null;
        } else {
          this.error = resp?.message || 'Error al cargar logs';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message || 'Error al cargar logs';
      },
    });
  }

  onPageSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const page = parseInt(selectElement.value, 10);
    if (page && page >= 1 && page <= this.totalPages) {
      this.selectedPage = page;
      this.loadLogsForPage(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadLogsForPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadLogsForPage(this.currentPage - 1);
    }
  }

  goToPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page >= 1 && page <= this.totalPages) {
      this.loadLogsForPage(page);
    }
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1, '...', this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
      } else {
        pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', this.totalPages);
      }
    }
    return pages;
  }

}

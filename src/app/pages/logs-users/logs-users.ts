import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionLogOutOutline,ionPersonOutline, ionDownloadOutline,ionGlobeOutline, ionTimeOutline, ionSearch, ionPeopleOutline } from '@ng-icons/ionicons';
import { LogsService } from '../../core/services/Developer/logs.service';
import { DateUtilsService } from '../../core/services/utils/date-utils.service';
import { ExcelExportService } from '../../core/services/utils/excel-export.service';
import { AuthSessionService } from '../../core/services/auth/auth-session.service';

@Component({
  selector: 'app-logs-users',
  imports: [CommonModule, FormsModule, NgIcon],
  viewProviders: [provideIcons({ ionLogOutOutline, ionPersonOutline, ionDownloadOutline, ionGlobeOutline, ionTimeOutline, ionSearch, ionPeopleOutline })],
  templateUrl: './logs-users.html',
  styleUrl: './logs-users.css',
})
export class LogsUsers implements OnInit, OnDestroy {
  logs: Array<{ userIp: string; userName: string; loginTime: string }> = [];
  filteredLogs: Array<{ userIp: string; userName: string; loginTime: string }> = [];
  paginatedLogs: Array<{ userIp: string; userName: string; loginTime: string }> = [];
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  loading = false;
  error: string | null = null;

  private pollingSubscription?: Subscription;

  constructor(
    private logsService: LogsService,
    private authSessionService: AuthSessionService,
    private dateUtils: DateUtilsService,
    private excelExport: ExcelExportService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authSessionService.startSessionTimer();
    }

    this.loading = true;
    this.pollingSubscription = interval(6000)
      .pipe(
        startWith(0),
        switchMap(() => this.logsService.getLogsUsers())
      )
      .subscribe({
        next: (resp: any) => {
          this.loading = false;
          if (resp && resp.result) {
            this.logs = resp.data || [];
            this.applyFilter();
            this.error = null;
          } else {
            this.error = resp?.message || 'Error al cargar logs';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.message || String(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  applyFilter(resetPage: boolean = false): void {
    let filtered = [...this.logs];

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter((log) => log.userName.toLowerCase().includes(searchLower));
    }

    if (this.startDate || this.endDate) {
      filtered = this.dateUtils.filterByDateRange(
        filtered,
        (log) => log.loginTime,
        this.startDate,
        this.endDate
      );
    }

    this.filteredLogs = filtered;
    this.totalPages = Math.ceil(this.filteredLogs.length / this.itemsPerPage);

    if (resetPage || this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? Math.min(this.currentPage, this.totalPages) : 1;
    }

    this.updatePaginatedLogs();
  }

  onSearchChange(): void {
    this.applyFilter(true);
  }
  onDateChange(): void {
    this.applyFilter(true);
  }

  filterToday(): void {
    const today = this.dateUtils.getTodayFormatted();
    this.startDate = today;
    this.endDate = today;
    this.applyFilter(true);
  }

  filterLastWeek(): void {
    this.startDate = this.dateUtils.getDaysAgoFormatted(7);
    this.endDate = this.dateUtils.getTodayFormatted();
    this.applyFilter(true);
  }

  filterLast30Days(): void {
    this.startDate = this.dateUtils.getDaysAgoFormatted(30);
    this.endDate = this.dateUtils.getTodayFormatted();
    this.applyFilter(true);
  }

  clearDateFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.applyFilter(true);
  }

  updatePaginatedLogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLogs = this.filteredLogs.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedLogs();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedLogs();
    }
  }

  goToPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedLogs();
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

  exportToExcel(): void {
    this.excelExport.exportUserLogs(this.filteredLogs);
  }

}

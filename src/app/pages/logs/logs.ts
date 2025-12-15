import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionLogOutOutline, ionDownloadOutline, ionSearch, ionMenu } from '@ng-icons/ionicons';
import { LogsService } from '../../core/services/Developer/logs.service';
import { DateUtilsService } from '../../core/services/Developer/date-utils.service';
import { ExcelExportService } from '../../core/services/Developer/excel-export.service';
import { AuthCodeService } from '../../services/auth-code.service';
import { getLogLevelClass } from '../../core/enums/log-level.enum';

@Component({
  selector: 'app-logs',
  imports: [CommonModule, FormsModule, NgIcon],
  viewProviders: [provideIcons({ ionLogOutOutline, ionDownloadOutline, ionSearch, ionMenu })],
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
    private authCodeService: AuthCodeService,
    private dateUtils: DateUtilsService,
    private excelExport: ExcelExportService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authCodeService.startSessionTimer();
      const today = this.dateUtils.getTodayFormatted();
      this.startDate = today;
      this.endDate = today;
      this.onDateChange();
    }
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  // Maneja el cambio de fecha
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

  // Limpiar filtros de fecha
  clearDateFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.selectedPage = 1;
    this.totalPages = 1;
    this.availablePages = [];
    this.paginatedLogs = [];
    this.totalLogsCount = 0;
  }

  // Obtiene la clase CSS para el nivel de log
  getLogLevelClass(logLevel: string): string {
    return getLogLevelClass(logLevel);
  }

  // Carga los logs para una página específica
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

  // Maneja la selección de página desde el desplegable
  onPageSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const page = parseInt(selectElement.value, 10);
    if (page && page >= 1 && page <= this.totalPages) {
      this.selectedPage = page;
      this.loadLogsForPage(page);
    }
  }

  // Navega a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadLogsForPage(this.currentPage + 1);
    }
  }

  // Navega a la página anterior
  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadLogsForPage(this.currentPage - 1);
    }
  }

  // Navega a una página específica
  goToPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page >= 1 && page <= this.totalPages) {
      this.loadLogsForPage(page);
    }
  }

  // Obtiene los números de página para la visualización de la paginación
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

  // Exporta los logs a Excel usando ExcelExportService
  exportToExcel(): void {
    this.excelExport.exportLogs(this.paginatedLogs);
  }

}

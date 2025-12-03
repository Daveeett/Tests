import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { flatMap, Subscription } from 'rxjs';
import { AuthCodeService } from '../../services/auth-code.service';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionLogOutOutline,ionDownloadOutline,ionSearch,ionMenu} from '@ng-icons/ionicons';
import { DeveloperService } from '../../services/developer-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-logs',
  imports: [CommonModule, FormsModule, NgIcon, RouterLink],
  viewProviders:[provideIcons({ionLogOutOutline,ionDownloadOutline,ionSearch,ionMenu })],
  templateUrl: './logs.html',
  styleUrl: './logs.css',
})
export class Logs implements OnInit,OnDestroy{

  paginatedLogs: Array<{ id: number; date: string; time: string; logLevel: string; content: string; }> = [];
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
    private logsService: DeveloperService,
    private authCodeService: AuthCodeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.authCodeService.startSessionTimer();
        const today = dayjs().format('YYYY-MM-DD');
        this.startDate = today;
        this.endDate = today;
        this.onDateChange();
      }
    }
  
    ngOnDestroy(): void {
      this.pollingSubscription?.unsubscribe();
    }
  
    //manejar cambios en las fechas
    onDateChange(): void {
      if (this.startDate && this.endDate) {
        this.loading = true;
        this.logsService.getPaginationLogsByDate(this.startDate, this.endDate)
          .subscribe({
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
            }
          });
      }
    }
  
  
    //limpiar filtros de fecha
    clearDateFilters(): void {
      this.startDate = '';
      this.endDate = '';
      this.selectedPage = 1;
      this.totalPages = 1;
      this.availablePages = [];
      this.paginatedLogs = [];
      this.totalLogsCount = 0;
    }

    //obtener clase CSS según el nivel de log
    getLogLevelClass(logLevel: string): string {
      switch (logLevel) {
        case 'INF':
          return 'bg-blue-500 text-white';
        case 'DBG':
          return 'bg-gray-500 text-white';
        case 'WRN':
          return 'bg-yellow-500 text-black';
        case 'ERR':
          return 'bg-red-500 text-white';
        case 'CRT':
          return 'bg-purple-600 text-white';
        case 'FTL':
          return 'bg-black text-white border border-red-600';
        default:
          return 'bg-gray-400 text-white';
       }
     }

    //cargar logs para una página específica
    loadLogsForPage(page: number): void {
      if (!this.startDate || !this.endDate) return;
      
      this.loading = true;
      this.logsService.getLogs(this.startDate, this.endDate, page)
        .subscribe({
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
          }
        });
    }

    //manejar selección de página desde el dropdown
    onPageSelect(event: Event): void {
      const selectElement = event.target as HTMLSelectElement;
      const page = parseInt(selectElement.value, 10);
      if (page && page >= 1 && page <= this.totalPages) {
        this.selectedPage = page;
        this.loadLogsForPage(page);
      }
    }
  
    //siguiente pagina de los logs
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.loadLogsForPage(this.currentPage + 1);
      }
    }
    
    //pagina anterior de los logs
    prevPage(): void {
      if (this.currentPage > 1) {
        this.loadLogsForPage(this.currentPage - 1);
      }
    }
  
    //Ir a la pagina seleccionada
    goToPage(page: number | string): void {
      if (typeof page !== 'number') return;
      if (page >= 1 && page <= this.totalPages) {
        this.loadLogsForPage(page);
      }
    }
  
    //obtener número de páginas
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
  
    //exportar logs a Excel
    exportToExcel(): void {
      
      const dataToExport = this.paginatedLogs.map((log: any) => ({
        'id': log.id,
        'time': log.time,
        'date': log.date,
        'logLevel': log.logLevel,
        'content': log.content,
      }));
  
      // Crear una hoja 
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 15 }, 
        { wch: 25 }, 
        { wch: 25 },
        { wch: 20 },
        { wch: 60 },  
      ];
      worksheet['!cols'] = columnWidths;
  
      // Crear un libro de trabajo
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');
  
      // Generar el nombre del archivo con la fecha actual
      const fileName = `logs_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
  
      // Descargar el archivo
      XLSX.writeFile(workbook, fileName);
    }
  
  //cerrar sesión
  public logout(): void {
    this.authCodeService.logoutAndRedirect();
  }

}
  

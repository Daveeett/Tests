import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AuthCodeService } from '../../services/auth-code.service';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as XLSX from 'xlsx';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionLogOutOutline,ionDownloadOutline,ionSearch} from '@ng-icons/ionicons';
import { DeveloperService } from '../../services/developer-service';

dayjs.extend(isBetween);
@Component({
  selector: 'app-logs',
  imports: [CommonModule, FormsModule,NgIcon],
  viewProviders:[provideIcons({ionLogOutOutline,ionDownloadOutline,ionSearch })],
  templateUrl: './logs.html',
  styleUrl: './logs.css',
})
export class Logs implements OnInit,OnDestroy{

  logs: Array<{ id: number; date: string; time: string; logLevel: string; content: string; }> = [];
  filteredLogs: Array<{ id: number; date: string; time: string; logLevel: string; content: string; }> = [];
  paginatedLogs: Array<{ id: number; date: string; time: string; logLevel: string; content: string; }> = [];
  startDate: string = '';
  endDate: string = '';
  currentPage = 1;
  itemsPerPage = 50;
  totalPages = 1;
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
      }
      
      this.loading = true;
      this.pollingSubscription = interval(10000)
        .pipe(
          startWith(0),
          switchMap(() => this.logsService.getLogs())
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
          }
        });
    }
  
    ngOnDestroy(): void {
      this.pollingSubscription?.unsubscribe();
    }
    
    //filtrar logs por nombre de usuario y rango de fechas
    applyFilter(resetPage: boolean = false): void {
      let filtered = [...this.logs];
      
      
      // Filtrar por rango de fechas
      if(this.startDate||this.endDate){
        filtered= filtered.filter(log=>{
          const logDate= dayjs(log.date);
          //solo hay fecha de inicio
          if(this.startDate && !this.endDate){
            return logDate.isAfter(dayjs(this.startDate).startOf('day'))||
                    logDate.isSame(dayjs(this.startDate).startOf('day'));
          }
          //solo hay fecha de fin
          if(!this.startDate && this.endDate){
            return logDate.isBefore(dayjs(this.endDate).endOf('day'))||
                    logDate.isSame(dayjs(this.endDate).endOf('day'));
          }
          //hay fecha de inicio y fecha de fin
          if(this.startDate && this.endDate){
            return logDate.isBetween(dayjs(this.startDate).startOf('day'),dayjs(this.endDate).endOf('day'));
          }
          return true;
        })
      }
      this.filteredLogs= filtered;
      this.totalPages= Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  
      // Solo resetear a la primera página si se solicita explícitamente (cuando el usuario busca)
      if(resetPage || this.currentPage>this.totalPages){
        this.currentPage= this.totalPages>0? Math.min(this.currentPage,this.totalPages):1;
      }
      
      
      this.updatePaginatedLogs();
    }
  
  
    //manejar cambios en las fechas
    onDateChange(): void {
      this.applyFilter(true); // Resetear a página 1 cuando cambian las fechas
    }
  
  
    //limpiar filtros de fecha
    clearDateFilters(): void {
      this.startDate = '';
      this.endDate = '';
      this.applyFilter(true);
    }
  
    //actualizar paginas de los logs
    updatePaginatedLogs(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedLogs = this.filteredLogs.slice(startIndex, endIndex);
    }
  
    //siguiente pagina de los logs
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePaginatedLogs();
      }
    }
    
    //pagina anterior de los logs
    prevPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePaginatedLogs();
      }
    }
  
    //Ir a la pagina seleccionada
    goToPage(page: number | string): void {
      if (typeof page !== 'number') return;
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePaginatedLogs();
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
      
      const dataToExport = this.filteredLogs.map(log => ({
        'id': log.id,
        'date': log.date,
        'time': log.time,
        'logLevel': log.logLevel,
        'content': log.content,
      }));
  
      // Crear una hoja 
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 35 }, 
        { wch: 20 }, 
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },  
      ];
      worksheet['!cols'] = columnWidths;
  
      // Crear un libro de trabajo
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs de Usuarios');
  
      // Generar el nombre del archivo con la fecha actual
      const fileName = `logs_usuarios_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
  
      // Descargar el archivo
      XLSX.writeFile(workbook, fileName);
    }
  
    //cerrar sesión
    public logout(): void {
      this.authCodeService.logoutAndRedirect();
    }
  
  }
  

import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LogsUsers as LogsUsersService } from '../../services/logs-users';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AuthCodeService } from '../../services/auth-code.service';

@Component({
  selector: 'app-logs-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs-users.html',
  styleUrl: './logs-users.css',
})
export class LogsUsers implements OnInit, OnDestroy {
  logs: Array<{ userId: string; userName: string; loginTime: string }> = [];
  paginatedLogs: Array<{ userId: string; userName: string; loginTime: string }> = [];
  currentPage = 1;
  itemsPerPage = 11;
  totalPages = 1;
  loading = false;
  error: string | null = null;

  private pollingSubscription?: Subscription;

  constructor(
    private logsService: LogsUsersService,
    private authCodeService: AuthCodeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authCodeService.startSessionTimer();
    }
    
    this.loading = true;
    this.pollingSubscription = interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.logsService.getLogs())
      )
      .subscribe({
        next: (resp: any) => {
          this.loading = false;
          if (resp && resp.result) {
            this.logs = resp.data || [];
            this.totalPages = Math.ceil(this.logs.length / this.itemsPerPage);
            this.updatePaginatedLogs();
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
  
  //actualizar paginas de los logs
  updatePaginatedLogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLogs = this.logs.slice(startIndex, endIndex);
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

  //cerrar sesión
  public logout(): void {
    this.authCodeService.logoutAndRedirect();
  }

}

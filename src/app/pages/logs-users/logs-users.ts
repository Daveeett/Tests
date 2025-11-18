import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsUsers as LogsUsersService } from '../../services/logs-users';

@Component({
  selector: 'app-logs-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs-users.html',
  styleUrl: './logs-users.css',
})
export class LogsUsers implements OnInit {
  logs: Array<{ userId: string; userName: string; loginTime: string }> = [];
  loading = false;
  error: string | null = null;

  constructor(private logsService: LogsUsersService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  private loadLogs(): void {
    this.loading = true;
    this.error = null;
    this.logsService.getLogs().subscribe({
      next: (resp: any) => {
        this.loading = false;
        if (resp && resp.result) {
          this.logs = resp.data || [];
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
}

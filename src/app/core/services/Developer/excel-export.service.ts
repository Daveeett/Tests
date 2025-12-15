import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { DateUtilsService } from './date-utils.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  constructor(private dateUtils: DateUtilsService) {}

  // Export data to Excel file
  public exportToExcel<T>(
    data: T[],
    fileName: string,
    sheetName: string,
    columnWidths?: Array<{ wch: number }>
  ): void {
    if (!data || data.length === 0) {
      console.error('No data provided for export');
      return;
    }
    // Crea la hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Aplica anchos de columnas si se proporcionan
    if (columnWidths) {
      worksheet['!cols'] = columnWidths;
    }

    // Crea el libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Genera el nombre del archivo con timestamp
    const fullFileName = `${fileName}_${this.dateUtils.getFileNameTimestamp()}.xlsx`;

    // Descarga el archivo
    XLSX.writeFile(workbook, fullFileName);
  }

  // Exporta los logs a Excel
  public exportLogs(
    logs: Array<{ id: number; date: string; time: string; logLevel: string; content: string }>
  ): void {
    const dataToExport = logs.map((log) => ({
      id: log.id,
      time: log.time,
      date: log.date,
      logLevel: log.logLevel,
      content: log.content,
    }));

    const columnWidths = [
      { wch: 15 }, // id
      { wch: 25 }, // time
      { wch: 25 }, // date
      { wch: 20 }, // logLevel
      { wch: 60 }, // content
    ];

    this.exportToExcel(dataToExport, 'logs', 'Logs', columnWidths);
  }

  // Exporta los logs de usuarios a Excel
  public exportUserLogs(
    logs: Array<{ userIp: string; userName: string; loginTime: string }>
  ): void {
    const dataToExport = logs.map((log) => ({
      User: log.userName,
      IP: log.userIp,
      'Login Time': this.dateUtils.formatDateTimeFull(log.loginTime),
    }));

    const columnWidths = [
      { wch: 35 }, // User
      { wch: 20 }, // IP
      { wch: 25 }, // Login Time
    ];

    this.exportToExcel(dataToExport, 'logs_usuarios', 'Logs de Usuarios', columnWidths);
  }
}

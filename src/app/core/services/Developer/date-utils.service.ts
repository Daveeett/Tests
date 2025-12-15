import { Injectable } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  
  // Obtiene la fecha actual en formato YYYY-MM-DD
  public getTodayFormatted(): string {
    return dayjs().format('YYYY-MM-DD');
  }

  // Obtiene la fecha N dias atrás en formato YYYY-MM-DD
  public getDaysAgoFormatted(days: number): string {
    return dayjs().subtract(days, 'day').format('YYYY-MM-DD');
  }

  // Formatea la fecha string a formato localizado
  public formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Formatea la fecha con dayjs a DD/MM/YYYY HH:mm:ss
  public formatDateTimeFull(dateString: string): string {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
  }

  // Formatea la fecha actual para nombres de archivos
  public getFileNameTimestamp(): string {
    return dayjs().format('YYYY-MM-DD_HH-mm-ss');
  }

  // Verifica si una fecha está entre dos fechas
  public isDateBetween(date: string, startDate: string, endDate: string): boolean {
    const logDate = dayjs(date);
    return logDate.isBetween(
      dayjs(startDate).startOf('day'),
      dayjs(endDate).endOf('day'),
      null,
      '[]'
    );
  }

  // Verifica si una fecha es posterior o igual a una fecha inicial
  public isDateAfterOrEqual(date: string, startDate: string): boolean {
    const logDate = dayjs(date);
    const start = dayjs(startDate).startOf('day');
    return logDate.isAfter(start) || logDate.isSame(start);
  }

  // Verifica si una fecha es anterior o igual a una fecha final
  public isDateBeforeOrEqual(date: string, endDate: string): boolean {
    const logDate = dayjs(date);
    const end = dayjs(endDate).endOf('day');
    return logDate.isBefore(end) || logDate.isSame(end);
  }

  // Filtra items por rango de fecha
  public filterByDateRange<T>(
    items: T[],
    dateGetter: (item: T) => string,
    startDate?: string,
    endDate?: string
  ): T[] {
    if (!startDate && !endDate) {
      return items;
    }

    return items.filter((item) => {
      const itemDate = dateGetter(item);

      // Solo fecha inicial
      if (startDate && !endDate) {
        return this.isDateAfterOrEqual(itemDate, startDate);
      }

      // Solo fecha final
      if (!startDate && endDate) {
        return this.isDateBeforeOrEqual(itemDate, endDate);
      }

      // Ambas fechas
      if (startDate && endDate) {
        return this.isDateBetween(itemDate, startDate, endDate);
      }

      return true;
    });
  }
}

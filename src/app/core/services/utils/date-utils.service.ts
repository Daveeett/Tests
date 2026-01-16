import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  public getTodayFormatted(): string {
    return dayjs().format('YYYY-MM-DD');
    }

  public getDaysAgoFormatted(days: number): string {
    return dayjs().subtract(days, 'day').format('YYYY-MM-DD');
  }

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

  public formatDateTimeFull(dateString: string): string {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
  }

  public getFileNameTimestamp(): string {
    return dayjs().format('YYYY-MM-DD_HH-mm-ss');
  }

  public isDateBetween(date: string, startDate: string, endDate: string): boolean {
    const logDate = dayjs(date);
    return logDate.isBetween(
      dayjs(startDate).startOf('day'),
      dayjs(endDate).endOf('day'),
      null,
      '[]'
    );
  }

  public isDateAfterOrEqual(date: string, startDate: string): boolean {
    const logDate = dayjs(date);
    const start = dayjs(startDate).startOf('day');
    return logDate.isAfter(start) || logDate.isSame(start);
  }

  public isDateBeforeOrEqual(date: string, endDate: string): boolean {
    const logDate = dayjs(date);
    const end = dayjs(endDate).endOf('day');
    return logDate.isBefore(end) || logDate.isSame(end);
  }

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

      if (startDate && !endDate) {
        return this.isDateAfterOrEqual(itemDate, startDate);
      }
      if (!startDate && endDate) {
        return this.isDateBeforeOrEqual(itemDate, endDate);
      }
      if (startDate && endDate) {
        return this.isDateBetween(itemDate, startDate, endDate);
      }

      return true;
    });
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastNotificationService {
  private toastSubject = new Subject<ToastMessage>();

  public toast$ = this.toastSubject.asObservable();

  public show(message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number): void {
    this.toastSubject.next({ message, type, duration });
  }

  public success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  public error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  public info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
}


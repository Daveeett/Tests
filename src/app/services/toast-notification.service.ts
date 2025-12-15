import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastNotificationService {
  private toastSubject = new Subject<ToastMessage>();
  public toast$ = this.toastSubject.asObservable();

  public show(message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 4000): void {
    this.toastSubject.next({ message, type, duration });
  }
}

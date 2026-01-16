import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionCheckmarkDoneSharp,ionInformationCircleSharp,ionAlertCircleSharp} from '@ng-icons/ionicons';
@Component({
  selector: 'app-toast-notification',
  imports: [CommonModule,NgIcon],
  viewProviders:[provideIcons({ionCheckmarkDoneSharp,ionInformationCircleSharp,ionAlertCircleSharp})],
  templateUrl: './toast-notification.html',
  styleUrl: './toast-notification.css',
})
export class ToastNotification {
  public isVisible = signal(false);
  public message = signal('');
  public type = signal<'success' | 'error' | 'info'>('success');
  
  private hideTimeout?: number;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public show(message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 4000): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
      }

    this.message.set(message);
    this.type.set(type);
    this.isVisible.set(true);

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = window.setTimeout(() => {
      this.hide();
    }, duration);
  }

  public hide(): void {
    this.isVisible.set(false);
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }
}

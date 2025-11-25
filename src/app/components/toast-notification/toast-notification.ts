import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  //Muestra el toast con un mensaje

  public show(message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 4000): void {
    this.message.set(message);
    this.type.set(type);
    this.isVisible.set(true);

    // Limpiar timeout anterior si existe
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Auto-ocultar después de la duración especificada
    this.hideTimeout = window.setTimeout(() => {
      this.hide();
    }, duration);
  }

  //Oculta el toast
  public hide(): void {
    this.isVisible.set(false);
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }
}

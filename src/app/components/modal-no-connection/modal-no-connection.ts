import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionReloadCircleSharp} from '@ng-icons/ionicons';
@Component({
  selector: 'app-modal-no-connection',
  imports: [NgIcon],
  viewProviders:[provideIcons({ionReloadCircleSharp})],
  templateUrl: './modal-no-connection.html',
  styleUrl: './modal-no-connection.css',
})
export class ModalNoConnection {
  @ViewChild('connectionModal') modal!: ElementRef<HTMLDialogElement>;
  @Output() retryConnection = new EventEmitter<void>();

  //Abre el modal
  public open(): void {
    this.modal?.nativeElement.showModal();
  }

  //Cierra el modal
  public close(): void {
    this.modal?.nativeElement.close();
  }

  //Botón de reintentar
  public retry(): void {
    this.retryConnection.emit();
    this.close();
  }
}

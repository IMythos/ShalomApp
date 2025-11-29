import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private _isOpen = signal<boolean>(false);
  public isOpen: Signal<boolean> = this._isOpen.asReadonly();

  open() {
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }
}

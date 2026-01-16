import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public isAvailable(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  public setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) {
      console.warn('[LocalStorageService] localStorage not available');
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('[LocalStorageService] Error setting item:', e);
      return false;
    }
  }

  public getItem(key: string): string | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('[LocalStorageService] Error getting item:', e);
      return null;
    }
  }

  public removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('[LocalStorageService] Error removing item:', e);
      return false;
    }
  }

  public clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('[LocalStorageService] Error clearing storage:', e);
      return false;
    }
  }

  public setObject<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      return this.setItem(key, serialized);
    } catch (e) {
      console.error('[LocalStorageService] Error serializing object:', e);
      return false;
    }
  }

  public getObject<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) {
      return null;
    }

    try {
      return JSON.parse(item) as T;
    } catch (e) {
      console.error('[LocalStorageService] Error parsing object:', e);
      return null;
    }
  }
}

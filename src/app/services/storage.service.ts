import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * StorageService provides a wrapper around Ionic Storage
 * for persistent data storage across app sessions
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Initialize the storage engine
   */
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * Store a key-value pair in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  async set(key: string, value: any): Promise<any> {
    return this._storage?.set(key, value);
  }

  /**
   * Retrieve a value from storage by key
   * @param key - Storage key to retrieve
   * @returns Promise resolving to stored value or null
   */
  async get<T>(key: string): Promise<T | null> {
    return this._storage?.get(key) || null;
  }

  /**
   * Remove a key-value pair from storage
   * @param key - Storage key to remove
   */
  async remove(key: string): Promise<any> {
    return this._storage?.remove(key);
  }

  /**
   * Clear all data from storage
   */
  async clear(): Promise<void> {
    return this._storage?.clear();
  }
}
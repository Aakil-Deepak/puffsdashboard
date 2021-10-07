import { Injectable } from '@angular/core';
import { WindowService } from './window.service';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {
	constructor(window: WindowService) {
		this.sessionStorage = window.get.sessionStorage;
		this.JSON = window.get.JSON;
	}

	private readonly sessionStorage: Storage;
	private readonly JSON: JSON;

	get(key: string) {
		const json = this.sessionStorage.getItem(key);

		if (json == null || json === 'undefined') {
			return null;
		}

		return this.JSON.parse(json);
	}

	set(key: string, value: string) {
		const json = this.JSON.stringify(value);

		this.sessionStorage.setItem(key, json);
	}

	remove(key: string) {
		this.sessionStorage.removeItem(key);
	}

	clear() {
		this.sessionStorage.clear();
	}
}

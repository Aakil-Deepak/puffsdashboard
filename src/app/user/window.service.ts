import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WindowService {
	private _window = window;
	public get get() {
		return this._window;
	}

	public get height() {
		return this.get.innerHeight;
	}

	public get width() {
		return this.get.innerWidth;
	}

	public height$ = fromEvent(this.get, 'resize').pipe(
		map((e) => (e.target as Window).innerHeight)
	);

	public width$ = fromEvent(this.get, 'resize').pipe(
		map((e) => (e.target as Window).innerWidth)
	);
}

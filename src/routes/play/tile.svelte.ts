import * as lm from '$lib/math';

import type { PuzzleImage } from '../../lib/image';
import type { Matrix } from './matrix.svelte';

export class Tile {
	matrix: Matrix;

	// initial position in cell index
	initial: lm.Vec2d = $state({ x: 0, y: 0 });
	// current position in cell index
	current: lm.Vec2d = $state({ x: 0, y: 0 });

	zIndex: number = $state(0);

	#drag: {
		from: null | {
			// in cell
			originCurrent: lm.Vec2d;
			// in pixel
			originMouse: lm.Vec2d;
			// in pixel
			pullOffset: lm.Vec2d;
		};
		to: null | {
			// in cell
			originCurrent: lm.Vec2d;
		};
	} = $state({ from: null, to: null });

	constructor(x: number, y: number, matrix: Matrix) {
		this.matrix = matrix;
		this.initial = { x, y };
		this.current = { x, y };
		this.#drag = {
			from: null,
			to: null
		};
		this.zIndex = 0;
	}

	get #cols(): number {
		return this.matrix.cols;
	}

	get #image(): PuzzleImage {
		return this.matrix.image;
	}

	isDragFrom(): boolean {
		return this.#drag.from != null;
	}

	isDragTo(): boolean {
		return this.#drag.to != null;
	}

	originOrCurrent(): lm.Vec2d {
		return this.#drag.from?.originCurrent ?? this.#drag.to?.originCurrent ?? this.current;
	}

	getNext(dir: lm.Vec2d): Tile | null {
		return this.matrix.tileByCurrent(lm.vec2dAdd(this.current, dir));
	}

	isAtInitial(): boolean {
		return lm.vec2dEqual(this.current, this.initial);
	}

	isOkWith(tile: Tile): boolean {
		return lm.vec2dEqual(
			lm.vec2dSubtract(tile.current, this.current),
			lm.vec2dSubtract(tile.initial, this.initial)
		);
	}

	isOkWithNext(dir: lm.Vec2d): boolean {
		const next = this.getNext(dir);
		if (next) {
			return next.isOkWith(this);
		} else {
			return true;
		}
	}

	setDragFrom(mousePos: lm.Vec2d) {
		if (this.#drag.from != null) {
			throw new Error('setDragFrom: from already set');
		}
		if (this.#drag.to != null) {
			throw new Error('setDragFrom: to already set');
		}
		const slot = this.matrix.options.getSlotPos(this.current, this.#cols);
		if (!slot) {
			throw new Error('setDragFrom: slot not found');
		}
		this.#drag.from = {
			originCurrent: this.current,
			originMouse: mousePos,
			pullOffset: { x: 0, y: 0 }
		};
	}

	updateDragFrom(mousePos: lm.Vec2d) {
		if (this.#drag.from == null) {
			throw new Error('updateDragFrom: from unset');
		}
		const mouseDiff = lm.vec2dSubtract(mousePos, this.#drag.from.originMouse);
		this.#drag.from.pullOffset = mouseDiff;
	}

	unsetDragFrom() {
		if (this.#drag.from == null) {
			throw new Error('unsetDragFrom: from unset');
		}
		this.#drag.from = null;
	}

	setDragTo() {
		if (this.#drag.from != null) {
			throw new Error('setDragTo: from already set');
		}
		if (this.#drag.to != null) {
			throw new Error('setDragTo: to already set');
		}
		this.#drag.to = {
			originCurrent: this.current
		};
	}

	unsetDragTo() {
		if (this.#drag.to == null) {
			throw new Error('unsetDragTo: to unset');
		}
		this.current = this.#drag.to.originCurrent;
		this.#drag.to = null;
	}

	cancelDrag() {
		if (this.#drag.from) {
			this.current = this.#drag.from.originCurrent;
			this.unsetDragFrom();
		}
		if (this.#drag.to) {
			this.unsetDragTo();
		}
	}

	style: string | undefined = $derived.by(() => {
		const gridSize = this.matrix.gridSize;
		const initialSlotPos = this.matrix.options.getSlotPos(this.initial, this.#cols);
		let current;
		if (this.isDragFrom()) {
			current = this.originOrCurrent();
		} else {
			current = this.current;
		}
		const currentSlotPos = this.matrix.options.getSlotPos(current, this.#cols);
		const currentSlotSize = this.matrix.options.getSlotSize(current, this.#cols);
		if (gridSize && initialSlotPos && currentSlotPos && currentSlotSize) {
			let bgPos = { ...initialSlotPos };
			bgPos.x = Math.min(bgPos.x, gridSize.x - currentSlotSize.x);
			bgPos.x = Math.max(bgPos.x, 0);
			bgPos.x = bgPos.x * -1;
			bgPos.y = Math.min(bgPos.y, gridSize.y - currentSlotSize.y);
			bgPos.y = Math.max(bgPos.y, 0);
			bgPos.y = bgPos.y * -1;
			const bgSize = gridSize;
			return (
				`left: ${currentSlotPos.x + (this.#drag.from?.pullOffset.x ?? 0)}px; ` +
				`top: ${currentSlotPos.y + (this.#drag.from?.pullOffset?.y ?? 0)}px; ` +
				`width: ${currentSlotSize.x}px; ` +
				`height: ${currentSlotSize.y}px;` +
				`background-image: url(${this.#image.url}); ` +
				`background-position: ${bgPos.x}px ${bgPos.y}px; ` +
				`background-size: ${bgSize.x}px ${bgSize.y}px ; ` +
				`z-index: ${this.zIndex} ; `
			);
		}
	});
}

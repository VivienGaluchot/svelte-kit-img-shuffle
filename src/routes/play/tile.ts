import * as lm from '$lib/math';

import type { PuzzleImage } from './image';
import type { Matrix } from './matrix';

export class Tile {
	matrix: Matrix;

	// initial position in cell index
	initial: lm.Vec2d;
	// current position in cell index
	current: lm.Vec2d;

	private drag: {
		from: null | {
			// in cell
			originCurrent: lm.Vec2d;
			// in pixel
			originSlot: lm.Vec2d;
			// in pixel
			originMouse: lm.Vec2d;
			// in pixel
			pullOffset: lm.Vec2d;
		};
		to: null | {
			// in cell
			originCurrent: lm.Vec2d;
		};
	};

	constructor(x: number, y: number, matrix: Matrix) {
		this.matrix = matrix;
		this.initial = { x, y };
		this.current = { x, y };
		this.drag = {
			from: null,
			to: null
		};
	}

	get rows(): number {
		return this.matrix.rows;
	}

	get cols(): number {
		return this.matrix.cols;
	}

	get image(): PuzzleImage {
		return this.matrix.image;
	}

	isDragFrom(): boolean {
		return this.drag.from != null;
	}

	isDragTo(): boolean {
		return this.drag.to != null;
	}

	originOrCurrent(): lm.Vec2d {
		return this.drag.from?.originCurrent ?? this.drag.to?.originCurrent ?? this.current;
	}

	getNext(dir: lm.Vec2d): Tile | null {
		return this.matrix.tileByCurrent(lm.vec2dAdd(this.current, dir));
	}

	isOkWith(tile: Tile): boolean {
		return lm.vec2dEqual(
			lm.vec2dSubstract(tile.current, this.current),
			lm.vec2dSubstract(tile.initial, this.initial)
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
		if (this.drag.from != null) {
			throw new Error('setDragFrom: from already set');
		}
		if (this.drag.to != null) {
			throw new Error('setDragFrom: to already set');
		}
		const slot = this.matrix.options.getSlotPos(this.current, this.cols);
		if (!slot) {
			throw new Error('setDragFrom: slot not found');
		}
		this.drag.from = {
			originCurrent: this.current,
			originSlot: slot,
			originMouse: mousePos,
			pullOffset: { x: 0, y: 0 }
		};
	}

	updateDragFrom(mousePos: lm.Vec2d) {
		if (this.drag.from == null) {
			throw new Error('updateDragFrom: from unset');
		}
		const slot = this.matrix.options.getSlotPos(this.current, this.cols);
		if (!slot) {
			throw new Error('updateDragFrom: slot not found');
		}
		const mouseDiff = lm.vec2dSubstract(mousePos, this.drag.from.originMouse);
		const slotDiff = lm.vec2dSubstract(slot, this.drag.from.originSlot);
		const pullOffset = lm.vec2dSubstract(mouseDiff, slotDiff);
		this.drag.from.pullOffset = pullOffset;
	}

	unsetDragFrom() {
		if (this.drag.from == null) {
			throw new Error('unsetDragFrom: from unset');
		}
		this.drag.from = null;
	}

	setDragTo() {
		if (this.drag.from != null) {
			throw new Error('setDragTo: from already set');
		}
		if (this.drag.to != null) {
			throw new Error('setDragTo: to already set');
		}
		this.drag.to = {
			originCurrent: this.current
		};
	}

	unsetDragTo() {
		if (this.drag.to == null) {
			throw new Error('unsetDragTo: to unset');
		}
		this.current = this.drag.to.originCurrent;
		this.drag.to = null;
	}

	style() {
		const gridSize = this.matrix.options.getGridSize();
		const initialSlotPos = this.matrix.options.getSlotPos(this.initial, this.cols);
		const currentSlotPos = this.matrix.options.getSlotPos(this.current, this.cols);
		const currentSlotSize = this.matrix.options.getSlotSize(this.current, this.cols);
		if (gridSize && initialSlotPos && currentSlotPos && currentSlotSize) {
			const bgPos = lm.vec2dMultiply(initialSlotPos, { x: -1, y: -1 });
			const bgSize = gridSize;
			return (
				`left: ${currentSlotPos.x + (this.drag.from?.pullOffset.x ?? 0)}px; ` +
				`top: ${currentSlotPos.y + (this.drag.from?.pullOffset?.y ?? 0)}px; ` +
				`width: ${currentSlotSize.x}px; ` +
				`height: ${currentSlotSize.y}px;` +
				`background-image: url(${this.image.url}); ` +
				`background-position: ${bgPos.x}px ${bgPos.y}px; ` +
				`background-size: ${bgSize.x}px ${bgSize.y}px ; `
			);
		}
	}

	private bgX() {
		if (this.cols > 1) {
			return (100 / (this.cols - 1)) * this.initial.x;
		} else {
			return 0;
		}
	}

	private bgY() {
		if (this.rows > 1) {
			return (100 / (this.rows - 1)) * this.initial.y;
		} else {
			return 0;
		}
	}
}

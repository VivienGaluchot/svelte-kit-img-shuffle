import * as rand from '$lib/random';
import * as lm from '$lib/math';

import { Tile } from './tile';
import type { PuzzleImage } from './image';

export const DIR_2D_TOP = { x: 0, y: -1 };
export const DIR_2D_BOTTOM = { x: 0, y: 1 };
export const DIR_2D_LEFT = { x: -1, y: 0 };
export const DIR_2D_RIGHT = { x: 1, y: 0 };
export const DIRS_2D = [DIR_2D_TOP, DIR_2D_BOTTOM, DIR_2D_LEFT, DIR_2D_RIGHT];

export interface DragFromData {
	startClient: lm.Vec2d;
	startPos: lm.Vec2d;
	currentPos: lm.Vec2d;
	tiles: Tile[];
	dragActions: DragAction[];
}

export interface DragAction {
	tile: Tile;
	pos: lm.Vec2d;
	isDragTo: boolean;
}

export interface MatrixOptions {
	rows: number;
	cols: number;
	image: PuzzleImage;
	getGridSize(): lm.Vec2d | null;
	getSlotPos(pos: lm.Vec2d, cols: number): lm.Vec2d | null;
	getSlotSize(pos: lm.Vec2d, cols: number): lm.Vec2d | null;
}

export class Matrix {
	options: MatrixOptions;
	matrix: Tile[] = [];

	constructor(options: MatrixOptions) {
		this.options = options;
		this.matrix = [];
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				this.matrix.push(new Tile(x, y, this));
			}
		}
	}

	get rows(): number {
		return this.options.rows;
	}

	get cols(): number {
		return this.options.cols;
	}

	get image(): PuzzleImage {
		return this.options.image;
	}

	*tiles(): Generator<Tile> {
		for (const tile of this.matrix) {
			yield tile;
		}
	}

	tileGroup(origin: Tile): Set<Tile> {
		const group = new Set<Tile>();
		function reqFill(target: Tile) {
			if (!group.has(target)) {
				group.add(target);
				for (const dir of DIRS_2D) {
					const tile = target.getNext(dir);
					if (tile && target.isOkWith(tile)) {
						reqFill(tile);
					}
				}
			}
		}
		reqFill(origin);
		return group;
	}

	tileByInitial(p: lm.Vec2d): Tile | null {
		if (this.isInRange(p)) {
			return this.matrix[p.y * this.cols + p.x];
		} else {
			return null;
		}
	}

	isInRange(p: lm.Vec2d) {
		return p.x >= 0 && p.x < this.cols && p.y >= 0 && p.y < this.rows;
	}

	tileByCurrent(p: lm.Vec2d): Tile | null {
		// TODO optimize
		for (const tile of this.matrix) {
			if (lm.vec2dEqual(tile.current, p)) {
				return tile;
			}
		}
		return null;
	}

	tileByOriginCurrent(p: lm.Vec2d): Tile | null {
		// TODO optimize
		for (const tile of this.matrix) {
			if (lm.vec2dEqual(tile.originOrCurrent(), p)) {
				return tile;
			}
		}
		return null;
	}

	style() {
		return (
			`aspect-ratio: ${this.image.w} / ${this.image.h}; ` +
			`grid-template-columns: repeat(${this.cols}, 1fr);`
		);
	}

	shuffle() {
		const positions = [
			...this.matrix.map((tile) => {
				return { ...tile.current };
			})
		];
		rand.shuffle(positions);
		for (const index in this.matrix) {
			this.matrix[index].current = positions[index];
		}
	}

	solveDrag(tiles: Tile[], offset: lm.Vec2d): DragAction[] {
		const out: DragAction[] = [];
		if (offset.x != 0 || offset.y != 0) {
			const tilesPos = [];
			for (const tile of tiles) {
				const pos = lm.vec2dAdd(tile.current, offset);
				if (!this.isInRange(pos)) {
					return [];
				}
				tilesPos.push({ pos, tile });
			}
			for (const { pos, tile } of tilesPos) {
				out.push({ tile, pos: pos, isDragTo: false });
				const dragTo = this.tileByOriginCurrent(pos);
				if (dragTo && !tiles.includes(dragTo)) {
					let dragToPos: lm.Vec2d;
					let isDone: boolean;
					let dragFromTile = tile;
					let iterations = 0;
					do {
						dragToPos = dragFromTile.originOrCurrent();
						isDone = true;
						for (const { pos, tile } of tilesPos) {
							if (lm.vec2dEqual(pos, dragToPos)) {
								isDone = false;
								dragFromTile = tile;
								break;
							}
						}
						iterations++;
						if (iterations > 1000) {
							throw new Error('infinite loop');
						}
					} while (!isDone);
					out.push({
						tile: dragTo,
						pos: dragToPos,
						isDragTo: true
					});
				}
			}
		}
		return out;
	}

	// drag

	dragFrom: DragFromData | null = null;
	dragTarget: Tile | null = null;

	setDragFrom(pos: lm.Vec2d, mousePos: lm.Vec2d) {
		const tile = this.tileByOriginCurrent(pos);
		if (tile) {
			const tiles = [...this.tileGroup(tile)];
			this.dragFrom = {
				startClient: mousePos,
				startPos: pos,
				currentPos: pos,
				tiles,
				dragActions: []
			};
			tiles.map((tile) => tile.setDragFrom(mousePos));
		}
	}

	dragUpdate(mousePos: lm.Vec2d) {
		const slotSize = this.options.getSlotSize(this.matrix[0].current, this.cols);
		if (slotSize && this.dragFrom) {
			// relative to drag start
			const startClientOffset = lm.vec2dSubstract(mousePos, this.dragFrom.startClient);
			const startOffset = lm.vec2dRound(lm.vec2dDivide(startClientOffset, slotSize));
			// relative to last update
			const currentPos = lm.vec2dAdd(this.dragFrom.startPos, startOffset);
			const currentOffset = lm.vec2dSubstract(currentPos, this.dragFrom.currentPos);
			this.dragFrom.currentPos = currentPos;
			const actions = this.solveDrag(this.dragFrom.tiles, currentOffset);
			if (actions.length != 0) {
				this.dragFrom.dragActions.map((action) => {
					if (action.isDragTo) {
						action.tile.unsetDragTo();
					}
				});
				this.dragFrom.dragActions = actions;
				this.dragFrom.dragActions.map((action) => {
					if (action.isDragTo) {
						action.tile.setDragTo();
					} else {
						action.tile.updateDragFrom(mousePos);
					}
					action.tile.current = action.pos;
				});
			}

			this.dragFrom?.tiles.map((tile) => {
				tile.updateDragFrom(mousePos);
			});
		}
	}

	unsetDragFrom() {
		this.dragFrom?.tiles.map((item) => item.unsetDragFrom());
		this.dragFrom?.dragActions.map((action) => {
			if (action.isDragTo) {
				action.tile.unsetDragTo();
			}
			action.tile.current = action.pos;
		});
		this.dragFrom = null;
		this.dragTarget = null;
	}
}

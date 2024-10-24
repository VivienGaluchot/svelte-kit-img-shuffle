import * as rd from '$lib/random';
import * as lm from '$lib/math';

import { Tile } from './tile';
import { splitInCell, type PuzzleImage } from '../../lib/image';

export const DIR_2D_TOP = { x: 0, y: -1 };
export const DIR_2D_BOTTOM = { x: 0, y: 1 };
export const DIR_2D_LEFT = { x: -1, y: 0 };
export const DIR_2D_RIGHT = { x: 1, y: 0 };
export const DIRS_2D = [DIR_2D_TOP, DIR_2D_BOTTOM, DIR_2D_LEFT, DIR_2D_RIGHT];

export interface DragFromData {
	// drag start in pixels
	startClient: lm.Vec2d;
	// drag start in cells
	startPos: lm.Vec2d;
	// bounding box for offset relative to start position in cells
	startOffsetBoundingBox: lm.Rect2d;
	// drag position in cells
	currentPos: lm.Vec2d;
	// tiles dragged
	tiles: Tile[];
	// list of tiles impacted by the drag
	dragActions: DragAction[];
}

export interface DragAction {
	tile: Tile;
	pos: lm.Vec2d;
	isDragTo: boolean;
}

export interface MatrixOptions {
	tileCount: number;
	image: PuzzleImage;
	getGridSize(): lm.Vec2d | null;
	getSlotPos(pos: lm.Vec2d, cols: number): lm.Vec2d | null;
	getSlotSize(pos: lm.Vec2d, cols: number): lm.Vec2d | null;
}

export class Matrix {
	options: MatrixOptions;
	rows: number;
	cols: number;
	matrix: Tile[] = [];
	bounds: lm.Rect2d;

	constructor(options: MatrixOptions) {
		this.options = options;
		let tiles = splitInCell(options.image.size, options.tileCount);
		this.cols = tiles.x;
		this.rows = tiles.y;
		this.matrix = [];
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				this.matrix.push(new Tile(x, y, this));
			}
		}
		this.bounds = {
			min: { x: 0, y: 0 },
			max: { x: this.cols - 1, y: this.rows - 1 }
		};
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
			return this.matrix[p.y * this.cols + p.x]!;
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
			`aspect-ratio: ${this.image.size.x} / ${this.image.size.y}; ` +
			`grid-template-columns: repeat(${this.cols}, 1fr);`
		);
	}

	shuffle(rand?: rd.RandomGenerator) {
		const positions = [
			...this.matrix.map((tile) => {
				return { ...tile.current };
			})
		];
		rd.shuffle(rand ?? Math.random, positions);
		for (const index in this.matrix) {
			this.matrix[index]!.current = positions[index]!;
		}
	}

	// TODO attempt to fix the 3 over 2 drag inversion.
	solveDrag(tiles: Tile[], offset: lm.Vec2d): DragAction[] {
		const out: DragAction[] = [];
		if (offset.x != 0 || offset.y != 0) {
			const draggedTiles = [];
			for (const tile of tiles) {
				const toPos = lm.vec2dAdd(tile.current, offset);
				if (!this.isInRange(toPos)) {
					return [];
				}
				const toTile = this.tileByOriginCurrent(toPos);
				if (toTile == null) {
					throw new Error('solveDrag: toTile null');
				}
				const isToDragged = tiles.includes(toTile);
				draggedTiles.push({ tile, toPos, toTile, isToDragged });
			}
			for (const { tile, toPos, toTile, isToDragged } of draggedTiles) {
				out.push({ tile, pos: toPos, isDragTo: false });
				if (!isToDragged) {
					let dragToPos: lm.Vec2d;
					let isDone: boolean;
					let dragFromTile = tile;
					let iterations = 0;
					do {
						dragToPos = dragFromTile.originOrCurrent();
						isDone = true;
						for (const { toPos, tile } of draggedTiles) {
							if (lm.vec2dEqual(toPos, dragToPos)) {
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
						tile: toTile,
						pos: dragToPos,
						isDragTo: true
					});
				}
			}
		}
		return out;
	}

	isSolved(): boolean {
		for (const tile of this.matrix) {
			if (!tile.isAtInitial()) {
				return false;
			}
		}
		return true;
	}

	// drag

	dragFrom: DragFromData | null = null;

	setDragFrom(pos: lm.Vec2d, mousePos: lm.Vec2d): void {
		const tile = this.tileByOriginCurrent(pos);
		if (tile) {
			const tiles = [...this.tileGroup(tile)];
			const boundingBox = getBoundingBox(tiles);
			if (boundingBox == null) {
				throw new Error('setDragFrom: boundingBox null');
			}
			const startOffsetBoundingBox = {
				min: lm.vec2dSubtract(this.bounds.min, boundingBox.min),
				max: lm.vec2dSubtract(this.bounds.max, boundingBox.max)
			};
			this.dragFrom = {
				startClient: mousePos,
				startPos: pos,
				currentPos: pos,
				tiles,
				dragActions: [],
				startOffsetBoundingBox: startOffsetBoundingBox
			};
			tiles.map((tile) => tile.setDragFrom(mousePos));
		}
	}

	isDragging(): boolean {
		return this.dragFrom != null;
	}

	dragUpdate(mousePos: lm.Vec2d): void {
		const slotSize = this.options.getSlotSize(this.matrix[0]!.current, this.cols);
		if (slotSize && this.dragFrom) {
			// relative to drag start
			const startClientOffset = lm.vec2dSubtract(mousePos, this.dragFrom.startClient);
			const startOffset = lm.vec2dBound(
				lm.vec2dRound(lm.vec2dDivide(startClientOffset, slotSize)),
				this.dragFrom.startOffsetBoundingBox
			);
			// relative to last update
			const currentPos = lm.vec2dBound(
				lm.vec2dAdd(this.dragFrom.startPos, startOffset),
				this.bounds
			);
			const currentOffset = lm.vec2dSubtract(currentPos, this.dragFrom.currentPos);
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

	unsetDragFrom(pos: lm.Vec2d | null): boolean {
		let hasMoved;
		if (pos && this.dragFrom?.startPos && !lm.vec2dEqual(this.dragFrom?.startPos, pos)) {
			hasMoved = true;
		} else {
			hasMoved = false;
		}
		this.dragFrom?.tiles.map((item) => item.unsetDragFrom());
		this.dragFrom?.dragActions.map((action) => {
			if (action.isDragTo) {
				action.tile.unsetDragTo();
			}
			action.tile.current = action.pos;
		});
		this.dragFrom = null;
		return hasMoved;
	}

	cancelDrag(): void {
		this.matrix.forEach((tile) => tile.cancelDrag());
		this.dragFrom = null;
	}
}

function getBoundingBox(tiles: Tile[]): lm.Rect2d | null {
	const [first, ...rest] = tiles;
	if (first) {
		const rec = { min: first.current, max: first.current };
		for (const tile of rest) {
			rec.min = lm.vec2dMin(rec.min, tile.current);
			rec.max = lm.vec2dMax(rec.max, tile.current);
		}
		return rec;
	} else {
		return null;
	}
}

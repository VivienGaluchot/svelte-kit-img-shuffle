<script lang="ts">
	import { shuffle } from '$lib/random';
	import demoImage from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif';
	import * as lm from '$lib/math';
	import { onMount } from 'svelte';

	let slotGrid: HTMLElement | null = null;
	let showBorders: boolean = false;

	const tileSizes: lm.Vec2d = { x: 0, y: 0 };

	function updateTileSizes() {
		if (slotGrid && slotGrid.firstElementChild) {
			const element = slotGrid.firstElementChild;
			if (element instanceof HTMLElement) {
				tileSizes.x = element.offsetWidth;
				tileSizes.y = element.offsetHeight;
				tilesMatrix = tilesMatrix;
			}
		}
	}

	function getSlotPos(pos: lm.Vec2d, cols: number): lm.Vec2d | null {
		if (slotGrid) {
			const id = pos.y * cols + pos.x;
			if (id >= 0 && id < slotGrid.children.length) {
				const element = slotGrid.children[id];
				if (element instanceof HTMLElement) {
					return { x: element.offsetLeft, y: element.offsetTop };
				}
			}
		}
		return null;
	}

	// Game

	const DIR_2D_TOP = { x: 0, y: -1 };
	const DIR_2D_BOTTOM = { x: 0, y: 1 };
	const DIR_2D_LEFT = { x: -1, y: 0 };
	const DIR_2D_RIGHT = { x: 1, y: 0 };
	const DIRS_2D = [DIR_2D_TOP, DIR_2D_BOTTOM, DIR_2D_LEFT, DIR_2D_RIGHT];

	interface PuzzleImage {
		url: string;
		w: number;
		h: number;
	}

	class Tile {
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

		get image(): PuzzleImage {
			return this.matrix.image;
		}

		get cols(): number {
			return this.matrix.cols;
		}

		get rows(): number {
			return this.matrix.rows;
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
			const slot = getSlotPos(this.current, this.cols);
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
			const slot = getSlotPos(this.current, this.cols);
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
			const slot = getSlotPos(this.current, this.cols);
			if (slot) {
				return (
					`left: ${slot.x + (this.drag.from?.pullOffset.x ?? 0)}px; ` +
					`top: ${slot.y + (this.drag.from?.pullOffset?.y ?? 0)}px; ` +
					`width: ${tileSizes.x}px; height: ${tileSizes.x}px;` +
					`background-image: url(${this.image.url}); ` +
					`background-position: ${this.bgX()}% ${this.bgY()}%; ` +
					`background-size: ${100 * Math.min(this.cols, this.rows)}%;`
				);
			}
		}

		bgX() {
			return (100 / (this.cols - 1)) * this.initial.x;
		}

		bgY() {
			return (100 / (this.rows - 1)) * this.initial.y;
		}
	}

	interface DragFromData {
		startClient: lm.Vec2d;
		startPos: lm.Vec2d;
		currentPos: lm.Vec2d;
		tiles: Tile[];
		dragActions: DragAction[];
	}

	interface DragAction {
		tile: Tile;
		pos: lm.Vec2d;
		isDragTo: boolean;
	}

	class Matrix {
		rows: number;
		cols: number;
		image: PuzzleImage;
		matrix: Tile[] = [];

		constructor(rows: number, cols: number, image: PuzzleImage) {
			this.rows = rows;
			this.cols = cols;
			this.image = image;
			this.matrix = [];
			for (let y = 0; y < this.rows; y++) {
				for (let x = 0; x < this.cols; x++) {
					this.matrix.push(new Tile(x, y, this));
				}
			}
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
			for (const tile of this.matrix) {
				if (lm.vec2dEqual(tile.current, p)) {
					return tile;
				}
			}
			return null;
		}

		tileByOriginCurrent(p: lm.Vec2d): Tile | null {
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
			shuffle(positions);
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
			if (this.dragFrom) {
				// relative to drag start
				const startClientOffset = lm.vec2dSubstract(mousePos, this.dragFrom.startClient);
				const startOffset = lm.vec2dRound(lm.vec2dDivide(startClientOffset, tileSizes));
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

	export let tilesMatrix = new Matrix(5, 4, { url: demoImage, w: 930, h: 1162 });
	tilesMatrix.shuffle();

	// Drag

	function slotPosFromEl(el: HTMLElement): lm.Vec2d | null {
		if (el.dataset.posX && el.dataset.posY) {
			const x = Number(el.dataset.posX);
			const y = Number(el.dataset.posY);
			return { x, y };
		} else {
			return null;
		}
	}

	function slotPosFromPoint(p: lm.Vec2d): lm.Vec2d | null {
		for (const el of document.elementsFromPoint(p.x, p.y)) {
			if (el instanceof HTMLElement) {
				const pos = slotPosFromEl(el);
				if (pos) {
					return pos;
				}
			}
		}
		return null;
	}

	function onMouseDown(event: MouseEvent) {
		const mousePos = { x: event.clientX, y: event.clientY };
		const pos = slotPosFromPoint(mousePos);
		if (pos) {
			tilesMatrix.setDragFrom(pos, mousePos);
			tilesMatrix = tilesMatrix;
		}
	}

	function onMouseMove(event: MouseEvent) {
		const mousePos = { x: event.clientX, y: event.clientY };
		tilesMatrix.dragUpdate(mousePos);
		tilesMatrix = tilesMatrix;
	}

	function onMouseUp(event: MouseEvent) {
		tilesMatrix.unsetDragFrom();
		tilesMatrix = tilesMatrix;
	}

	onMount(() => {
		window.addEventListener('resize', updateTileSizes);
		updateTileSizes();
		return () => {
			window.removeEventListener('resize', updateTileSizes);
		};
	});
</script>

<svelte:head>
	<title>Play - Picture slicer multi</title>
</svelte:head>

<!--
	TODO
	- compute rows and cols based on img size and number of pieces
	- multi player / localised shuffle
	- matrix history, integrity check (rollback in case of invalid move)
 -->
<div class="stack" class:show-borders={showBorders}>
	<div class="grid" style={tilesMatrix.style()} bind:this={slotGrid}>
		{#each [...tilesMatrix.tiles()] as tile}
			<div class="slot" data-pos-x={tile.initial.x} data-pos-y={tile.initial.y} />
		{/each}
	</div>
	{#each [...tilesMatrix.tiles()] as tile}
		<div
			class="tile"
			class:drag-from={tile.isDragFrom()}
			class:top-ok={tile.isOkWithNext(DIR_2D_TOP)}
			class:bottom-ok={tile.isOkWithNext(DIR_2D_BOTTOM)}
			class:left-ok={tile.isOkWithNext(DIR_2D_LEFT)}
			class:right-ok={tile.isOkWithNext(DIR_2D_RIGHT)}
			on:mousedown={onMouseDown}
			style={tile.style()}
		/>
	{/each}
</div>

<div class="toolbar">
	<button
		on:click={() => {
			tilesMatrix.shuffle();
			tilesMatrix = tilesMatrix;
		}}>Shuffle</button
	>
	<div>
		<input id="boder-checkbox" type="checkbox" bind:checked={showBorders} />
		<label for="boder-checkbox">Show borders</label>
	</div>
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.stack {
		position: relative;
		overflow: hidden;
	}

	.grid {
		display: grid;
		width: 50rem;
		max-width: 100%;
	}

	.slot {
		user-select: none;
		outline: 0.2rem solid rgba(0, 0, 0, 0.1);
		outline-offset: -1rem;
	}

	.tile {
		position: absolute;
		top: 0;
		left: 0;
		width: 1rem;
		height: 1rem;
		user-select: none;
		box-sizing: border-box;
	}

	.tile::after {
		display: block;
		content: '';
		height: 100%;
		box-sizing: border-box;
		border: 0 solid #15222e;
		transition: border 50ms ease-in-out;
	}
	.stack.show-borders .tile:not(.top-ok)::after {
		border-top-width: 0.2rem;
	}
	.stack.show-borders .tile:not(.bottom-ok)::after {
		border-bottom-width: 0.2rem;
	}
	.stack.show-borders .tile:not(.left-ok)::after {
		border-left-width: 0.2rem;
	}
	.stack.show-borders .tile:not(.right-ok)::after {
		border-right-width: 0.2rem;
	}

	.tile:not(.tile.drag-from) {
		transition: top 200ms ease-in-out, left 200ms ease-in-out;
	}

	.tile.drag-from {
		z-index: 1;
	}

	.toolbar {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}
</style>

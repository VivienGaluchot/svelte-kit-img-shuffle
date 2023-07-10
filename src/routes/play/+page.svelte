<script lang="ts">
	import { shuffle } from '$lib/random';
	import demoImage from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif';
	import { vec2dAdd, type Vec2d, vec2dEqual, vec2dSubstract } from '$lib/math';
	import { onMount } from 'svelte';

	export let slotGrid: HTMLElement | null = null;

	export const tileSizes: Vec2d = { x: 0, y: 0 };

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

	function getSlot(pos: Vec2d, cols: number): HTMLElement | null {
		if (slotGrid) {
			const id = pos.y * cols + pos.x;
			if (id >= 0 && id < slotGrid.children.length) {
				const element = slotGrid.children[id];
				if (element instanceof HTMLElement) {
					return element;
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
		initial: Vec2d;
		// current position in cell index
		current: Vec2d;

		drag: {
			originCurrent: null | Vec2d;
			isDragFrom: boolean;
			// TODO use ?
			isDragTo: boolean;
			// TODO use ?
			// position in pixel
			offset: Vec2d;
		};

		constructor(x: number, y: number, matrix: Matrix) {
			this.matrix = matrix;
			this.initial = { x, y };
			this.current = { x, y };
			this.drag = {
				originCurrent: null,
				isDragFrom: false,
				isDragTo: false,
				offset: { x: 0, y: 0 }
			};
		}

		get image() {
			return this.matrix.image;
		}

		get cols() {
			return this.matrix.cols;
		}

		get rows() {
			return this.matrix.rows;
		}

		getNext(dir: Vec2d): Tile | null {
			return this.matrix.tileByCurrent(vec2dAdd(this.current, dir));
		}

		isOkWith(tile: Tile): boolean {
			return vec2dEqual(
				vec2dSubstract(tile.current, this.current),
				vec2dSubstract(tile.initial, this.initial)
			);
		}

		isOkWithNext(dir: Vec2d): boolean {
			const next = this.getNext(dir);
			if (next) {
				return next.isOkWith(this);
			} else {
				return true;
			}
		}

		setDragFrom() {
			this.drag.isDragFrom = true;
			if (this.drag.originCurrent != null) {
				throw new Error('setDragFrom: originCurrent already set');
			}
			this.drag.originCurrent = { ...this.current };
		}

		unsetDragFrom() {
			if (this.drag.originCurrent == null) {
				throw new Error('unsetDragFrom: originCurrent unset');
			}
			this.drag.isDragFrom = false;
			this.drag.offset = { x: 0, y: 0 };
			this.drag.originCurrent = null;
		}

		setDragTo() {
			if (this.drag.originCurrent != null) {
				throw new Error('setDragTo: originCurrent already set');
			}
			this.drag.isDragTo = true;
			this.drag.originCurrent = { ...this.current };
		}

		unsetDragTo() {
			if (this.drag.originCurrent == null) {
				throw new Error('unsetDragTo: originCurrent unset');
			}
			this.drag.isDragTo = false;
			this.current = this.drag.originCurrent;
			this.drag.originCurrent = null;
		}

		style() {
			const slot = getSlot(this.current, this.cols);
			if (slot) {
				return (
					`left: ${slot.offsetLeft + this.drag.offset.x}px; ` +
					`top: ${slot.offsetTop + this.drag.offset.y}px; ` +
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
		startClient: Vec2d;
		startPos: Vec2d;
		tiles: Tile[];
		dragActions: DragAction[];
	}

	interface DragAction {
		tile: Tile;
		pos: Vec2d;
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

		tileByInitial(p: Vec2d): Tile | null {
			if (this.isInRange(p)) {
				return this.matrix[p.y * this.cols + p.x];
			} else {
				return null;
			}
		}

		isInRange(p: Vec2d) {
			return p.x >= 0 && p.x < this.cols && p.y >= 0 && p.y < this.rows;
		}

		tileByCurrent(p: Vec2d): Tile | null {
			for (const tile of this.matrix) {
				if (vec2dEqual(tile.current, p)) {
					return tile;
				}
			}
			return null;
		}

		tileByOriginCurrent(p: Vec2d): Tile | null {
			for (const tile of this.matrix) {
				const current = tile.drag.originCurrent ?? tile.current;
				if (vec2dEqual(current, p)) {
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

		solveDrag(tiles: Tile[], offset: Vec2d): DragAction[] {
			const out: DragAction[] = [];
			if (offset.x != 0 || offset.y != 0) {
				const tilesPos = [];
				for (const tile of tiles) {
					const pos = vec2dAdd(tile.current, offset);
					if (!this.isInRange(pos)) {
						return [];
					}
					tilesPos.push({ pos, tile });
				}
				for (const { pos, tile } of tilesPos) {
					out.push({ tile, pos: pos, isDragTo: false });
					const dragTo = this.tileByOriginCurrent(pos);
					if (dragTo && !tiles.includes(dragTo)) {
						let dragToPos: Vec2d;
						let isDone: boolean;
						let dragFromTile = tile;
						do {
							dragToPos = dragFromTile.drag.originCurrent ?? dragFromTile.current;
							isDone = true;
							for (const { pos, tile } of tilesPos) {
								if (vec2dEqual(pos, dragToPos)) {
									isDone = false;
									dragFromTile = tile;
									break;
								}
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

		setDragFrom(pos: Vec2d, clientPos: Vec2d) {
			const tile = this.tileByOriginCurrent(pos);
			if (tile) {
				const tiles = [...this.tileGroup(tile)];
				this.dragFrom = {
					startClient: clientPos,
					startPos: pos,
					tiles,
					dragActions: []
				};
				tiles.map((tile) => tile.setDragFrom());
			}
		}

		dragUpdate(pos: Vec2d | null, clientPos: Vec2d) {
			if (this.dragFrom && pos) {
				const offset = vec2dSubstract(pos, this.dragFrom.startPos);
				this.dragFrom.startPos = pos;
				const actions = this.solveDrag(this.dragFrom.tiles, offset);
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
						}
						action.tile.current = action.pos;
					});
				}
			}
		}

		unsetDragFrom(pos: Vec2d | null, clientPos: Vec2d) {
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

	// Drag

	function slotPosFromEl(el: HTMLElement): Vec2d | null {
		if (el.dataset.posX && el.dataset.posY) {
			const x = Number(el.dataset.posX);
			const y = Number(el.dataset.posY);
			return { x, y };
		} else {
			return null;
		}
	}

	function slotPosFromPoint(p: Vec2d): Vec2d | null {
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
		const clientPos = { x: event.clientX, y: event.clientY };
		const pos = slotPosFromPoint(clientPos);
		if (pos) {
			tilesMatrix.setDragFrom(pos, clientPos);
			tilesMatrix = tilesMatrix;
		}
	}

	function onMouseMove(event: MouseEvent) {
		const clientPos = { x: event.clientX, y: event.clientY };
		tilesMatrix.dragUpdate(slotPosFromPoint(clientPos), clientPos);
		tilesMatrix = tilesMatrix;
	}

	function onMouseUp(event: MouseEvent) {
		const clientPos = { x: event.clientX, y: event.clientY };
		tilesMatrix.unsetDragFrom(slotPosFromPoint(clientPos), clientPos);
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
<div class="stack">
	<div class="grid" style={tilesMatrix.style()} bind:this={slotGrid}>
		{#each [...tilesMatrix.tiles()] as tile}
			<div class="slot" data-pos-x={tile.initial.x} data-pos-y={tile.initial.y} />
		{/each}
	</div>
	{#each [...tilesMatrix.tiles()] as tile}
		<div
			class="tile"
			class:drag-from={tile.drag.isDragFrom}
			class:drag-to={tile.drag.isDragTo}
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
		transition: border-radius 200ms;
	}

	.tile::after {
		display: block;
		content: '';
		height: 100%;
		box-sizing: border-box;
		border: 0 solid #15222e;
		transition: border 50ms;
	}
	.tile:not(.top-ok)::after {
		border-top-width: 0.2rem;
	}
	.tile:not(.bottom-ok)::after {
		border-bottom-width: 0.2rem;
	}
	.tile:not(.left-ok)::after {
		border-left-width: 0.2rem;
	}
	.tile:not(.right-ok)::after {
		border-right-width: 0.2rem;
	}

	.tile {
		transition: top 200ms, left 200ms;
	}

	.tile.drag-from {
		z-index: 1;
		outline: 0.2rem dashed white;
		outline-offset: -0.4rem;
		opacity: 0.8;
	}

	.tile.drag-to {
		outline: 0.2rem dashed rgb(194, 207, 9);
		outline-offset: -0.4rem;
		opacity: 0.8;
	}

	.tile:not(.drag-from):hover {
		outline: 0.2rem dashed white;
		outline-offset: -0.4rem;
	}

	.toolbar {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
	}
</style>

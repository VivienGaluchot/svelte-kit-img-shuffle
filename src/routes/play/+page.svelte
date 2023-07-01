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

		initial: Vec2d;
		current: Vec2d;
		drag: {
			tmpCurrent: null | Vec2d;
			isDragFrom: boolean;
			isDragTo: boolean;
			left: number;
			top: number;
		};

		constructor(x: number, y: number, matrix: Matrix) {
			this.matrix = matrix;
			this.initial = { x, y };
			this.current = { x, y };
			this.drag = { tmpCurrent: null, isDragFrom: false, isDragTo: false, left: 0, top: 0 };
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

		swapTo(to: Tile) {
			const tmp = this.current;
			this.current = to.current;
			to.current = tmp;
		}

		setDragFrom() {
			this.drag.isDragFrom = true;
		}

		unsetDragFrom() {
			this.drag.left = 0;
			this.drag.top = 0;
			this.drag.isDragFrom = false;
		}

		setDragTo(from: Tile) {
			this.drag.isDragTo = true;
			if (this.drag.tmpCurrent == null) {
				this.drag.tmpCurrent = this.current;
			}
			this.current = from.current;
		}

		unsetDragTo() {
			this.drag.isDragTo = false;
			if (this.drag.tmpCurrent != null) {
				this.current = this.drag.tmpCurrent;
				this.drag.tmpCurrent = null;
			}
		}

		style() {
			const slot = getSlot(this.current, this.cols);
			if (slot) {
				return (
					`left: ${slot.offsetLeft + this.drag.left}px; ` +
					`top: ${slot.offsetTop + this.drag.top}px; ` +
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
			if (p.x >= 0 && p.x < this.cols && p.y >= 0 && p.y < this.rows) {
				return this.matrix[p.y * this.cols + p.x];
			} else {
				return null;
			}
		}

		tileByCurrent(p: Vec2d): Tile | null {
			for (const tile of this.matrix) {
				if (vec2dEqual(tile.current, p)) {
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

		// drag

		dragFrom: DragFromData | null = null;
		dragTarget: Tile | null = null;

		dragStart(pos: Vec2d, clientPos: Vec2d) {
			const tile = this.tileByCurrent(pos);
			if (tile) {
				const tiles = [...this.tileGroup(tile)];
				this.dragFrom = {
					startClient: clientPos,
					startPos: { ...tile.current },
					tiles
				};
				tiles.map((tile) => tile.setDragFrom());
			}
		}

		dragUpdate(pos: Vec2d | null, clientPos: Vec2d) {
			if (this.dragFrom) {
				const left = clientPos.x - this.dragFrom.startClient.x;
				const top = clientPos.y - this.dragFrom.startClient.y;
				this.dragFrom.tiles.map((tile) => {
					tile.drag.left = left;
					tile.drag.top = top;
				});
				if (pos) {
					const tile = this.tileByCurrent(pos);
					if (tile) {
						let isBack = tile == this.dragTarget;
						this.dragTarget?.unsetDragTo();
						if (!isBack) {
							this.dragTarget = tile;
							this.dragTarget.setDragTo(this.dragFrom.tiles[0]);
						} else {
							this.dragTarget = null;
						}
					}
				}
			}
		}

		dragStop(pos: Vec2d | null, clientPos: Vec2d) {
			this.dragFrom?.tiles.map((item) => item.unsetDragFrom());
			this.dragTarget?.unsetDragTo();
			if (this.dragFrom && this.dragTarget) {
				this.dragFrom.tiles[0].swapTo(this.dragTarget);
			}
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
			tilesMatrix.dragStart(pos, clientPos);
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
		tilesMatrix.dragStop(slotPosFromPoint(clientPos), clientPos);
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
	- merge tiles elements, cut with clip-path
	  (developer.mozilla.org/fr/docs/Web/CSS/clip-path)
	- animated drag swap
	- drag multiple tiles at once
	- compute rows and cols based on img size and number of pieces
	- multi player / localised shuffle
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
			class:top-ok={tile.drag.isDragFrom || tile.isOkWithNext(DIR_2D_TOP)}
			class:bottom-ok={tile.drag.isDragFrom || tile.isOkWithNext(DIR_2D_BOTTOM)}
			class:left-ok={tile.drag.isDragFrom || tile.isOkWithNext(DIR_2D_LEFT)}
			class:right-ok={tile.drag.isDragFrom || tile.isOkWithNext(DIR_2D_RIGHT)}
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
		transition: border 200ms;
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

	.tile:not(.tile.drag-from) {
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

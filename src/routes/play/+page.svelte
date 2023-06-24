<script lang="ts">
	import demoImage from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif';
	import { vec2dAdd, type Vec2d, vec2dEqual, vec2dSubstract } from '$lib/math';
	import { onMount } from 'svelte';

	function shuffle<T>(array: T[]) {
		let currentIndex = array.length;
		let randomIndex;
		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
	}

	export let slotGrid: HTMLElement | null = null;

	export const tileSizes: Vec2d = { x: 0, y: 0 };

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

	interface PuzzleImage {
		url: string;
		w: number;
		h: number;
	}

	class Tile {
		initial: Vec2d;
		current: Vec2d;
		drag: {
			tmpCurrent: null | Vec2d;
			isDragFrom: boolean;
			isDragTo: boolean;
			left: number;
			top: number;
		};

		rows: number;
		cols: number;

		image: PuzzleImage;

		constructor(x: number, y: number, rows: number, cols: number, image: PuzzleImage) {
			this.initial = { x, y };
			this.current = { x, y };
			this.drag = { tmpCurrent: null, isDragFrom: false, isDragTo: false, left: 0, top: 0 };
			this.rows = rows;
			this.cols = cols;
			this.image = image;
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
			console.log(slot, this.current, this.cols);
			if (slot) {
				return (
					`left: ${slot.offsetLeft + this.drag.left}px; top: ${
						slot.offsetTop + this.drag.top
					}px; ` +
					`background-image: url(${this.image.url}); ` +
					`background-position: ${this.bgX()}% ${this.bgY()}%; ` +
					`background-size: ${100 * Math.min(this.cols, this.rows)}%;` +
					`width: ${tileSizes.x}px; height: ${tileSizes.x}px;`
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
					this.matrix.push(new Tile(x, y, this.rows, this.cols, image));
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
			const self = this;
			const dirs = [
				{ x: 0, y: -1 },
				{ x: 1, y: 0 },
				{ x: 0, y: 1 },
				{ x: -1, y: 0 }
			];
			function reqFill(target: Tile) {
				if (!group.has(target)) {
					group.add(target);
					for (const dir of dirs) {
						const tile = self.tileByInitial(vec2dAdd(target.initial, dir));
						if (tile && vec2dEqual(vec2dSubstract(tile.current, target.current), dir)) {
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
	}

	export let tilesMatrix = new Matrix(5, 4, { url: demoImage, w: 930, h: 1162 });

	let dragStart: Vec2d | null = null;
	let dragFrom: Tile[] | null = null;
	let dragTarget: Tile | null = null;

	function tileFromEl(el: HTMLElement): Tile | null {
		if (el.dataset.posX && el.dataset.posY) {
			const x = Number(el.dataset.posX);
			const y = Number(el.dataset.posY);
			return tilesMatrix.tileByInitial({ x, y });
		} else {
			return null;
		}
	}

	function onMouseDown(event: MouseEvent) {
		const el = event.target;
		if (el instanceof HTMLElement) {
			const tile = tileFromEl(el);
			if (tile) {
				dragFrom = [...tilesMatrix.tileGroup(tile)];
				dragFrom.map((tile) => tile.setDragFrom());
				console.log(dragFrom);
				tilesMatrix = tilesMatrix;
			}
		}
		dragStart = { x: event.clientX, y: event.clientY };
	}

	function onMouseMove(event: MouseEvent) {
		if (dragFrom && dragStart) {
			const left = event.clientX - dragStart.x;
			const top = event.clientY - dragStart.y;
			dragFrom.map((tile) => {
				tile.drag.left = left;
				tile.drag.top = top;
			});
			for (const el of document.elementsFromPoint(event.clientX, event.clientY)) {
				if (el instanceof HTMLElement) {
					const tile = tileFromEl(el);
					if (tile != null && !tile.drag.isDragFrom) {
						let isBack = tile == dragTarget;
						dragTarget?.unsetDragTo();
						if (!isBack) {
							dragTarget = tile;
							dragTarget.setDragTo(dragFrom[0]);
						} else {
							dragTarget = null;
						}
					}
				}
			}
			tilesMatrix = tilesMatrix;
		}
	}

	function onMouseUp(event: MouseEvent) {
		dragStart = null;
		dragFrom?.map((item) => item.unsetDragFrom());
		dragTarget?.unsetDragTo();
		if (dragFrom && dragTarget) {
			dragFrom[0].swapTo(dragTarget);
		}
		tilesMatrix = tilesMatrix;
		dragFrom = null;
		dragTarget = null;
	}

	function updateLayout() {
		if (slotGrid && slotGrid.firstElementChild) {
			const element = slotGrid.firstElementChild;
			if (element instanceof HTMLElement) {
				tileSizes.x = element.offsetWidth;
				tileSizes.y = element.offsetHeight;
				tilesMatrix = tilesMatrix;
			}
		}
	}

	onMount(() => {
		window.addEventListener('resize', updateLayout);
		updateLayout();
		return () => {
			window.removeEventListener('resize', updateLayout);
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
 -->
<div class="stack">
	<div class="grid" style={tilesMatrix.style()} bind:this={slotGrid}>
		{#each [...tilesMatrix.tiles()] as tile}
			<div class="slot" />
		{/each}
	</div>
	{#each [...tilesMatrix.tiles()] as tile}
		<div
			class="tile"
			class:drag-from={tile.drag.isDragFrom}
			class:drag-to={tile.drag.isDragTo}
			data-pos-x={tile.initial.x}
			data-pos-y={tile.initial.y}
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
		border-radius: 2rem;
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

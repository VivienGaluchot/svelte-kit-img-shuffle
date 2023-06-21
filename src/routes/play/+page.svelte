<script lang="ts">
	import demoImage from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif';

	function shuffle<T>(array: T[]) {
		let currentIndex = array.length;
		let randomIndex;
		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
	}

	interface Pos {
		x: number;
		y: number;
	}

	interface PuzzleImage {
		url: string;
		w: number;
		h: number;
	}

	class Tile {
		initial: Pos;
		current: Pos;
		drag: {
			tmpCurrent: null | Pos;
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
			return (
				`left: ${this.drag.left}px; top: ${this.drag.top}px; ` +
				`grid-row: ${this.current.y + 1}; grid-column: ${this.current.x + 1}; ` +
				`background-image: url(${this.image.url}); ` +
				`background-position: ${this.bgX()}% ${this.bgY()}%; ` +
				`background-size: ${100 * Math.min(this.cols, this.rows)}%;`
			);
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

		tile(p: Pos): Tile | null {
			return this.matrix[p.y * this.cols + p.x];
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

	let dragStart: Pos | null = null;
	let dragFrom: Tile | null = null;
	let dragTo: Tile | null = null;

	function tileFromEl(el: HTMLElement): Tile | null {
		if (el.dataset.posX && el.dataset.posY) {
			const x = Number(el.dataset.posX);
			const y = Number(el.dataset.posY);
			return tilesMatrix.tile({ x, y });
		} else {
			return null;
		}
	}

	function onMouseDown(event: MouseEvent) {
		const el = event.target;
		if (el instanceof HTMLElement) {
			dragFrom = tileFromEl(el);
			if (dragFrom) {
				dragFrom.setDragFrom();
				tilesMatrix = tilesMatrix;
			}
		}
		dragStart = { x: event.clientX, y: event.clientY };
	}

	function onMouseMove(event: MouseEvent) {
		if (dragFrom && dragStart) {
			dragFrom.drag.left = event.clientX - dragStart.x;
			dragFrom.drag.top = event.clientY - dragStart.y;
			for (const el of document.elementsFromPoint(event.clientX, event.clientY)) {
				if (el instanceof HTMLElement) {
					const tile = tileFromEl(el);
					if (tile != null && tile != dragFrom) {
						let isBack = tile == dragTo;
						dragTo?.unsetDragTo();
						if (!isBack) {
							dragTo = tile;
							dragTo.setDragTo(dragFrom);
						} else {
							dragTo = null;
						}
					}
				}
			}
			tilesMatrix = tilesMatrix;
		}
	}

	function onMouseUp(event: MouseEvent) {
		dragStart = null;
		dragFrom?.unsetDragFrom();
		dragTo?.unsetDragTo();
		if (dragFrom && dragTo) {
			dragFrom.swapTo(dragTo);
		}
		tilesMatrix = tilesMatrix;
		dragFrom = null;
		dragTo = null;
	}
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
<div class="grid" style={tilesMatrix.style()}>
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
	.grid {
		display: grid;
		width: 50rem;
	}

	.tile {
		user-select: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		justify-content: center;
		position: relative;
		transition: border-radius 200ms;
	}

	.tile.drag-from {
		z-index: 1;
		border-radius: 0.5rem;
	}

	.tile.drag-to {
		outline: 0.2rem dashed white;
		outline-offset: -0.4rem;
	}

	.tile:hover {
		outline: 0.2rem dashed white;
		outline-offset: -0.4rem;
	}

	.toolbar {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
	}
</style>

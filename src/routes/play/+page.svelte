<script lang="ts">
	interface Pos {
		x: number;
		y: number;
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

		constructor(x: number, y: number) {
			this.initial = { x, y };
			this.current = { x, y };
			this.drag = { tmpCurrent: null, isDragFrom: false, isDragTo: false, left: 0, top: 0 };
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
	}

	class Matrix {
		matrix: Tile[][] = [];

		constructor(row: number, col: number) {
			for (let y = 0; y < col; y++) {
				this.matrix[y] = [];
				for (let x = 0; x < row; x++) {
					this.matrix[y][x] = new Tile(x, y);
				}
			}
		}

		*tiles(): Generator<Tile> {
			for (const row of this.matrix) {
				for (const tile of row) {
					yield tile;
				}
			}
		}

		tile(p: Pos): Tile | null {
			return this.matrix[p.y][p.x];
		}
	}

	export let tilesMatrix = new Matrix(4, 4);

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
	- snap drag
	- drag element
 -->
<div class="grid">
	{#each [...tilesMatrix.tiles()] as tile}
		<div
			class="tile"
			class:drag-from={tile.drag.isDragFrom}
			class:drag-to={tile.drag.isDragTo}
			data-pos-x={tile.initial.x}
			data-pos-y={tile.initial.y}
			on:mousedown={onMouseDown}
			style="left: {tile.drag.left}px; top: {tile.drag.top}px; grid-row: {tile.current.y +
				1}; grid-column: {tile.current.x + 1};"
		>
			{tile.initial.x}, {tile.initial.y}
		</div>
	{/each}
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}

	.tile {
		user-select: none;
		width: 8rem;
		height: 8rem;
		background-color: hsl(180, 15%, 70%);
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		justify-content: center;
		color: hsl(180, 15%, 50%);
		border: 1px solid hsl(180, 15%, 50%);
		position: relative;
	}

	.tile.drag-from {
		scale: 1.1;
		z-index: 1;
	}

	.tile.drag-to {
		background-color: hsl(180, 15%, 60%);
	}

	.tile:hover {
		background-color: hsl(180, 15%, 60%);
	}
</style>

<script lang="ts">
	interface Pos {
		x: number;
		y: number;
	}

	interface Tile {
		initial: Pos;
		drag: {
			isDragFrom: boolean;
			isDragTo: boolean;
			left: number;
			top: number;
		};
	}

	class Matrix {
		matrix: Tile[][] = [];

		constructor(row: number, col: number) {
			for (let y = 0; y < col; y++) {
				this.matrix[y] = [];
				for (let x = 0; x < row; x++) {
					this.matrix[y][x] = {
						initial: { x, y },
						drag: { isDragFrom: false, isDragTo: false, left: 0, top: 0 }
					};
				}
			}
		}

		rows(): Tile[][] {
			return this.matrix;
		}

		tile(p: Pos) {
			return this.matrix[p.y][p.x];
		}

		trigger() {
			this.matrix = this.matrix;
		}

		swap(a: Pos, b: Pos) {
			[this.matrix[a.y][a.x], this.matrix[b.y][b.x]] = [
				this.matrix[b.y][b.x],
				this.matrix[a.y][a.x]
			];
		}
	}

	export let tilesMatrix = new Matrix(4, 4);

	let dragFrom: Pos | null = null;
	let dragTo: Pos | null = null;

	function posFromEl(el: HTMLElement): Pos | null {
		if (el.dataset.posX && el.dataset.posY) {
			const x = Number(el.dataset.posX);
			const y = Number(el.dataset.posY);
			return { x, y };
		} else {
			return null;
		}
	}

	function onMouseDown(event: MouseEvent) {
		const el = event.target;
		if (el instanceof HTMLElement) {
			dragFrom = posFromEl(el);
			if (dragFrom) {
				tilesMatrix.tile(dragFrom).drag.isDragFrom = true;
				tilesMatrix = tilesMatrix;
			}
		}
	}

	function onMouseMove(event: MouseEvent) {
		if (dragFrom) {
			tilesMatrix.tile(dragFrom).drag.left += event.movementX;
			tilesMatrix.tile(dragFrom).drag.top += event.movementY;
			for (const el of document.elementsFromPoint(event.clientX, event.clientY)) {
				if (el instanceof HTMLElement) {
					const pos = posFromEl(el);
					if (pos && pos != dragFrom) {
						if (dragTo != null && dragTo != pos) {
							tilesMatrix.tile(dragTo).drag.isDragTo = false;
						}
						dragTo = pos;
						tilesMatrix.tile(dragTo).drag.isDragTo = true;
					}
				}
			}
			tilesMatrix = tilesMatrix;
		}
	}

	function onMouseUp(event: MouseEvent) {
		if (dragFrom) {
			tilesMatrix.tile(dragFrom).drag.left = 0;
			tilesMatrix.tile(dragFrom).drag.top = 0;
			tilesMatrix.tile(dragFrom).drag.isDragFrom = false;
		}
		if (dragTo) {
			tilesMatrix.tile(dragTo).drag.isDragTo = false;
		}
		if (dragFrom && dragTo) {
			tilesMatrix.swap(dragFrom, dragTo);
		}
		tilesMatrix = tilesMatrix;
		dragFrom = null;
		dragTo = null;
	}
</script>

<svelte:head>
	<title>Play - Picture slicer multi</title>
</svelte:head>

<div>
	{#each tilesMatrix.rows() as tileRow, row}
		<div class="row">
			{#each tileRow as tile, col}
				<div
					class="tile"
					class:drag-from={tile.drag.isDragFrom}
					class:drag-to={tile.drag.isDragTo}
					data-pos-x={col}
					data-pos-y={row}
					on:mousedown={onMouseDown}
					style="left: {tile.drag.left}px; top: {tile.drag.top}px;"
				>
					{tile.initial.x}, {tile.initial.y}
				</div>
			{/each}
		</div>
	{/each}
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.row {
		display: flex;
	}

	.tile {
		user-select: none;
		width: 8rem;
		height: 8rem;
		background-color: rgb(76, 92, 92);
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		justify-content: center;
		color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(0, 0, 0, 0.2);
		position: relative;
	}

	.tile.drag-from {
		scale: 1.1;
		z-index: 1;
	}

	.tile.drag-to {
		background-color: rgb(33, 39, 39);
	}

	.tile:hover {
		background-color: rgb(65, 126, 126);
	}
</style>

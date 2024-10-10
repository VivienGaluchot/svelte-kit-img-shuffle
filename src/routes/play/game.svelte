<script lang="ts">
	import { onMount } from 'svelte';

	import * as lm from '$lib/math';
	import { cachedFn } from '$lib/cache';

	import { DIR_2D_BOTTOM, DIR_2D_LEFT, DIR_2D_RIGHT, DIR_2D_TOP, Matrix } from './matrix';
	import type { PuzzleImage } from '$lib/image';

	// Publics

	export let tileCount: number;
	export let image: PuzzleImage;
	export let showBorders: boolean;

	export let actionCount: number = 0;
	export let rows: number = 0;
	export let cols: number = 0;

	export let isSolved: boolean = false;

	// Slots

	const slots: HTMLElement[] = [];
	let slotGrid: HTMLElement;

	const getGridSize = cachedFn((): lm.Vec2d | null => {
		if (slotGrid) {
			return { x: slotGrid.offsetWidth, y: slotGrid.offsetHeight };
		}
		return null;
	});

	const getSlotPos = cachedFn((pos: lm.Vec2d, cols: number): lm.Vec2d | null => {
		if (slots.length > 0) {
			if (pos.x >= cols) {
				return null;
			}
			const id = pos.y * cols + pos.x;
			if (id >= 0 && id < slots.length) {
				return { x: slots[id].offsetLeft, y: slots[id].offsetTop };
			}
		}
		return null;
	});

	const getSlotSize = cachedFn((pos: lm.Vec2d, cols: number): lm.Vec2d | null => {
		if (slots.length > 0) {
			const slotPos = getSlotPos.call(pos, cols);
			const nextRight = getSlotPos.call(lm.vec2dAdd(pos, DIR_2D_RIGHT), cols);
			const nextBottom = getSlotPos.call(lm.vec2dAdd(pos, DIR_2D_BOTTOM), cols);

			const id = pos.y * cols + pos.x;
			if (id < 0 || id >= slots.length) {
				return null;
			}
			const size = { x: slots[id].offsetWidth, y: slots[id].offsetHeight };

			if (slotPos && nextRight) {
				size.x = nextRight.x - slotPos.x;
			}
			if (slotPos && nextBottom) {
				size.y = nextBottom.y - slotPos.y;
			}
			return size;
		}
		return null;
	});

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

	// Drag

	function onMouseDown(event: MouseEvent) {
		if (isSolved) return;
		const mousePos = { x: event.clientX, y: event.clientY };
		const pos = slotPosFromPoint(mousePos);
		if (pos) {
			matrix.setDragFrom(pos, mousePos);
			matrix = matrix;
		}
	}

	function onMouseMove(event: MouseEvent) {
		if (isSolved) return;
		const mousePos = { x: event.clientX, y: event.clientY };
		matrix.dragUpdate(mousePos);
		matrix = matrix;
	}

	function onMouseUp(event: MouseEvent) {
		if (isSolved) return;
		const mousePos = { x: event.clientX, y: event.clientY };
		const pos = slotPosFromPoint(mousePos);
		const hasMoved = matrix.unsetDragFrom(pos);
		if (hasMoved) {
			actionCount += 1;
		}
		matrix = matrix;
		isSolved = matrix.isSolved();
	}

	// Main

	let matrix = new Matrix({
		tileCount,
		image,
		getGridSize: getGridSize.call,
		getSlotPos: getSlotPos.call,
		getSlotSize: getSlotSize.call
	});
	matrix.shuffle();

	export function shuffle() {
		matrix.shuffle();
		matrix = matrix;
		isSolved = matrix.isSolved();
	}

	function onResize() {
		getGridSize.clear();
		getSlotPos.clear();
		getSlotSize.clear();
		matrix = matrix;
	}

	onMount(() => {
		matrix = matrix;
		isSolved = matrix.isSolved();
		rows = matrix.rows;
		cols = matrix.cols;
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<!--
	TODO
	- multi player / local shuffle
	- matrix history, integrity check (rollback in case of invalid move)
	- z layer priority
	- tile components for optimizations ?
 -->
<div class="stack" class:show-borders={showBorders}>
	<div class="grid" style={matrix.style()} bind:this={slotGrid}>
		{#each [...matrix.tiles()] as tile, index (tile)}
			<div
				class="slot"
				data-pos-x={tile.initial.x}
				data-pos-y={tile.initial.y}
				bind:this={slots[index]}
			/>
		{/each}
	</div>
	{#each [...matrix.tiles()] as tile (tile)}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
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

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.stack {
		position: relative;
		overflow: hidden;
		border-radius: 0.2rem;
	}

	.grid {
		display: grid;
		width: 50rem;
		max-width: 100%;
	}

	.slot {
		user-select: none;
		background: rgba(0, 0, 0, 0.2);
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
</style>

<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as lm from '$lib/math';
	import * as rd from '$lib/random';
	import { cachedFn } from '$lib/cache';
	import type { PuzzleImage } from '$lib/image';
	import { DIR_2D_BOTTOM, DIR_2D_RIGHT, Matrix } from './matrix.svelte';

	interface Props {
		tileCount: number;
		seed: string;
		image: PuzzleImage;
		actionCount: number;
		rows: number;
		cols: number;
		isSolved: boolean;
	}

	let {
		tileCount,
		seed,
		image,
		actionCount = $bindable(),
		rows = $bindable(),
		cols = $bindable(),
		isSolved = $bindable()
	}: Props = $props();

	// Slots
	// ---------------------------

	const slots: HTMLElement[] = $state([]);
	let slotGrid: HTMLElement;

	const getSlotPos = cachedFn((pos: lm.Vec2d, cols: number): lm.Vec2d | null => {
		if (slots.length > 0) {
			if (pos.x >= cols) {
				return null;
			}
			const id = pos.y * cols + pos.x;
			if (id >= 0 && id < slots.length) {
				return { x: slots[id]!.offsetLeft, y: slots[id]!.offsetTop };
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
			const size = { x: slots[id]!.offsetWidth, y: slots[id]!.offsetHeight };

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

	// Matrix
	// ---------------------------

	const matrix = new Matrix({
		tileCount,
		image,
		getSlotPos: getSlotPos.call,
		getSlotSize: getSlotSize.call
	});

	// Generic events
	// ---------------------------

	function dragStart(clientPos: lm.Vec2d) {
		if (isSolved) return;
		if (matrix.isDragging()) {
			// handle edge cases where 2 mouse down are called without a mouse up in between
			matrix.cancelDrag();
		}
		const pos = slotPosFromPoint(clientPos);
		if (pos) {
			matrix.setDragFrom(pos, clientPos);
		}
	}

	function dragMove(clientPos: lm.Vec2d) {
		if (isSolved) return;
		if (!matrix.isDragging()) return;
		matrix.dragUpdate(clientPos);
	}

	function dragEnd(clientPos: lm.Vec2d) {
		if (isSolved) return;
		if (!matrix.isDragging()) return;
		const pos = slotPosFromPoint(clientPos);
		const hasMoved = matrix.unsetDragFrom(pos);
		if (hasMoved) {
			actionCount += 1;
		}
		isSolved = matrix.isSolved();
	}

	// Mouse events
	// ---------------------------

	function onMouseDown(event: MouseEvent): void {
		event.preventDefault();
		dragStart({ x: event.clientX, y: event.clientY });
	}

	function onMouseMove(event: MouseEvent): void {
		event.preventDefault();
		dragMove({ x: event.clientX, y: event.clientY });
	}

	function onMouseUp(event: MouseEvent): void {
		event.preventDefault();
		dragEnd({ x: event.clientX, y: event.clientY });
	}

	// Touch events
	// ---------------------------

	let touchId: number | undefined = undefined;

	function onTouchStart(event: TouchEvent): void {
		event.preventDefault();
		if (touchId != undefined) return;
		const touch = event.changedTouches[0];
		if (touch) {
			touchId = touch.identifier;
			dragStart({ x: touch.clientX, y: touch.clientY });
		}
	}

	function onTouchMove(event: TouchEvent): void {
		event.preventDefault();
		if (touchId == undefined) return;
		for (const touch of event.changedTouches) {
			if (touch.identifier == touchId) {
				dragMove({ x: touch.clientX, y: touch.clientY });
			}
		}
	}

	function onTouchEnd(event: TouchEvent): void {
		event.preventDefault();
		if (touchId == undefined) return;
		for (const touch of event.changedTouches) {
			if (touch.identifier == touchId) {
				touchId = undefined;
				dragEnd({ x: touch.clientX, y: touch.clientY });
				break;
			}
		}
	}

	function onTouchCancel(event: TouchEvent): void {
		event.preventDefault();
		if (touchId == undefined) return;
		for (const touch of event.changedTouches) {
			if (touch.identifier == touchId) {
				touchId = undefined;
				dragEnd({ x: touch.clientX, y: touch.clientY });
				break;
			}
		}
	}

	function addTouchListener(element: HTMLDivElement): void {
		// add events via action to set the passive flag to true
		// in order to call prevent default in touch events
		element.addEventListener('touchstart', onTouchStart, { passive: false });
		element.addEventListener('touchend', onTouchEnd, { passive: false });
		element.addEventListener('touchcancel', onTouchCancel, { passive: false });
		element.addEventListener('touchmove', onTouchMove, { passive: false });
	}

	// Main
	// ---------------------------

	function onResize() {
		getSlotPos.clear();
		getSlotSize.clear();
		matrix.gridSize = { x: slotGrid.offsetWidth, y: slotGrid.offsetHeight };
	}

	function onBeforeUnload(event: Event) {
		if (!isSolved && actionCount > 0) {
			event.preventDefault();
		}
	}

	beforeNavigate(({ cancel }) => {
		if (!isSolved && actionCount > 0) {
			if (!window.confirm('Puzzle state not saved, exit anyway?')) {
				cancel();
			}
		}
	});

	onMount(() => {
		matrix.shuffle(rd.getSfc32(rd.getSeed128(seed)));
		isSolved = matrix.isSolved();
		rows = matrix.rows;
		cols = matrix.cols;
		window.addEventListener('resize', onResize);
		onResize();
		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<svelte:window on:beforeunload={onBeforeUnload} />

<!--
	TODO
	- multi player / local shuffle
	- matrix history, integrity check (rollback in case of invalid move)
 -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="stack">
	<div
		class="grid"
		style={matrix.style()}
		bind:this={slotGrid}
		onmousedown={onMouseDown}
		onmouseup={onMouseUp}
		onmousemove={onMouseMove}
		use:addTouchListener
	>
		{#each matrix.matrix as tile, index (tile)}
			<div
				class="slot"
				data-pos-x={tile.initial.x}
				data-pos-y={tile.initial.y}
				bind:this={slots[index]}
			></div>
		{/each}
		{#each matrix.matrix as tile (tile)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- <div
			class="tile"
			class:drag-from={tile.isDragFrom()}
			class:top-ok={tile.isOkWithNext(DIR_2D_TOP)}
			class:bottom-ok={tile.isOkWithNext(DIR_2D_BOTTOM)}
			class:left-ok={tile.isOkWithNext(DIR_2D_LEFT)}
			class:right-ok={tile.isOkWithNext(DIR_2D_RIGHT)}
			style={tile.style()}
		/> -->
			<div class="tile" class:drag-from={tile.isDragFrom()} style={tile.style}></div>
		{/each}
	</div>
</div>

<style>
	.stack {
		position: relative;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.2);
		flex-grow: 1;
		border-radius: 0.5rem;
		container-type: size;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@property --grid-aspect-ratio {
		syntax: '<number>';
		inherits: false;
		initial-value: 1;
	}

	.grid {
		position: relative;
		display: grid;
		width: min(100cqw, calc(var(--grid-aspect-ratio) * 100cqh));
		height: min(calc(100cqw / var(--grid-aspect-ratio)), 100cqh);
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
	/*
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
	*/

	.tile:not(.tile.drag-from) {
		transition:
			top 200ms ease-in-out,
			left 200ms ease-in-out;
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Dialog from '$lib/cmp/dialog.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let dialog: Dialog;

	let pendingResolve: ((result: boolean) => void) | undefined = $state(undefined);

	function yes(): void {
		pendingResolve?.(true);
		dialog.close();
	}

	function no(): void {
		pendingResolve?.(false);
		dialog.close();
	}

	export function ask(): Promise<boolean> {
		pendingResolve?.(false);
		const promise = new Promise<boolean>((resolve) => {
			pendingResolve = resolve;
		});
		dialog.showModal();
		return promise;
	}
</script>

<Dialog
	bind:this={dialog}
	onClose={() => {
		pendingResolve?.(false);
	}}
>
	<div class="flex-v">
		<div class="title">Confirmation required</div>
		<div class="content">
			{@render children?.()}
		</div>
		<div class="buttons">
			<button class="danger" onclick={yes}>Yes</button>
			<!-- svelte-ignore a11y_autofocus -->
			<button autofocus onclick={no}>No</button>
		</div>
	</div>
</Dialog>

<style>
	.flex-v {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.content {
		font-weight: lighter;
	}

	.buttons {
		display: flex;
		justify-content: end;
		gap: 0.5rem;
	}

	.buttons button {
		min-width: 4rem;
	}
</style>

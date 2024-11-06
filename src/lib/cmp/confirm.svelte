<script lang="ts">
	import Dialog from '$lib/cmp/dialog.svelte';

	let dialog: Dialog;

	let pendingResolve: ((result: boolean) => void) | undefined = undefined;

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
			<slot />
		</div>
		<div class="buttons">
			<button class="danger" on:click={yes}>Yes</button>
			<!-- svelte-ignore a11y-autofocus -->
			<button autofocus on:click={no}>No</button>
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

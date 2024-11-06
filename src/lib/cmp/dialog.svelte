<script lang="ts">
	export let onClose: (() => void) | undefined = undefined;

	let dialog: HTMLDialogElement;
	let clickTarget: HTMLDivElement;

	export function showModal() {
		dialog.showModal();
	}

	export function close() {
		dialog.close();
		onClose?.();
	}

	function click(event: MouseEvent) {
		if (event.target === dialog) {
			close();
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:click={click}>
	<div class="content">
		<slot />
	</div>
</dialog>

<style>
	dialog {
		background-color: transparent;
		border: none;
	}

	.content {
		backdrop-filter: blur(0.8rem) brightness(60%) contrast(60%) saturate(400%);
		border-radius: 0.2rem;
		color: white;
		padding: 1.5rem;
		animation-duration: 200ms;
		animation-name: blip;
		/* animation-fill-mode: both; */
	}

	::backdrop {
		background-color: rgba(0, 0, 0, 0.2);
	}

	@keyframes blip {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 1;
		}
	}
</style>

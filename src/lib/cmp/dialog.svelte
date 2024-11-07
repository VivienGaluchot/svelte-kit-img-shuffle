<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onClose?: (() => void) | undefined;
		children?: Snippet;
	}

	let { onClose = undefined, children }: Props = $props();

	let dialog: HTMLDialogElement;

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

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog bind:this={dialog} onclick={click}>
	<div class="content">
		{@render children?.()}
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

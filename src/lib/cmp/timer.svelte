<script lang="ts">
	interface Props {
		durationInSec: number;
	}

	let { durationInSec }: Props = $props();
</script>

{Math.floor(durationInSec / 60)
	.toString()
	.padStart(2, '0')}:{(durationInSec % 60).toString().padStart(2, '0')}

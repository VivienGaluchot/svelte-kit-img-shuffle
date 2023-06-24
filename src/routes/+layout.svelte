<script>
	import Nav from './Nav.svelte';
</script>

<svelte:head>
	<title>Picture slicer multi</title>
</svelte:head>

<div class="top">
	<div class="layout">
		<Nav />

		<div class="main">
			<slot />
		</div>

		<div class="foot">-</div>
	</div>
</div>

<style>
	.top {
		background-color: rgb(26, 42, 58);
		color: white;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	.layout {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
	}

	.main {
		background-color: rgba(0, 0, 0, 0.2);
		padding: 1rem;
		border-radius: 0.5rem;
		justify-self: center;
		max-width: 100%;
	}
</style>

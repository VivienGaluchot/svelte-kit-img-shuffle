<script lang="ts">
	import * as paths from '$app/paths';
</script>

<svelte:head>
	<title>Picture slicer</title>
</svelte:head>

<div class="layout">
	<header>
		<div class="logo-bar">
			<img src="{paths.base}/favicon.png" alt="logo" />
			<h1>Picture slicer</h1>
		</div>
	</header>

	<div class="main">
		<slot />
	</div>

	<footer>
		<a class="button" href="https://github.com/VivienGaluchot/svelte-kit-img-shuffle/issues"
			>🐞 see a bug?</a
		>
	</footer>
</div>

<style>
	.layout {
		min-height: calc(100% - 2rem);
		min-width: calc(100% - 2rem);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.main {
		justify-self: start;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	footer {
		text-align: center;
		font-weight: 200;
	}

	h1 {
		font-size: 1.5rem;
		margin: 0;
	}

	.logo-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}

	.logo-bar img {
		max-width: 1.5rem;
		max-height: 1.5rem;
		image-rendering: crisp-edges;
	}

	.logo-bar h1 {
		color: white;
		font-weight: 300;
	}
</style>

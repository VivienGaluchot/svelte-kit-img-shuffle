<script lang="ts">
	import * as paths from '$app/paths';
</script>

<svelte:head>
	<title>Picture slicer multi</title>
</svelte:head>

<div class="top">
	<div class="layout">
		<div class="main">
			<a class="logo-link" href="{paths.base}/">
				<img src="{paths.base}/favicon.png" alt="logo" />
				<h1>Picture slicer multi</h1>
			</a>
			<slot />
		</div>

		<div class="foot" />
	</div>
</div>

<style>
	.top {
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
		padding: 1rem;
		justify-self: center;
		max-width: 100%;
		min-width: 30rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h1 {
		margin: 0;
	}

	.logo-link {
		display: flex;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
	}

	.logo-link img {
		max-width: 2rem;
		max-height: 2rem;
		image-rendering: crisp-edges;
	}

	.logo-link h1 {
		color: white;
		font-weight: 300;
	}

	.logo-link:hover {
		color: rgba(0, 0, 0, 0.6);
	}
</style>

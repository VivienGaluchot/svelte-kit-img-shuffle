<script lang="ts">
</script>

<svelte:head>
	<title>Picture slicer multi</title>
</svelte:head>

<div class="top">
	<div class="layout">
		<div class="main">
			<h1><a class="nav-link" href="/">Picture slicer multi</a></h1>
			<slot />
		</div>

		<div class="foot" />
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

	.nav-link {
		color: rgba(0, 0, 0, 0.5);
		text-decoration: none;
		font-weight: 300;
	}

	.nav-link:hover {
		color: rgba(0, 0, 0, 0.6);
	}
</style>

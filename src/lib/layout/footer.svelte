<script lang="ts">
	import { PUBLIC_VERSION } from '$env/static/public';
</script>

<footer>
	<div>
		<a
			class="button"
			href="https://github.com/VivienGaluchot/svelte-kit-img-shuffle"
			target="_blank"
		>
			<i class="fa-brands fa-github" /> Contribute
		</a>
		<a
			class="button"
			href="https://github.com/VivienGaluchot/svelte-kit-img-shuffle/issues"
			target="_blank"
		>
			<i class="fa-solid fa-bug" /> Raise issue
		</a>
	</div>
	<div>
		<i class="fa-solid fa-code-branch" />
		{PUBLIC_VERSION}
	</div>
</footer>

<style>
	footer {
		text-align: center;
		font-weight: 200;
		font-size: 0.9rem;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		opacity: 0.8;
	}
</style>

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
			<i class="fa-solid fa-code-branch"></i>
			{PUBLIC_VERSION}
		</a>
		<a
			class="button"
			href="https://github.com/VivienGaluchot/svelte-kit-img-shuffle/issues"
			target="_blank"
		>
			<i class="fa-solid fa-bug"></i> Found a bug ?
		</a>
	</div>
	<iframe
		src="https://github.com/sponsors/VivienGaluchot/button"
		title="Sponsor VivienGaluchot"
		height="32"
		width="114"
		class="btn"
		style="border: 0; border-radius: 6px;"
	></iframe>
</footer>

<style>
	a {
		padding: 0rem 0.3rem;
		font-size: 0.9rem;
	}
	iframe {
		align-self: center;
	}
	footer {
		text-align: center;
		font-weight: 200;
		font-size: 0.9rem;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		opacity: 0.8;
		align-items: center;
	}
</style>

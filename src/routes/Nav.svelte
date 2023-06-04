<script>
	import { page } from '$app/stores';
</script>

<nav>
	<a class="nav-link" class:active={$page.url.pathname === '/'} href="/">Home</a>
	<a class="nav-link" class:active={$page.url.pathname === '/play'} href="/play">Play</a>
	<a class="nav-link" class:active={$page.url.pathname === '/about'} href="/about">About</a>
</nav>

<style>
	nav {
		display: flex;
		gap: 1rem;
	}
	a {
		color: rgba(255, 255, 255, 0.5);
		text-decoration: none;
	}
	a.active {
		color: white;
	}
</style>

<script lang="ts">
    import { page } from '$app/stores';
</script>

<svelte:head>
	<title>ASB Export Server for ARK: Survival Ascended</title>
</svelte:head>

<main class="grad h-100vh h-100svh p-8 text-balance">
    <h1 class="text-[35vmin] font-bold mt-[10%] leading-none text-center">{$page.status}</h1>
    <h2 class="text-[10vmin] mt-8 text-center">{$page.error?.message ?? 'An unexpected error occurred'}</h2>
</main>

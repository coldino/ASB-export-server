<svelte:head>
	<title>ASB Export Server for ARK: Survival Ascended</title>
</svelte:head>

<div class="grad h-100vh h-100svh">
	<!-- Top-right corner -->
	<div class="corner tr bg-#37423D absolute top-0 right-0 w-20 sm:w-50 h-50 sm:h-80">
		<enhanced:img
			class="absolute top-2 right-2 sm:top-6 sm:right-6 w-10 h-10 sm:w-16 sm:h-16"
			src="./quackdeck-128.png"
			alt="A cute cyan rubbery ducky logo"
		/>
	</div>

	<!-- Bottom-left corner -->
	<div class="bl bg-#37423D absolute bottom-0 w-20 sm:w-50 h-50 sm:h-80"></div>

	<!-- Content -->
	<div class="container mx-auto">
		<header class="mx-6 sm:mx-20 pt-20 z-10">
			<h1 class="text-24pt sm:text-36pt font-bold sansation font-bold">ARK Smart Breeding</h1>
			<h1 class="text-24pt sm:text-32pt font-bold gobold">EXPORT SERVER</h1>
			<h2 class="mt-4 mr-10 text-14pt sm:text-16pt max-w-160 balance sansation">
				This server allows dino exports to be sent from
				<span class="whitespace-nowrap">ARK: Survival Ascended</span>
				to
				<a class="whitespace-nowrap" href="https://cadon.github.io/ARKStatsExtractor/">ARK Smart Breeding</a>
				<br />
				even on consoles.
			</h2>
		</header>

		<enhanced:img
			class="w-80 md:w-160 float-right"
			src="./ASA_Logo_Transparent_780x827.png?w=640,400"
			alt="ARK: Survival Ascended big swooshy 'A' logo"
		/>
	</div>
</div>

<style lang="postcss">
	.balance {
		text-wrap: balance;
	}
	.tr {
		clip-path: polygon(0 0, 100% 100%, 100% 0);
	}
	.bl {
		clip-path: polygon(0 0, 100% 100%, 0 100%);
	}
</style>

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
			<h1 class="text-24pt sm:text-32pt font-bold">Ark Smark Breeding<br />EXPORT SERVER</h1>
			<h2 class="mt-4 mr-10 text-14pt sm:text-16pt balance">
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

	.grad {
		background-image: linear-gradient(
			50deg,
			hsl(189deg 100% 35%) 0%,
			hsl(186deg 58% 42%) 18%,
			hsl(179deg 44% 45%) 28%,
			hsl(170deg 38% 48%) 36%,
			hsl(159deg 36% 52%) 44%,
			hsl(148deg 38% 55%) 51%,
			hsl(137deg 40% 58%) 58%,
			hsl(126deg 42% 60%) 65%,
			hsl(115deg 48% 61%) 73%,
			hsl(108deg 55% 61%) 83%,
			hsl(102deg 63% 60%) 100%
		);
	}
</style>

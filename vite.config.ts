import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import presetUno from '@unocss/preset-uno';
import extractorSvelte from '@unocss/extractor-svelte';
import transformerDirectives from '@unocss/transformer-directives';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';


export default defineConfig({
	plugins: [
		UnoCSS({
			presets: [
				presetUno(),
			],
			extractors: [
				extractorSvelte(),
			],
			transformers: [
				transformerDirectives(),
			],
		}),
		enhancedImages(),
		sveltekit(),
	],
});
